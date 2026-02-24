# PRD-05: Smart Export Workflow & Defaults

## Problem Statement

Exporting a single Polaris issue to Jira requires **5 sequential tool calls** to gather prerequisite
IDs:

1. `get_branches` → get `branch_id`
2. `get_bug_tracking_configurations` → get `config_id`
3. `get_config_project_mappings` → get `project_mapping_id`
4. `get_external_issue_types` → get `bts_issue_type_id`
5. `export_issues` → finally export

If any parameter is missing (e.g., `bts_issue_type_id`), the API returns a **500 error** instead of
a helpful 400 with validation details. The first export attempt in the feedback session failed due to
this.

Additionally, the `get_external_projects` tool failed with a limit validation error because no
default limit was set.

## Goals

1. Reduce the export workflow from 5 calls to 1-2 calls in the common case
2. Add smart defaults that auto-resolve missing parameters
3. Improve parameter validation with clear error messages before hitting the API
4. Set sensible defaults for pagination limits across all tools

## Non-Goals

- Bulk export (covered in PRD-06)
- Changing the Polaris API contract
- Auto-creating bug tracking configurations or project mappings

## Design

### Part 1: Smart `export_issues` with Auto-Resolution

Enhance the `export_issues` tool handler to auto-resolve optional parameters when they can be
unambiguously determined.

#### Current Schema
```typescript
config_id: z.string()          // required
project_mapping_id: z.string() // required
issue_id: z.string()           // required
bts_issue_type_id: z.string()  // optional (but API 500s without it for new tickets)
bts_key: z.string()            // optional (link to existing ticket)
branch_id: z.string()          // optional
```

#### New Schema
```typescript
config_id: z.string().describe(
  "Bug tracking configuration ID. Use get_bug_tracking_configurations to find this."
),
project_id: z.string().optional().describe(
  "Polaris project ID. When provided with config_id, auto-resolves project_mapping_id and bts_issue_type_id."
),
project_mapping_id: z.string().optional().describe(
  "Project mapping ID. Auto-resolved from project_id + config_id if not provided."
),
issue_id: z.string().describe(
  "Polaris issue family ID to export."
),
bts_issue_type_id: z.string().optional().describe(
  "External issue type ID (e.g., Bug, Task). Auto-resolved from project mapping default if not provided. " +
  "Required when creating a new ticket (no bts_key)."
),
bts_key: z.string().optional().describe(
  "Existing external ticket key to link to (e.g., 'PROJ-123'). If provided, bts_issue_type_id is not needed."
),
branch_id: z.string().optional().describe(
  "Branch ID. If omitted, uses the project's default branch."
),
```

#### Auto-Resolution Logic

```typescript
handler: async (args) => {
  let { config_id, project_id, project_mapping_id, issue_id, bts_issue_type_id, bts_key, branch_id } = args;

  // Step 1: Auto-resolve project_mapping_id from project_id + config_id
  if (!project_mapping_id && project_id) {
    const mappings = await bugTrackingApi.getConfigProjectMappings({ configurationId: config_id });
    const mapping = mappings.find(m => m.projectId === project_id);
    if (!mapping) {
      return errorResponse(
        `No project mapping found for project ${project_id} in config ${config_id}. ` +
        `Use get_config_project_mappings to see available mappings, or create one with create_config_project_mapping.`
      );
    }
    project_mapping_id = mapping.id;

    // Step 2: Auto-resolve bts_issue_type_id from mapping default
    if (!bts_issue_type_id && !bts_key) {
      bts_issue_type_id = mapping.btsIssueType?.id;
      if (!bts_issue_type_id) {
        return errorResponse(
          `Project mapping ${mapping.id} has no default issue type. ` +
          `Provide bts_issue_type_id explicitly. Use get_external_issue_types to find valid types.`
        );
      }
    }
  }

  // Step 3: Validate required params before calling API
  if (!project_mapping_id) {
    return errorResponse(
      "Either project_mapping_id or project_id is required. " +
      "Use project_id for auto-resolution, or provide project_mapping_id directly."
    );
  }

  if (!bts_issue_type_id && !bts_key) {
    return errorResponse(
      "bts_issue_type_id is required when creating a new ticket (no bts_key provided). " +
      "Use get_external_issue_types(config_id, project_key) to find valid issue types."
    );
  }

  // Step 4: Call the API
  const result = await bugTrackingApi.exportIssue({
    configurationId: config_id,
    projectMappingId: project_mapping_id,
    issueFamilyId: issue_id,
    btsIssueTypeId: bts_issue_type_id,
    btsKey: bts_key,
    branchId: branch_id,
  });

  return jsonResponse(result);
};
```

