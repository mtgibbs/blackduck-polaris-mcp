import { z } from "zod";
import { getPortfolioBranches } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe("RSQL filter expression"),
  sort: z.string().optional().describe("Sort expression"),
};

export const getPortfolioBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_portfolio_branches",
  description: "List all branches across all projects in a portfolio (portfolio-wide view).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort }) => {
    const branches = await getPortfolioBranches({ portfolioId: portfolio_id, filter, sort });
    return jsonResponse(branches);
  },
};
