import { z } from "zod";
import { exportIssue, getLinkedIssues } from "../../services/index.ts";
import { resolveExportParams } from "../export-helpers.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z
    .string()
    .describe("Bug tracking configuration ID (from get_bug_tracking_configurations)"),
  project_id: z
    .string()
    .describe("Polaris project ID"),
  issue_ids: z
    .array(z.string())
    .describe("Array of Polaris issue family IDs to export (max 50)"),
  bts_issue_type_id: z
    .string()
    .optional()
    .describe(
      "BTS issue type ID (optional - will use mapping default if not provided)",
    ),
  branch_id: z
    .string()
    .optional()
    .describe("Polaris branch ID"),
};

export const bulkExportIssuesTool: ToolDefinition<typeof schema> = {
  name: "bulk_export_issues",
  description:
    "Export multiple Polaris security issues to an external bug tracking system (Jira/Azure DevOps) in a single operation. Automatically resolves project mapping, skips already-exported issues, and handles errors per-issue without stopping the batch. Max 50 issues per call.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    config_id,
    project_id,
    issue_ids,
    bts_issue_type_id,
    branch_id,
  }) => {
    // Validate max 50 issues
    if (issue_ids.length > 50) {
      return errorResponse(
        `Maximum 50 issues allowed per bulk export. You provided ${issue_ids.length} issues.`,
      );
    }

    if (issue_ids.length === 0) {
      return errorResponse("No issue IDs provided.");
    }

    // Auto-resolve project_mapping_id and bts_issue_type_id
    const resolved = await resolveExportParams(
      config_id,
      project_id,
      bts_issue_type_id,
    );
    if ("error" in resolved) {
      return errorResponse(resolved.error);
    }
    const { projectMappingId, issueTypeId } = resolved;

    // Fetch linked issues once to build already-exported set
    const linkedIssues = await getLinkedIssues({
      configurationId: config_id,
    });
    const alreadyExported = new Set(
      linkedIssues.map((linked) => linked.issueId),
    );

    // Partition issues into exported and non-exported
    const toExport = issue_ids.filter((id) => !alreadyExported.has(id));
    const skipped = issue_ids.filter((id) => alreadyExported.has(id));

    // Export each non-exported issue sequentially
    const exported: Array<{ issueId: string; result: unknown }> = [];
    const failed: Array<{ issueId: string; error: string }> = [];

    for (const issueId of toExport) {
      try {
        const result = await exportIssue({
          configurationId: config_id,
          projectMappingId,
          issueFamilyId: issueId,
          btsIssueTypeId: issueTypeId,
          branchId: branch_id,
        });
        exported.push({ issueId, result });
      } catch (error) {
        failed.push({
          issueId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return jsonResponse({
      summary: {
        total: issue_ids.length,
        exported: exported.length,
        skipped: skipped.length,
        failed: failed.length,
      },
      exported,
      skipped: skipped.map((issueId) => ({ issueId })),
      failed,
    });
  },
};
