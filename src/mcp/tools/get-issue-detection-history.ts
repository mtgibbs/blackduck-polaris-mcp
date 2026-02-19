import { z } from "zod";
import { getIssueDetectionHistory } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  issue_id: z.string().describe("Issue ID to retrieve detection history for"),
  application_id: z.string().optional().describe("Application ID for scoping"),
  project_id: z.string().optional().describe("Project ID for scoping"),
  branch_id: z.string().optional().describe("Branch ID for scoping"),
  test_id: z.string().optional().describe("Test ID or 'latest' for scoping"),
};

export const getIssueDetectionHistoryTool: ToolDefinition<typeof schema> = {
  name: "get_issue_detection_history",
  description:
    "Get the detection history for a specific issue. Returns detection events (FIRST_DETECTED, ABSENT, DETECTED_AGAIN) with their timestamps, showing when the issue was first seen, disappeared, or reappeared across scans.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ issue_id, application_id, project_id, branch_id, test_id }) => {
    const history = await getIssueDetectionHistory({
      issueId: issue_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
    });
    return jsonResponse(history);
  },
};
