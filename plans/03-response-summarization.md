# PRD-03: Response Summarization & Token Optimization

## Problem Statement

Every MCP tool returns full raw API responses via `jsonResponse(JSON.stringify(data, null, 2))`.
This causes massive token consumption for LLM-based consumers:

- `get_issues` (24 issues): **108,352 characters dropped** due to context overflow
- `get_projects` (100+ projects): **23,343 characters dropped**
- `get_linked_issues` (55 issues): **36,927 characters dropped**

A simple workflow (navigate to project, get issues, export one to Jira) consumed **~98K tokens**.
With summarization, the same workflow is estimated at **~20K tokens** — a 70-80% reduction.

Full API objects include verbose fields that LLM consumers rarely need: `_links` arrays, `_type`
metadata, `tenantId`, full timestamps, nested relationship objects, and vendor-specific fields.

## Goals

1. Reduce token usage by 70%+ for typical list operations
2. Maintain backward compatibility — full responses still available when needed
3. Keep implementation simple — no new API calls, just response shaping

## Non-Goals

- Server-side pagination UI (cursor management is the client's job)
- New API endpoints or Polaris API changes
- Changing the underlying service/API layer

## Design

### Approach: `summary` Parameter on List Tools

Add an optional `summary` boolean parameter (default: `true`) to all tools that return arrays. When
`true`, responses are trimmed to essential fields only. When `false`, the full raw API response is
returned (current behavior).

Default to `true` because MCP consumers are overwhelmingly LLMs that benefit from concise responses.
Users who need the full object can pass `summary: false` or use the single-resource get tools (e.g.,
`get_issue` for full detail on one issue).

### Response Shaping Implementation

Add a new utility module `src/mcp/summarize.ts` that provides field-picking/shaping functions per
resource type. These functions take a full API object and return a trimmed version.

**Universal fields to strip in summary mode:**

- `_links` — URL navigation (LLMs don't follow hypermedia links)
- `_type` — internal vendor type discriminators
- `tenantId` — always the same within a session
- `_collection` — pagination metadata (itemCount, pageCount, etc.)

### Summary Shapes by Resource

#### Portfolio

```typescript
// Full: { id, name, organizationId, description, _links, _type, tenantId, ... }
// Summary:
{
  id, name, organizationId;
}
```

#### Application

```typescript
// Full: { id, name, description, subscriptionType, entitlements, createdAt, updatedAt, inTrash, _links, ... }
// Summary:
{
  id, name, description;
}
```

#### Project

```typescript
// Full: { id, name, description, subItemType, defaultBranch, labelIds, createdAt, updatedAt, branches, _links, ... }
// Summary:
{ id, name, defaultBranch: { id, name } }
```

#### Branch

```typescript
// Full: { id, name, isDefault, createdAt, updatedAt, _links, ... }
// Summary:
{
  id, name, isDefault;
}
```

#### Issue (Findings)

```typescript
// Full: { id, _type, weaknessId, excluded, updatedAt, firstDetectedOn, type: { id, name, description, ... },
//         context: { toolType, toolId, scanMode, toolVersion }, occurrenceProperties: [...], triageProperties: [...],
//         componentLocations: [...], _links, ... }
// Summary:
{
  id,
  name: type.name,                         // extracted from type object
  severity: occurrenceProperties["severity"],
  cwe: occurrenceProperties["cwe"],
  file: occurrenceProperties["finding-key::filePath"],
  line: occurrenceProperties["finding-key::lineNumber"],
  toolType: context.toolType,
  status: triageProperties["status"],
  firstDetectedOn
}
```

#### Occurrence

```typescript
// Full: { id, tenantId, properties: [...key-value pairs...], type: {...}, _links, ... }
// Summary:
{
  id,
  issueId: properties["issue-id"],
  severity: properties["severity"],
  file: properties["finding-key::filePath"],
  line: properties["finding-key::lineNumber"],
  toolType: properties["tool-type"]
}
```

#### Test

```typescript
// Full: { id, projectId, branchId, status, assessmentType, testMode, scanMode, startedAt, completedAt, _links, ... }
// Summary:
{
  id, status, assessmentType, scanMode, startedAt, completedAt;
}
```

#### BugTrackingConfiguration

```typescript
// Full: { id, type, url, enabled, createdAt, updatedAt, details: {...}, _links, ... }
// Summary:
{
  id, type, url, enabled;
}
```

#### LinkedIssue

```typescript
// Full: { id, tenantId, issueId, branchId, status, issueKey, issueLink, createdAt, _links, ... }
// Summary:
{
  id, issueId, issueKey, issueLink, status;
}
```

#### ExternalProject

```typescript
// Full: { id, key, name, ... }
// Summary (already small, keep as-is):
{
  id, key, name;
}
```

### Tools to Update

All tools that return arrays via `getAllOffset()` or `getAllCursor()`:

| Tool                              | Resource                 | Expected Token Savings |
| --------------------------------- | ------------------------ | ---------------------- |
| `get_portfolios`                  | Portfolio                | Low (small response)   |
| `get_applications`                | Application              | Medium                 |
| `get_projects`                    | Project                  | **High**               |
| `get_branches`                    | Branch                   | Medium                 |
| `get_issues`                      | Issue                    | **Very High**          |
| `get_occurrences`                 | Occurrence               | **Very High**          |
| `get_tests`                       | Test                     | Medium                 |
| `get_bug_tracking_configurations` | BugTrackingConfiguration | Low                    |
| `get_external_projects`           | ExternalProject          | Low                    |
| `get_linked_issues`               | LinkedIssue              | **High**               |
| `get_config_project_mappings`     | ProjectMapping           | Medium                 |
| `get_labels`                      | Label                    | Low                    |
| `get_taxonomies`                  | Taxonomy                 | Medium                 |
| `get_component_versions`          | ComponentVersion         | **High**               |
| `get_component_origins`           | ComponentOrigin          | Medium                 |

Single-resource tools (`get_issue`, `get_project`, etc.) should NOT have a summary parameter — they
return one object and the user explicitly asked for full detail.

### Schema Change

For each list tool, add to the Zod schema:

```typescript
summary: z.boolean().optional().describe(
  "Return summarized results with only essential fields. Default: true. Set to false for full API response."
),
```

### Handler Change Pattern

```typescript
// Before:
handler: (async (args) => {
  const results = await someService.getThings(args);
  return jsonResponse(results);
});

// After:
handler: (async (args) => {
  const results = await someService.getThings(args);
  const { summary = true } = args;
  return jsonResponse(summary ? results.map(summarizeThing) : results);
});
```

### Response Metadata

When in summary mode, wrap the response with count metadata:

```typescript
{
  total: 24,
  items: [ ...summarized items... ],
  note: "Showing summarized results. Use summary=false for full API response, or get_issue(issue_id) for full detail on a single item."
}
```

This addresses the feedback about "no issue count preview" — the count is always present in summary
responses.

## Implementation Plan

### Phase 1: Core Infrastructure

1. Create `src/mcp/summarize.ts` with per-resource summarizer functions
2. Create `summarizeResponse(items, summarizer, note?)` wrapper that adds count + note
3. Add unit tests for each summarizer function

### Phase 2: High-Impact Tools

4. Update `get_issues` — highest token savings
5. Update `get_projects` — second highest impact
6. Update `get_occurrences` — high savings
7. Update `get_linked_issues` — high savings
8. Update `get_component_versions` — high savings

### Phase 3: Remaining List Tools

9. Update all remaining list tools (applications, branches, tests, configs, mappings, labels,
   taxonomies, component origins)

### Phase 4: Validation

10. Run full test suite
11. Manual testing with MCP inspector to verify summary vs full responses

## Success Metrics

- 70%+ reduction in response size for `get_issues` with 20+ results
- 50%+ reduction in response size for `get_projects` with 50+ results
- No regression in full-response mode (`summary: false`)
- All existing tests pass

## Risks & Mitigations

| Risk                                               | Mitigation                                                                                                                 |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Summary misses a field an LLM consumer needs       | Default to `true` but allow `false`; single-resource tools always return full objects                                      |
| Summarizer functions drift from API schema changes | Summarizers use optional chaining; unknown fields are simply not included                                                  |
| Breaking change for existing consumers             | Default `true` is a behavior change; document in CHANGELOG. Could default to `false` initially and flip later if preferred |

## Open Questions

1. Should `summary` default to `true` (optimized for LLMs, behavior change) or `false` (backward
   compatible, opt-in optimization)? Recommendation: `true` — MCP consumers are LLMs by definition.
2. Should single-resource tools also strip `_links`/`_type` even without a summary flag? These
   fields are never useful to LLMs. Recommendation: Yes, strip universally useless fields always.
