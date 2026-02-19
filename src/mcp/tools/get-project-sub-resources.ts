import { z } from "zod";
import { getProjectSubResources } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe(
    "RSQL filter. Filterable: id, name, projectSubResourceType, default, project.id, project.name, application.id, application.name, additionalProperties.source, _labelName",
  ),
  sort: z.string().optional(),
  consider_inherited_labels: z.boolean().optional(),
};

export const getProjectSubResourcesTool: ToolDefinition<typeof schema> = {
  name: "get_project_sub_resources",
  description: "List project sub-resources (branches and profiles) across a portfolio.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort, consider_inherited_labels }) => {
    try {
      const results = await getProjectSubResources({
        portfolioId: portfolio_id,
        filter,
        sort,
        considerInheritedLabels: consider_inherited_labels,
      });
      return jsonResponse(results);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
