# PRD-04: Filter Documentation & Validation

## Problem Statement

Users attempt RSQL filter queries and receive unhelpful errors:

```
filter: "application.id=='8818e0a8-af9f-48da-8925-90171bd07e36'"
Error: "Please provide valid filter keys"
```

There is no documentation of valid filter keys in tool descriptions, no examples, and no helpful
error messages listing what keys are actually valid. Users resort to trial-and-error or fall back to
fetching all results and filtering client-side (wasting tokens).

The Polaris API OpenAPI specs define valid filter keys per endpoint, but this information is not
surfaced to MCP tool consumers.

## Goals

1. Document valid filter keys and syntax examples in every tool description that accepts a `filter`
   parameter
2. Add client-side filter key validation with helpful error messages before making API calls
3. Provide convenience parameters for the most common filter patterns (reducing need for raw RSQL)
4. Document triage field exclusivity rules and valid filter namespaces for `triage_issues`
5. Document which filter keys work with which operations (triage filters differ from query filters)

## Non-Goals

- Implementing a full RSQL parser
- Supporting every possible filter combination
- Changing the Polaris API's filter behavior

## Design

### Part 1: Enhanced Tool Descriptions

Update every tool that exposes a `filter` parameter to include valid keys and examples directly in
the tool description string. LLM consumers read tool descriptions to understand parameters.

#### Example: `get_projects`

**Before:**
```
filter: z.string().optional().describe("RSQL filter string")
```

**After:**
```
filter: z.string().optional().describe(
  "RSQL filter string. Valid keys: name, description, subItemType, inTrash. " +
  "Operators: == != =in=() =out=(). Logical: ; (AND) , (OR). " +
  "Examples: \"name=='my-project'\", \"subItemType=='SBOMProject'\", \"inTrash==false\""
)
```

### Valid Filter Keys by Tool

These should be extracted from the OpenAPI specs in `specs/` and documented per tool.

#### Portfolio API Tools

| Tool | Valid Filter Keys |
|------|------------------|
| `get_applications` | `name`, `description`, `subscriptionType`, `inTrash` |
| `get_projects` | `name`, `description`, `subItemType`, `inTrash` |
| `get_branches` | `name`, `isDefault` |
| `get_portfolio_branches` | `name`, `isDefault`, `projectId`, `applicationId` |
| `get_project_sub_resources` | `applicationId`, `projectId`, `branchId`, `labelId`, `name`, `isDefault` |
| `get_labels` | `name` |
| `get_dashboard` | `applicationId` |

#### Findings API Tools

| Tool | Valid Filter Keys |
|------|------------------|
| `get_issues` | (uses convenience params, raw filter also accepted) `occurrence:severity`, `context:tool-type`, `special:delta`, `issue:status`, `occurrence:cwe` |
| `get_occurrences` | `occurrence:issue-id`, `occurrence:severity`, `occurrence:finding-key::filePath` |
| `get_issue_count` | Same as `get_issues` filter keys |
| `get_component_versions` | `componentVersion:name`, `componentVersion:version`, `componentVersion:license` |
| `get_component_origins` | `componentOrigin:name`, `componentOrigin:type` |
| `get_taxonomies` | `taxonomy:name`, `taxonomy:standard` |

#### Tests API Tools

| Tool | Valid Filter Keys |
|------|------------------|
| `get_tests` | `projectId`, `branchId`, `status`, `assessmentType`, `scanMode`, `testMode` |

#### Bug Tracking API Tools

| Tool | Valid Filter Keys |
|------|------------------|
| `get_bug_tracking_configurations` | `type`, `url`, `enabled` |
| `get_external_projects` | `key`, `name` |
| `get_project_mappings` | `configurationId`, `projectId`, `btsProjectKey` |

### Part 1b: Triage API Documentation

The `triage_issues` tool caused 5 failed attempts (~7,500 wasted tokens) in real usage due to
undocumented field exclusivity rules and filter namespace confusion. This is the highest-friction
documentation gap.

#### Triage Property Exclusivity Rules

The following rules are enforced by the Polaris API but not documented in the tool description:

| Combination | Valid? | Notes |
|-------------|--------|-------|
| `dismissal-reason` + `comment` | Yes | Dismiss with reason. `status` auto-set to `dismissed`, `is-dismissed` auto-set to `true` |
| `status` + `comment` | Yes | Change status (e.g., `to-be-fixed`, `not-dismissed`) |
| `owner` + `fix-by` + `comment` | Yes | Assign ownership and fix deadline |
| `status` + `dismissal-reason` | **No** | Mutually exclusive — API returns error |
| `is-dismissed` + anything | **No** | `is-dismissed` is auto-calculated, cannot be set manually |
| `status` + `is-dismissed` | **No** | Same — `is-dismissed` is read-only |