#### Simplified Workflow with Auto-Resolution

**Before (5 calls):**
```
1. get_branches(portfolio_id, app_id, project_id) → branch_id
2. get_bug_tracking_configurations() → config_id
3. get_config_project_mappings(config_id) → project_mapping_id
4. get_external_issue_types(config_id, project_key) → bts_issue_type_id
5. export_issues(config_id, project_mapping_id, issue_id, bts_issue_type_id, branch_id)
```

**After (2 calls):**
```
1. get_bug_tracking_configurations() → config_id
2. export_issues(config_id, project_id, issue_id)
   // auto-resolves: project_mapping_id, bts_issue_type_id, branch_id (default)
```

### Part 2: Pre-Call Validation

Add explicit validation in tool handlers before calling the API, converting potential 500s into
clear 400-style error messages.

#### `export_issues` Validation
- Require `project_mapping_id` or `project_id` (at least one)
- Require `bts_issue_type_id` when `bts_key` is not provided
- Validate that `config_id` is a valid UUID format

#### `create_config_project_mapping` Validation
- Validate `bts_issue_type` is provided (required by API)
- Validate `bts_project_key` is not empty

### Part 3: Sensible Pagination Defaults

The feedback noted `get_external_projects` failed with "must be less than or equal to 50". Several
offset-based tools pass through to `getAllOffset()` which uses `_limit=100`, but some endpoints have
lower maximums.

#### Fix: Respect Per-Endpoint Limits

In the bug-tracking service layer, set appropriate defaults:

```typescript
// get_external_projects: API max is 50
getExternalProjects(opts) {
  return client.getAllOffset(path, params, accept, /* limit */ 50);
}
```

#### Audit All Endpoints for Max Limits

| Endpoint | Current Default | API Max | Fix |
|----------|----------------|---------|-----|
| Bug tracking configurations | 100 | ? | Verify |
| External projects | 100 | **50** | **Set to 50** |
| Project mappings | 100 | ? | Verify |
| External issue types | 100 | ? | Verify |
| Linked issues | 100 | ? | Verify |

### Part 4: Branch ID Default Resolution

Multiple tools accept `branch_id` as optional with "defaults to default branch" in the description,
but the default resolution happens at different layers. Standardize this.

The Findings API already defaults to the project's default branch when `branchId` is omitted. For
the bug tracking export, ensure the same behavior — if `branch_id` is not provided, omit it from the
API call and let the server use the default.

Document this clearly:
```typescript
branch_id: z.string().optional().describe(
  "Branch ID. If omitted, the project's default branch is used."
),
```

## Implementation Plan

### Phase 1: Export Auto-Resolution
1. Update `export_issues` schema to add `project_id` parameter
2. Make `project_mapping_id` optional (was required)
3. Implement auto-resolution logic in handler
4. Add pre-call validation with clear error messages
5. Add unit tests for auto-resolution and validation paths

### Phase 2: Pagination Defaults
6. Audit all `getAllOffset` calls against API max limits
7. Fix `getExternalProjects` to use limit=50
8. Fix any other endpoints with known lower limits

### Phase 3: Validation Improvements
9. Add UUID format validation for ID parameters (optional, advisory)
10. Improve error messages for missing required parameters across all bug tracking tools

## Success Metrics

- Export workflow achievable in 2 tool calls (down from 5)
- Zero 500 errors from missing `bts_issue_type_id`
- Zero limit validation errors from `get_external_projects`
- Clear error messages for all validation failures

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Auto-resolution adds latency (extra API calls) | Only when parameters are omitted; explicit params skip resolution |
| Multiple project mappings for same project+config | Return error asking user to specify `project_mapping_id` explicitly |
| Project mapping has no default issue type | Clear error message directing user to `get_external_issue_types` |
| Breaking change: `project_mapping_id` no longer required | It becomes optional, not removed. Existing calls still work |
