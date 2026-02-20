import { z } from "zod";
import { createProject } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  name: z.string().describe("Name of the new project"),
  description: z.string().optional().describe("Description of the project"),
};

export const createProjectTool: ToolDefinition<typeof schema> = {
  name: "create_project",
  description: "Create a new project within an application.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, name, description }) => {
    const project = await createProject({
      portfolioId: portfolio_id,
      applicationId: application_id,
      name,
      description,
    });
    return jsonResponse(project);
  },
};
