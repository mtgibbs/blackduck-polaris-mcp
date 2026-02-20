import { z } from "zod";
import { getPortfolioEntitlements } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
};

export const getPortfolioEntitlementsTool: ToolDefinition<typeof schema> = {
  name: "get_portfolio_entitlements",
  description: "Get entitlements for a portfolio.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id }) => {
    const entitlements = await getPortfolioEntitlements({
      portfolioId: portfolio_id,
    });
    return jsonResponse(entitlements);
  },
};
