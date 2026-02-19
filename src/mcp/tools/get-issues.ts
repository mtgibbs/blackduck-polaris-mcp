import { z } from "zod";
import { getIssues } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z
    .string()
    .optional()
    .describe("Application ID to query issues for (mutually exclusive with project_id)"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID to query issues for (mutually exclusive with application_id)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  severity: z
    .string()
    .optional()
    .describe("Comma-separated severity filter: critical,high,medium,low"),
  tool_type: z
    .string()
    .optional()
    .describe("Comma-separated tool type filter: sast,sca,dast"),
  delta: z
    .string()
    .optional()
    .describe("Delta filter: new, common, resolved, new-in-test, new-post-test"),
  sort: z
    .string()
    .optional()
    .describe("Sort expression. Format: field|direction. Example: occurrence:severity|desc"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of issues to return (default: 100, max: 500)"),
};

export const getIssuesTool: ToolDefinition<typeof schema> = {
  name: "get_issues",
  description:
    "Get security issues for a project or application from the latest scan. Provide exactly one of project_id or application_id (they are mutually exclusive). Returns vulnerability details including type, severity, CWE, file path, triage state, and tool context. Use severity and tool_type filters to focus on critical findings. Use delta filter to see new/resolved issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    application_id,
    project_id,
    branch_id,
    test_id,
    severity,
    tool_type,
    delta,
    sort,
    max_results,
  }) => {
    if (!application_id && !project_id) {
      return errorResponse("Either application_id or project_id must be provided");
    }
    if (application_id && project_id) {
      return errorResponse("application_id and project_id are mutually exclusive");
    }

    const issues = await getIssues({
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      severity: severity?.split(",").map((s: string) => s.trim()),
      toolType: tool_type?.split(",").map((t: string) => t.trim()),
      delta,
      sort,
      first: max_results,
    });
    return jsonResponse(issues);
  },
};
