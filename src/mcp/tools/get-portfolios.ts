import { z } from "zod";
import { getPortfolios } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  _placeholder: z.string().optional().describe("No parameters required"),
};

export const getPortfoliosTool: ToolDefinition<typeof schema> = {
  name: "get_portfolios",
  description:
    "Get the portfolio for this Polaris organization. Returns the portfolio ID needed for querying applications and projects.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async () => {
    const portfolios = await getPortfolios();
    return jsonResponse(portfolios);
  },
};