**Valid triage property values:**

| Key | Type | Valid Values |
|-----|------|-------------|
| `status` | string | `"dismissed"`, `"to-be-fixed"`, `"not-dismissed (default)"` |
| `dismissal-reason` | string | `"component-excluded"`, `"intentional"`, `"false-positive"`, `"other"`, `"unset"` |
| `is-dismissed` | boolean | **Read-only** — auto-calculated from status, cannot be set |
| `owner` | string/null | User UUID, or `null` to clear |
| `fix-by` | string/null | ISO 8601 timestamp, or `null` to clear |
| `comment` | string/null | Any string, or `null` to clear |

#### Updated `triage_issues` Tool Description

The current description is minimal. Replace with:

```typescript
description: "Bulk triage security issues matching a filter within an application or project. " +
  "Sets triage properties such as status, dismissal-reason, owner, fix-by date, or comment. " +
  "Returns the count of triaged issues.\n\n" +
  "FIELD RULES:\n" +
  "- To dismiss: use {dismissal-reason, comment} only. Status auto-sets to 'dismissed'.\n" +
  "- To change status: use {status, comment} only. Do NOT combine with dismissal-reason.\n" +
  "- To assign: use {owner, fix-by, comment}.\n" +
  "- NEVER set is-dismissed — it is auto-calculated.\n\n" +
  "FILTER NAMESPACES (prefix required):\n" +
  "- occurrence: — file/severity/cwe (e.g., occurrence:filename, occurrence:severity)\n" +
  "- triage: — triage state (e.g., triage:status, triage:dismissal-reason)\n" +
  "- context: — scan context (e.g., context:tool-type)\n" +
  "- type: — issue type (e.g., type:name, type:localized-name)\n" +
  "- special: — delta queries (e.g., special:delta==new)\n\n" +
  "FILTER EXAMPLES:\n" +
  "- Dismiss by filename: filter=\"occurrence:filename=in=('Test1.cs','Test2.cs')\"\n" +
  "- Dismiss by severity: filter=\"occurrence:severity=='low'\"\n" +
  "- Filter by triage status: filter=\"triage:status=='not-reviewed'\"\n\n" +
  "NOTE: occurrence:id does NOT work as a triage filter. Use occurrence:filename or " +
  "occurrence:occurrence-id instead.",
```

#### Triage Filter Keys

The triage endpoint accepts the same filter keys as the issues query endpoint, but the following
are confirmed to work and not work in practice:

**Confirmed working:**
| Filter Key | Example |
|-----------|---------|
| `occurrence:filename` | `occurrence:filename=in=('Test1.cs','Test2.cs')` |
| `occurrence:severity` | `occurrence:severity=='medium'` |
| `occurrence:occurrence-id` | `occurrence:occurrence-id=in=('uuid1','uuid2')` |
| `triage:status` | `triage:status=='not-reviewed'` |
| `context:tool-type` | `context:tool-type=='sast'` |
| `type:name` | `type:name=='Null Pointer Dereference'` |
| `special:delta` | `special:delta==new` |

**Confirmed NOT working:**
| Filter Key | Note |
|-----------|------|
| `occurrence:id` | Returns 0 results — use `occurrence:occurrence-id` instead |
| `id` (bare) | Not a valid filter key |

#### `triage_properties` Schema Enhancement

Update the Zod schema to include valid values in descriptions:

```typescript
triage_properties: z.array(z.object({
  key: z.enum(["comment", "status", "dismissal-reason", "is-dismissed", "owner", "fix-by"])
    .describe(
      "Triage property key. RULES: " +
      "(1) For dismissal, use only 'dismissal-reason' + 'comment' — status auto-sets. " +
      "(2) For status change, use only 'status' + 'comment' — do NOT combine with dismissal-reason. " +
      "(3) NEVER set 'is-dismissed' — it is auto-calculated and will error."
    ),
  value: z.union([z.string(), z.boolean(), z.null()])
    .describe(
      "Property value. Valid values by key: " +
      "status: 'dismissed'|'to-be-fixed'|'not-dismissed (default)'. " +
      "dismissal-reason: 'false-positive'|'intentional'|'component-excluded'|'other'|'unset'. " +
      "owner: user UUID or null. fix-by: ISO 8601 date or null. comment: any string or null."
    ),
})).describe("Array of triage properties to set on matching issues."),
```

#### Client-Side Triage Validation

