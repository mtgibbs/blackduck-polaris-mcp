import { z } from "zod";
import { getPortfolios } from "../../services/index.ts";
import { summarizePortfolio, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  _placeholder: z.string().optional().describe("No parameters required"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getPortfoliosTool: ToolDefinition<typeof schema> = {
  name: "get_portfolios",
  description:
    "Get the portfolio for this Polaris organization. Returns the portfolio ID needed for querying applications and projects.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (args) => {
    const { summary = true } = args;
    const portfolios = await getPortfolios();
    if (summary) {
      return jsonResponse(summarizeResponse(portfolios, summarizePortfolio));
    }
    return jsonResponse(portfolios);
  },
};
