import { z } from "zod";
import { updateProject } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  name: z.string().optional().describe("New name for the project"),
  description: z.string().optional().describe("New description for the project"),
};

export const updateProjectTool: ToolDefinition<typeof schema> = {
  name: "update_project",
  description: "Update an existing project.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, name, description }) => {
    const project = await updateProject({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      name,
      description,
    });
    return jsonResponse(project);
  },
};
