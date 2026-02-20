import { z } from "zod";
import { getProjects } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe("RSQL filter expression"),
  sort: z.string().optional().describe("Sort expression"),
};

export const getPortfolioProjectsTool: ToolDefinition<typeof schema> = {
  name: "get_portfolio_projects",
  description: "List all projects across all applications in a portfolio (portfolio-wide view).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort }) => {
    const projects = await getProjects({ portfolioId: portfolio_id, filter, sort });
    return jsonResponse(projects);
  },
};