Add pre-call validation in the `triage_issues` handler:

```typescript
// Validate triage property combinations before API call
const keys = args.triage_properties.map(p => p.key);

if (keys.includes("is-dismissed")) {
  return errorResponse(
    "Cannot set 'is-dismissed' — it is auto-calculated by the API. " +
    "To dismiss issues, use {dismissal-reason: 'false-positive', comment: '...'} instead."
  );
}

if (keys.includes("status") && keys.includes("dismissal-reason")) {
  return errorResponse(
    "Cannot set both 'status' and 'dismissal-reason' (exclusive fields). " +
    "To dismiss: use {dismissal-reason, comment} only — status auto-sets to 'dismissed'. " +
    "To change status: use {status, comment} only."
  );
}
```

### Part 2: Client-Side Filter Validation

Add optional pre-validation of filter keys before sending requests to the API. This gives users
clear error messages immediately rather than cryptic API errors.

#### Implementation

Create a `src/mcp/filter-validation.ts` module:

```typescript
// Known valid filter keys per resource type
const FILTER_KEYS: Record<string, string[]> = {
  "portfolio.applications": ["name", "description", "subscriptionType", "inTrash"],
  "portfolio.projects": ["name", "description", "subItemType", "inTrash"],
  "portfolio.branches": ["name", "isDefault"],
  "findings.issues": ["occurrence:severity", "context:tool-type", "special:delta", "issue:status"],
  "findings.occurrences": ["occurrence:issue-id", "occurrence:severity"],
  "tests": ["projectId", "branchId", "status", "assessmentType"],
  "bugtracking.configurations": ["type", "url", "enabled"],
  // ...
};

/**
 * Extract keys from an RSQL filter string using simple regex.
 * Not a full parser — just extracts the left-hand side of comparison operators.
 */
function extractFilterKeys(filter: string): string[] {
  // Matches: key==value, key!=value, key=in=(...), key=out=(...)
  const keyPattern = /([a-zA-Z0-9:._-]+)\s*(?:==|!=|=in=|=out=)/g;
  const keys: string[] = [];
  let match;
  while ((match = keyPattern.exec(filter)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

/**
 * Validate filter keys against known valid keys for a resource.
 * Returns null if valid, or an error message string if invalid.
 */
export function validateFilter(
  filter: string,
  resourceType: string,
): string | null {
  const validKeys = FILTER_KEYS[resourceType];
  if (!validKeys) return null; // No validation available for this resource

  const usedKeys = extractFilterKeys(filter);
  const invalidKeys = usedKeys.filter((k) => !validKeys.includes(k));

  if (invalidKeys.length > 0) {
    return `Invalid filter key(s): ${invalidKeys.join(", ")}. ` +
      `Valid keys for ${resourceType}: ${validKeys.join(", ")}. ` +
      `RSQL syntax: key==value, key!=value, key=in=(v1,v2), key=out=(v1,v2). ` +
      `Logical: ; (AND), , (OR).`;
  }

  return null;
}
```

#### Handler Integration

```typescript
// In tool handler, before calling service:
if (args.filter) {
  const error = validateFilter(args.filter, "portfolio.projects");
  if (error) return errorResponse(error);
}
```

### Part 3: Convenience Parameters for Common Filters

Several tools already do this well — `get_issues` has `severity`, `tool_type`, and `delta`
convenience parameters that are converted to RSQL internally. Extend this pattern to other
frequently-filtered tools.

#### `get_projects` — Add `name` Parameter

```typescript
name: z.string().optional().describe(
  "Filter projects by name (case-sensitive substring match). " +
  "Equivalent to filter=\"name=='value'\""
),
```

Handler builds RSQL: `name=='${name}'`

#### `get_applications` — Add `name` Parameter

Same pattern as projects.

#### `get_tests` — Already Has `status` Convenience Parameter

The `get_tests` tool already has a `status` param. Verify it's documented with valid values in the
description.

#### `get_project_mappings` — Add `project_id` Convenience Parameter

```typescript
project_id: z.string().optional().describe(
  "Filter mappings by Polaris project ID"
),
```

Handler builds RSQL: `projectId=='${project_id}'`

### Part 1c: Scan Creation Tool Description Enhancement

The `create_test` tool has thorough documentation of valid assessment type / test mode / scan mode
combinations, but lacks guidance on **common scan patterns**. In real usage, a user asked to "start
a static test" and the agent created SAST only, when the user expected both SAST and SCA (the
standard security scan workflow). This led to a follow-up request and wasted tokens.

