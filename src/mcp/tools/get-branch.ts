import { z } from "zod";
import { getBranch } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  branch_id: z.string().describe("Branch ID"),
};

export const getBranchTool: ToolDefinition<typeof schema> = {
  name: "get_branch",
  description: "Get a single branch by ID.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, branch_id }) => {
    const branch = await getBranch({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
    });
    return jsonResponse(branch);
  },
};
