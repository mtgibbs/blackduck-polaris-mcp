import { z } from "zod";
import { getApplications } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe(
    "RSQL filter expression. Filterable fields: id, name, labelId, description. Examples: name=='my-app', name=like='%partial%'",
  ),
  sort: z.string().optional().describe(
    "Sort expression. Format: field|direction. Sortable fields: id, name, description. Example: name|asc",
  ),
};

export const getApplicationsTool: ToolDefinition<typeof schema> = {
  name: "get_applications",
  description: "List applications in a portfolio. Applications group related projects together.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort }) => {
    const apps = await getApplications({
      portfolioId: portfolio_id,
      filter,
      sort,
    });
    return jsonResponse(apps);
  },
};
