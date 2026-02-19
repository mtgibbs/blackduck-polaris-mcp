import { z } from "zod";
import { getProjectSubResourceCount } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional(),
  sort: z.string().optional(),
  group: z.string().optional().describe("Group by field name for counting"),
};

export const getProjectSubResourceCountTool: ToolDefinition<typeof schema> = {
  name: "get_project_sub_resource_count",
  description: "Get counts of project sub-resources grouped by a field.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort, group }) => {
    try {
      const results = await getProjectSubResourceCount({
        portfolioId: portfolio_id,
        filter,
        sort,
        group,
      });
      return jsonResponse(results);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
