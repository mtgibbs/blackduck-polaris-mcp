import { z } from "zod";
import { getPortfolioBranches } from "../../services/index.ts";
import { summarizeBranch, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe("RSQL filter expression"),
  sort: z.string().optional().describe("Sort expression"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getPortfolioBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_portfolio_branches",
  description: "List all branches across all projects in a portfolio (portfolio-wide view).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (args) => {
    const { summary = true, ...rest } = args;
    const branches = await getPortfolioBranches({
      portfolioId: rest.portfolio_id,
      filter: rest.filter,
      sort: rest.sort,
    });
    if (summary) {
      return jsonResponse(summarizeResponse(branches, summarizeBranch));
    }
    return jsonResponse(branches);
  },
};
