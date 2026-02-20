import { z } from "zod";
import { updateBranch } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  branch_id: z.string().describe("Branch ID"),
  name: z.string().optional().describe("New branch name"),
  is_default: z.boolean().optional().describe("Whether this branch is the default branch"),
};

export const updateBranchTool: ToolDefinition<typeof schema> = {
  name: "update_branch",
  description: "Update a branch's name or default status.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, branch_id, name, is_default }) => {
    const branch = await updateBranch({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      name,
      isDefault: is_default,
    });
    return jsonResponse(branch);
  },
};
