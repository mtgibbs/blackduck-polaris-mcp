import { z } from "zod";
import { deleteProject } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
};

export const deleteProjectTool: ToolDefinition<typeof schema> = {
  name: "delete_project",
  description: "Delete a project.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id }) => {
    await deleteProject({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
    });
    return jsonResponse({ success: true });
  },
};
