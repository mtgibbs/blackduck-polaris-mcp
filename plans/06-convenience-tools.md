# PRD-06: Convenience & Compound Tools

## Problem Statement

Several common workflows require too many sequential tool calls and produce excessive output. The
feedback identified specific gaps:

1. **No cross-application project search** — finding a project by name requires fetching all
   projects across all applications
2. **No bulk export** — exporting multiple issues requires calling `export_issues` N times
3. **No export status overview** — no way to see which issues have/haven't been exported

## Goals

1. Add compound tools that combine multi-step workflows into single operations
2. Reduce total tool calls for common workflows by 50%+
3. Keep compound tools composable — they should complement, not replace, atomic tools

## Non-Goals

- Replacing existing atomic tools
- Implementing full workflow orchestration
- Adding write operations beyond what the API supports

## Design

### Tool 1: `search_projects`

**Purpose:** Find projects by name across all applications without fetching everything.

**Why a new tool instead of improving `get_projects`:** The `get_projects` tool operates within a
single portfolio/application scope. Searching across applications requires querying the
portfolio-level project list, which is a different API call pattern. Also, search results benefit
from including the parent application context.

**Schema:**
```typescript
name: "search_projects",
description: "Search for projects by name across all applications in a portfolio. " +
  "Returns matching projects with their parent application context. " +
  "More efficient than calling get_projects for each application.",
schema: {
  portfolio_id: z.string().describe("Portfolio ID"),
  name: z.string().describe(
    "Project name to search for. Matched using RSQL filter (exact match). " +
    "Use get_projects with no name filter to browse all projects."
  ),
},
```

**Handler:**
```typescript
handler: async ({ portfolio_id, name }) => {
  // Use portfolio-level projects endpoint with name filter
  const projects = await portfolioApi.getProjects({
    portfolioId: portfolio_id,
    filter: `name=='${name}'`,
  });

  // Enrich with application context from _links or separate lookup
  const results = projects.map(p => ({
    id: p.id,
    name: p.name,
    applicationId: extractApplicationId(p),  // from _links
    defaultBranch: p.defaultBranch ? { id: p.defaultBranch.id, name: p.defaultBranch.name } : null,
  }));

  return jsonResponse({
    total: results.length,
    items: results,
  });
};
```

**Token savings:** Instead of fetching 100+ full project objects, returns only matching projects with
minimal fields.

### Tool 2: `bulk_export_issues`

**Purpose:** Export multiple issues to bug tracking in a single tool call.

**Schema:**
```typescript
name: "bulk_export_issues",
description: "Export multiple Polaris issues to an external bug tracking system (Jira/Azure DevOps) " +
  "in a single operation. Exports each issue individually and reports results. " +
  "Skips issues that are already exported.",
schema: {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_id: z.string().describe(
    "Polaris project ID. Used to auto-resolve project mapping and issue type."
  ),
  issue_ids: z.array(z.string()).describe(
    "Array of Polaris issue family IDs to export. Max 50 per call."
  ),
  bts_issue_type_id: z.string().optional().describe(
    "External issue type ID. Auto-resolved from project mapping if not provided."
  ),
  branch_id: z.string().optional().describe(
    "Branch ID. Defaults to project's default branch."
  ),
  dry_run: z.boolean().optional().describe(
    "If true, validates the export would succeed without creating tickets. Default: false."
  ),
},
annotations: { readOnlyHint: false, openWorldHint: true },
```

**Handler Logic:**
```typescript
handler: async (args) => {
  const { config_id, project_id, issue_ids, bts_issue_type_id, branch_id, dry_run = false } = args;

  // Validate max 50 issues
  if (issue_ids.length > 50) {
    return errorResponse("Maximum 50 issues per bulk export. Split into multiple calls.");
  }

  // Auto-resolve project mapping + issue type (same as smart export_issues)
  const { projectMappingId, issueTypeId } = await resolveExportParams(config_id, project_id, bts_issue_type_id);

  // Check which issues are already exported
  const linkedIssues = await bugTrackingApi.getLinkedIssues({ configurationId: config_id });
  const alreadyExported = new Set(linkedIssues.map(li => li.issueId));

  const results = {
    exported: [] as Array<{ issueId: string; issueKey: string; issueLink: string }>,
    skipped: [] as Array<{ issueId: string; reason: string }>,
    failed: [] as Array<{ issueId: string; error: string }>,
  };

  for (const issueId of issue_ids) {
    // Skip already exported
    if (alreadyExported.has(issueId)) {
      results.skipped.push({ issueId, reason: "Already exported" });
      continue;
    }

    if (dry_run) {
      results.exported.push({ issueId, issueKey: "(dry run)", issueLink: "(dry run)" });
      continue;
    }

    try {
      const linked = await bugTrackingApi.exportIssue({
        configurationId: config_id,
        projectMappingId,
        issueFamilyId: issueId,
        btsIssueTypeId: issueTypeId,
        branchId: branch_id,
      });
      results.exported.push({
        issueId,
        issueKey: linked.issueKey,
        issueLink: linked.issueLink,
      });
    } catch (e) {
      results.failed.push({ issueId, error: e.message });
    }
  }

  return jsonResponse({
    summary: {
      total: issue_ids.length,
      exported: results.exported.length,
      skipped: results.skipped.length,
      failed: results.failed.length,
    },
    ...results,
  });
};
```

