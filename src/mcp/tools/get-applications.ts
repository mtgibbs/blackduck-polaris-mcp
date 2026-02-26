import { z } from "zod";
import { getApplications } from "../../services/index.ts";
import { summarizeApplication, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe(
    "RSQL filter expression. Filterable fields: id, name, labelId, description. Examples: name=='my-app', name=like='%partial%'",
  ),
  sort: z.string().optional().describe(
    "Sort expression. Format: field|direction. Sortable fields: id, name, description. Example: name|asc",
  ),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getApplicationsTool: ToolDefinition<typeof schema> = {
  name: "get_applications",
  description: "List applications in a portfolio. Applications group related projects together.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (args) => {
    const { summary = true, ...rest } = args;
    const apps = await getApplications({
      portfolioId: rest.portfolio_id,
      filter: rest.filter,
      sort: rest.sort,
    });
    if (summary) {
      return jsonResponse(summarizeResponse(apps, summarizeApplication));
    }
    return jsonResponse(apps);
  },
};
