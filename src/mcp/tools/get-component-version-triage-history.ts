import { z } from "zod";
import { getComponentVersionTriageHistory } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("The component version identifier"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope the query (mutually exclusive with application_id)"),
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope the query (mutually exclusive with project_id)"),
  branch_id: z.string().optional().describe("Branch ID"),
  test_id: z.string().optional().describe("Test ID or 'latest'"),
  first: z.number().optional().describe("Maximum number of triage history entries to return"),
};

export const getComponentVersionTriageHistoryTool: ToolDefinition<typeof schema> = {
  name: "get_component_version_triage_history",
  description:
    "Get paginated triage history for a component version. Returns triage transactions with latestTimestamp and triageProperties (comment, ignored).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id, project_id, application_id, branch_id, test_id, first }) => {
    const history = await getComponentVersionTriageHistory({
      id,
      projectId: project_id,
      applicationId: application_id,
      branchId: branch_id,
      testId: test_id,
      first,
    });
    return jsonResponse(history);
  },
};
