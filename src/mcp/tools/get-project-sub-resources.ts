import { z } from "zod";
import { getProjectSubResources } from "../../services/index.ts";
import { summarizeProjectSubResource, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe(
    "RSQL filter. Filterable: id, name, projectSubResourceType, default, project.id, project.name, application.id, application.name, additionalProperties.source, _labelName",
  ),
  sort: z.string().optional().describe("Sort expression. Format: field|direction"),
  consider_inherited_labels: z.boolean().optional().describe("Include inherited labels in results"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getProjectSubResourcesTool: ToolDefinition<typeof schema> = {
  name: "get_project_sub_resources",
  description: "List project sub-resources (branches and profiles) across a portfolio.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (args) => {
    const { summary = true, ...rest } = args;
    const results = await getProjectSubResources({
      portfolioId: rest.portfolio_id,
      filter: rest.filter,
      sort: rest.sort,
      considerInheritedLabels: rest.consider_inherited_labels,
    });
    if (summary) {
      return jsonResponse(
        summarizeResponse(results, summarizeProjectSubResource),
      );
    }
    return jsonResponse(results);
  },
};
