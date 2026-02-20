import { z } from "zod";
import { getDashboard } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter. Filterable: portfolioItemName, labelId. Example: portfolioItemName=='demo'",
    ),
  sort: z
    .string()
    .optional()
    .describe(
      "Sort expression. Format: field|direction. Sortable: portfolioItemName. Example: portfolioItemName|asc",
    ),
};

export const getDashboardTool: ToolDefinition<typeof schema> = {
  name: "get_dashboard",
  description:
    "Get the portfolio dashboard with application-level issue metrics, risk scores, and scan status. Returns dashboard items for all applications matching the filter.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort }) => {
    const items = await getDashboard({ portfolioId: portfolio_id, filter, sort });
    return jsonResponse(items);
  },
};
