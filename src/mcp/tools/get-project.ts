import { z } from "zod";
import { getProject } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
};

export const getProjectTool: ToolDefinition<typeof schema> = {
  name: "get_project",
  description: "Get a single project by ID.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id }) => {
    const project = await getProject({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
    });
    return jsonResponse(project);
  },
};
