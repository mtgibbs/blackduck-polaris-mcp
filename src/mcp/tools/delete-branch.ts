import { z } from "zod";
import { deleteBranch } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  branch_id: z.string().describe("Branch ID"),
};

export const deleteBranchTool: ToolDefinition<typeof schema> = {
  name: "delete_branch",
  description: "Delete a branch by ID.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, branch_id }) => {
    await deleteBranch({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
    });
    return jsonResponse({ success: true });
  },
};
