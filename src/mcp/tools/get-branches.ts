import { z } from "zod";
import { getBranches } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  filter: z.string().optional().describe(
    "RSQL filter expression for branches. Filterable fields: name, source, labelId, isDefault. Example: name=='main'",
  ),
  sort: z
    .string()
    .optional()
    .describe("Sort expression. Sortable fields: name, source. Format: field|direction"),
};

export const getBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_branches",
  description: "List branches for a project. Each branch can have its own scan results and issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, filter, sort }) => {
    const branches = await getBranches({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      filter,
      sort,
    });
    return jsonResponse(branches);
  },
};