#### Current `assessment_types` Description
```
"Assessment types: SAST, SCA, DAST, or EXTERNAL_ANALYSIS (required array)"
```

#### Updated `assessment_types` Description
```typescript
assessment_types: z.array(z.string()).describe(
  "Assessment types to run (required array). Valid values: SAST, SCA, DAST, EXTERNAL_ANALYSIS.\n\n" +
  "COMMON PATTERNS:\n" +
  "- Comprehensive security scan: ['SAST', 'SCA'] (recommended default for most workflows)\n" +
  "- Code analysis only: ['SAST']\n" +
  "- Dependency/license scan only: ['SCA']\n" +
  "- Web application scan: ['DAST']\n" +
  "- Import third-party results: ['EXTERNAL_ANALYSIS']\n\n" +
  "NOTE: Most security workflows require both SAST (code vulnerabilities) and SCA " +
  "(dependency vulnerabilities). When the user asks for a 'scan', 'security scan', or " +
  "'static test' without specifying a type, prefer ['SAST', 'SCA'] over ['SAST'] alone."
),
```

#### Updated Tool Description

Add common patterns section to the tool description:

```typescript
description: `Create new security scan test(s) in Polaris. Returns 207 Multi-Status with ` +
  `individual test creation results. If multiple assessment types are provided, a separate ` +
  `test is created for each.\n\n` +
  `COMMON SCAN PATTERNS:\n` +
  `- "Run a scan" / "security scan" → assessment_types: ["SAST", "SCA"]\n` +
  `- "Static analysis" / "code scan" → assessment_types: ["SAST"]\n` +
  `- "Dependency scan" / "SCA scan" → assessment_types: ["SCA"]\n` +
  `- "Web app scan" / "DAST" → assessment_types: ["DAST"]\n\n` +
  `Valid assessment type / test mode / scan mode combinations:\n` +
  // ... existing combinations ...
```

This is a documentation-only change — no logic changes needed. The guidance helps LLM consumers
choose the right assessment types based on natural-language user requests.

## Implementation Plan

### Phase 1: Triage Documentation & Validation (Highest Impact)
1. Update `triage_issues` tool description with field exclusivity rules, valid values, and filter
   namespace documentation
2. Update `triage_properties` Zod schema descriptions with valid values per key
3. Add client-side triage property validation (is-dismissed rejection, status+dismissal-reason
   mutual exclusion)
4. Add unit tests for triage validation logic

### Phase 2: Extract Valid Filter Keys from Specs
5. Parse each OpenAPI spec in `specs/` to extract filterable fields per endpoint
6. Cross-reference with actual API behavior (some specs may be incomplete)
7. Build the `FILTER_KEYS` map

### Phase 3: Update Tool Descriptions
8. Update all `filter` parameter descriptions with valid keys and examples
9. Update tool-level descriptions to mention filtering capabilities
10. Add filter namespace documentation to all Findings API tools (occurrence:, triage:, context:,
    type:, special:)
11. Update `create_test` tool description and `assessment_types` description with common scan
    patterns and default guidance (SAST+SCA for generic "scan" requests)

### Phase 4: Add Filter Validation
11. Create `src/mcp/filter-validation.ts` module
12. Add unit tests for `extractFilterKeys` and `validateFilter`
13. Integrate validation into tool handlers that accept `filter`

### Phase 5: Add Convenience Parameters
14. Add `name` param to `get_projects` and `get_applications`
15. Add `project_id` param to `get_project_mappings`
16. Verify existing convenience params (`status` on `get_tests`, `severity`/`tool_type`/`delta` on
    `get_issues`) have good descriptions

## Success Metrics

- Zero "Please provide valid filter keys" errors when using documented filter keys
- LLM consumers can construct valid filters from tool descriptions alone
- Client-side validation catches invalid keys with helpful messages
- Zero failed triage attempts due to field exclusivity confusion (was: 5 attempts per session)
- Triage operations succeed on first try using tool description guidance alone

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| OpenAPI specs don't list all valid filter keys | Cross-reference with API testing; keep validation as advisory (warn, don't block) |
| RSQL parsing regex misses edge cases | Simple extraction only; not a full parser. Pass-through on parse failure |
| API adds new filter keys we don't know about | Validation is optional; unknown keys get a warning but still pass through |
| Convenience params overlap with raw filter | Document that convenience params are combined with filter via AND |
| Triage exclusivity rules change in future API versions | Validation is advisory; if API accepts a combo we reject, user can bypass with raw API |
| `occurrence:id` vs `occurrence:occurrence-id` confusion | Explicitly document the non-working keys alongside working alternatives |