**Token savings:** One call instead of N calls, plus skip-already-exported logic avoids duplicate
work.

### Tool 3: `get_export_status`

**Purpose:** Show which issues in a project have been exported and which haven't.

**Schema:**
```typescript
name: "get_export_status",
description: "Get export status for issues in a project — shows which issues have been exported " +
  "to external bug tracking and which haven't. Useful for planning bulk exports.",
schema: {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_id: z.string().describe("Polaris project ID"),
  branch_id: z.string().optional().describe("Branch ID. Defaults to project's default branch."),
  severity: z.string().optional().describe(
    "Filter by severity (comma-separated): critical, high, medium, low"
  ),
},
```

**Handler Logic:**
```typescript
handler: async (args) => {
  const { config_id, project_id, branch_id, severity } = args;

  // Fetch issues and linked exports in parallel
  const [issues, linkedIssues] = await Promise.all([
    findingsApi.getIssues({
      projectId: project_id,
      branchId: branch_id,
      testId: "latest",
      severity: severity?.split(","),
      first: 500,
      includeType: true,
      includeOccurrenceProperties: true,
    }),
    bugTrackingApi.getLinkedIssues({ configurationId: config_id }),
  ]);

  const exportedMap = new Map(linkedIssues.map(li => [li.issueId, li]));

  const exported = [];
  const notExported = [];

  for (const issue of issues) {
    const linked = exportedMap.get(issue.id);
    const summary = {
      issueId: issue.id,
      name: issue.type?.name,
      severity: issue.occurrenceProperties?.find(p => p.key === "severity")?.value,
    };

    if (linked) {
      exported.push({ ...summary, issueKey: linked.issueKey, issueLink: linked.issueLink });
    } else {
      notExported.push(summary);
    }
  }

  return jsonResponse({
    project_id,
    totalIssues: issues.length,
    exported: { count: exported.length, items: exported },
    notExported: { count: notExported.length, items: notExported },
  });
};
```

**Token savings:** Replaces `get_issues` + `get_linked_issues` (both verbose) with a single
summarized response.

## Implementation Plan

### Phase 1: Shared Auto-Resolution Helper
1. Extract the export parameter auto-resolution logic from PRD-05 into a shared helper
   `resolveExportParams(configId, projectId, btsIssueTypeId?)` in the bug-tracking service
2. Unit test the helper

### Phase 2: search_projects
3. Add `search_projects` tool definition
4. Implement handler using portfolio-level project filter
5. Add tests

### Phase 3: bulk_export_issues
6. Add `bulk_export_issues` tool definition
7. Implement handler with already-exported detection and dry_run support
8. Add tests (mock API calls, test skip/export/fail paths)

### Phase 4: get_export_status
9. Add `get_export_status` tool definition
10. Implement handler with parallel fetch and cross-reference
11. Add tests

### Phase 5: Registration & Documentation
12. Add all new tools to `src/mcp/tools/index.ts`
13. Update tool table in CLAUDE.md
14. Update README if needed

## Implementation Dependencies

- **PRD-05 (Smart Export):** The `resolveExportParams` helper should be built as part of PRD-05 and
  reused here. If PRD-06 is implemented first, build the helper here and PRD-05 can reuse it.
- **PRD-03 (Summarization):** `get_export_status` inherently returns summarized data. No dependency,
  but aligns with the summarization philosophy.

## Success Metrics

- `search_projects`: Find a project by name in 1 call (was: multiple `get_projects` calls)
- `bulk_export_issues`: Export 10 issues in 1 call (was: 10+ calls)
- `get_export_status`: Full export overview in 1 call (was: 2 verbose calls + manual cross-reference)
- All new tools have `summary`-style concise responses by default

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Bulk export rate limiting from Polaris API | Sequential calls with configurable batch size; max 50 per call |
| `search_projects` name filter is exact match only | Document this; RSQL `=like=` operator may not be supported |
| Large projects with 500+ issues in `get_export_status` | Cap at 500 issues (API default); document limitation |
| Compound tools harder to test | Each tool delegates to existing service functions; test at handler level with mocks |

## Open Questions

1. Should `bulk_export_issues` accept filters (severity, tool_type) instead of/in addition to
   explicit issue_ids? This would allow "export all critical SAST issues" in one call but adds
   complexity.
2. Should `get_export_status` also show triage status (dismissed, fix-by date) for each issue?
   Useful context for deciding what to export but adds response size.
3. Rate limiting — should `bulk_export_issues` have a configurable delay between API calls?
