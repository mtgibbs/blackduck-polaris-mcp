import { z } from "zod";
import { getCodeSnippet } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  occurrence_id: z.string().describe("Occurrence ID to get the code snippet for"),
  application_id: z.string().optional().describe("Application ID for scoping"),
  project_id: z.string().optional().describe("Project ID for scoping"),
  branch_id: z.string().optional().describe("Branch ID for scoping"),
  test_id: z.string().optional().describe("Test ID or 'latest' for scoping"),
};

export const getCodeSnippetTool: ToolDefinition<typeof schema> = {
  name: "get_code_snippet",
  description:
    "Get the source code snippet for a specific vulnerability occurrence, showing the exact lines of code with the issue highlighted.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ occurrence_id, application_id, project_id, branch_id, test_id }) => {
    const snippet = await getCodeSnippet({
      occurrenceId: occurrence_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
    });
    return jsonResponse(snippet);
  },
};
