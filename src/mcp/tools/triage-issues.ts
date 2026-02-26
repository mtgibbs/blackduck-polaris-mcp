import { z } from "zod";
import { triageIssues } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { validateFilter } from "../filter-validation.ts";

export const schema = {
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope triage (mutually exclusive with project_id)"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope triage (mutually exclusive with application_id)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter for issues to triage. Example: occurrence:id=in=('id1','id2') or triage:status=='not-reviewed'",
    ),
  triage_properties: z
    .array(
      z.object({
        key: z
          .enum(["comment", "status", "dismissal-reason", "is-dismissed", "owner", "fix-by"])
          .describe(
            "Triage attribute key. IMPORTANT: is-dismissed is read-only (auto-calculated). status and dismissal-reason are mutually exclusive - use only one.",
          ),
        value: z
          .union([z.string(), z.boolean(), z.null()])
          .describe(
            "Triage attribute value. Valid values per key: status=['dismissed','to-be-fixed','not-dismissed'], dismissal-reason=['false-positive','intentional','test-code','other'], is-dismissed=[true,false] (read-only), comment=string, owner=string (user email), fix-by=ISO-8601 date string",
          ),
      }),
    )
    .describe(
      "Array of triage properties to set. Valid keys: comment, status, dismissal-reason, owner, fix-by. Note: is-dismissed is read-only.",
    ),
};

export const triageIssuesTool: ToolDefinition<typeof schema> = {
  name: "triage_issues",
  description:
    "Bulk triage security issues matching a filter within an application or project. Sets triage properties such as status (dismissed/to-be-fixed/not-dismissed), dismissal-reason, owner, fix-by date, or comment. Returns the count of triaged issues.\n\n" +
    "FIELD RULES:\n" +
    "- To dismiss: use {dismissal-reason, comment} only. Status auto-sets to 'dismissed'.\n" +
    "- To change status: use {status, comment} only. Do NOT combine with dismissal-reason.\n" +
    "- NEVER set is-dismissed — it is auto-calculated (read-only).\n\n" +
    "FILTER NAMESPACES: occurrence:, triage:, context:, type:, special:\n" +
    "Valid filter keys: occurrence:filename, occurrence:severity, occurrence:occurrence-id, triage:status, context:tool-type, type:name, special:delta\n" +
    "Note: occurrence:id and bare id do NOT work (return 0 results). Use occurrence:occurrence-id instead.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    application_id,
    project_id,
    branch_id,
    test_id,
    filter,
    triage_properties,
  }) => {
    if (!application_id && !project_id) {
      return errorResponse("Either application_id or project_id must be provided");
    }
    if (application_id && project_id) {
      return errorResponse("application_id and project_id are mutually exclusive");
    }

    if (filter) {
      const error = validateFilter(filter, "findings.issues");
      if (error) return errorResponse(error);
    }

    const result = await triageIssues({
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      filter,
      triageProperties: triage_properties,
    });
    return jsonResponse(result);
  },
};
