import { z } from "zod";
import { getRemediationAssist } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  occurrence_id: z.string().describe("Occurrence ID to get AI remediation guidance for"),
  application_id: z.string().optional().describe("Application ID for scoping"),
  project_id: z.string().optional().describe("Project ID for scoping"),
  branch_id: z.string().optional().describe("Branch ID for scoping"),
  test_id: z.string().optional().describe("Test ID or 'latest' for scoping"),
};

export const getRemediationAssistTool: ToolDefinition<typeof schema> = {
  name: "get_remediation_assist",
  description:
    "Get AI-powered remediation guidance (Polaris Assist) for a specific vulnerability occurrence. Returns an explanation of the issue and suggested fix.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ occurrence_id, application_id, project_id, branch_id, test_id }) => {
    const assist = await getRemediationAssist({
      occurrenceId: occurrence_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
    });
    return jsonResponse(assist);
  },
};
