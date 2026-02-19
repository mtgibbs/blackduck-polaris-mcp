import { z } from "zod";
import { exportFindingsIssues } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope the export (mutually exclusive with project_id)"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope the export (mutually exclusive with application_id)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filter: z
    .string()
    .optional()
    .describe("RSQL filter for issues. Example: occurrence:severity=in=('critical','high')"),
  sort: z
    .string()
    .optional()
    .describe(
      "Sort results by field. Example: occurrence:severity|desc",
    ),
  file_name: z.string().optional().describe("Name for the exported file"),
};

export const exportFindingsIssuesTool: ToolDefinition<typeof schema> = {
  name: "export_findings_issues",
  description:
    "Export security issues from Polaris Findings API as a JSON list. Returns issue details including type, severity, location, tool type, triage status, fix-by date, CWE/CVE, and links. Use filters to narrow results by severity or tool type.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    application_id,
    project_id,
    branch_id,
    test_id,
    filter,
    sort,
    file_name,
  }) => {
    if (!application_id && !project_id) {
      return errorResponse("Either application_id or project_id must be provided");
    }
    const items = await exportFindingsIssues({
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      filter,
      sort,
      fileName: file_name,
    });
    return jsonResponse(items);
  },
};
