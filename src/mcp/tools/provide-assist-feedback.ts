import { z } from "zod";
import { provideAssistFeedback } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  occurrence_id: z.string().describe("Occurrence ID the assist was generated for"),
  assist_id: z.string().describe("Assist response ID (from get_remediation_assist result)"),
  application_id: z.string().optional().describe("Application ID for scoping"),
  project_id: z.string().optional().describe("Project ID for scoping"),
  branch_id: z.string().optional().describe("Branch ID for scoping"),
  test_id: z.string().optional().describe("Test ID or 'latest' for scoping"),
  disposition: z
    .boolean()
    .describe("Whether the remediation guidance was helpful (true = helpful, false = not helpful)"),
  comment: z.string().optional().describe("Optional qualifying comment on the feedback"),
};

export const provideAssistFeedbackTool: ToolDefinition<typeof schema> = {
  name: "provide_assist_feedback",
  description:
    "Provide feedback on AI-generated remediation guidance from Polaris Assist. Use this after reviewing remediation suggestions to indicate whether they were helpful.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    occurrence_id,
    assist_id,
    application_id,
    project_id,
    branch_id,
    test_id,
    disposition,
    comment,
  }) => {
    await provideAssistFeedback({
      occurrenceId: occurrence_id,
      assistId: assist_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      disposition,
      comment,
    });
    return jsonResponse({ success: true });
  },
};
