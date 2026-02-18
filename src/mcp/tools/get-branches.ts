import { z } from "zod";
import { getBranches } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  filter: z.string().optional().describe(
    "RSQL filter expression for branches. Example: name=='main'",
  ),
};

export const getBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_branches",
  description: "List branches for a project. Each branch can have its own scan results and issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, filter }) => {
    const branches = await getBranches({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      filter,
    });
    return jsonResponse(branches);
  },
};
