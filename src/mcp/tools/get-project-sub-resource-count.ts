import { z } from "zod";
import { getProjectSubResourceCount } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe(
    "RSQL filter. Filterable: id, name, projectSubResourceType, default, project.id, project.name, application.id, application.name",
  ),
  sort: z.string().optional().describe("Sort expression. Format: field|direction"),
  group: z.string().optional().describe("Group by field name for counting"),
};

export const getProjectSubResourceCountTool: ToolDefinition<typeof schema> = {
  name: "get_project_sub_resource_count",
  description: "Get counts of project sub-resources grouped by a field.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort, group }) => {
    const results = await getProjectSubResourceCount({
      portfolioId: portfolio_id,
      filter,
      sort,
      group,
    });
    return jsonResponse(results);
  },
};
