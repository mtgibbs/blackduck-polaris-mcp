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

## Implementation Plan

### Phase 1: Extract Valid Filter Keys from Specs
1. Parse each OpenAPI spec in `specs/` to extract filterable fields per endpoint
2. Cross-reference with actual API behavior (some specs may be incomplete)
3. Build the `FILTER_KEYS` map

### Phase 2: Update Tool Descriptions
4. Update all `filter` parameter descriptions with valid keys and examples
5. Update tool-level descriptions to mention filtering capabilities

### Phase 3: Add Filter Validation
6. Create `src/mcp/filter-validation.ts` module
7. Add unit tests for `extractFilterKeys` and `validateFilter`
8. Integrate validation into tool handlers that accept `filter`

### Phase 4: Add Convenience Parameters
9. Add `name` param to `get_projects` and `get_applications`
10. Add `project_id` param to `get_project_mappings`
11. Verify existing convenience params (`status` on `get_tests`, `severity`/`tool_type`/`delta` on
    `get_issues`) have good descriptions

## Success Metrics

- Zero "Please provide valid filter keys" errors when using documented filter keys
- LLM consumers can construct valid filters from tool descriptions alone
- Client-side validation catches invalid keys with helpful messages

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| OpenAPI specs don't list all valid filter keys | Cross-reference with API testing; keep validation as advisory (warn, don't block) |
| RSQL parsing regex misses edge cases | Simple extraction only; not a full parser. Pass-through on parse failure |
| API adds new filter keys we don't know about | Validation is optional; unknown keys get a warning but still pass through |
| Convenience params overlap with raw filter | Document that convenience params are combined with filter via AND |
