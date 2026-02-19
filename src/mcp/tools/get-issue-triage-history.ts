import { z } from "zod";
import { getIssueTriageHistory } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  issue_id: z.string().describe("Issue ID to retrieve triage history for"),
  application_id: z.string().optional().describe("Application ID for scoping"),
  project_id: z.string().optional().describe("Project ID for scoping"),
  branch_id: z.string().optional().describe("Branch ID for scoping"),
  test_id: z.string().optional().describe("Test ID or 'latest' for scoping"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of triage history transactions to return (default 100)"),
};

export const getIssueTriageHistoryTool: ToolDefinition<typeof schema> = {
  name: "get_issue_triage_history",
  description:
    "Get the triage history for a specific issue. Returns a paginated list of triage transactions, each with the latest author, timestamp, and triage properties (status, dismissal-reason, owner, comment, etc.).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    issue_id,
    application_id,
    project_id,
    branch_id,
    test_id,
    max_results,
  }) => {
    const transactions = await getIssueTriageHistory({
      issueId: issue_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      maxResults: max_results,
    });
    return jsonResponse(transactions);
  },
};
