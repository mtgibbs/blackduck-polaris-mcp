import { z } from "zod";
import { createBranch } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  name: z.string().describe("Branch name"),
};

export const createBranchTool: ToolDefinition<typeof schema> = {
  name: "create_branch",
  description: "Create a new branch under a project.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, name }) => {
    const branch = await createBranch({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      name,
    });
    return jsonResponse(branch);
  },
};
