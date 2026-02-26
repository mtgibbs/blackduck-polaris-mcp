import { z } from "zod";
import { getPortfolioBranches } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { validateFilter } from "../filter-validation.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe(
    "RSQL filter expression. Valid keys: name, isDefault, projectId, applicationId. Examples: name=='main', isDefault==true, projectId=='uuid'",
  ),
  sort: z.string().optional().describe("Sort expression"),
};

export const getPortfolioBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_portfolio_branches",
  description: "List all branches across all projects in a portfolio (portfolio-wide view).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort }) => {
    // Validate filter if present
    if (filter) {
      const validationError = validateFilter(filter, "portfolio.branches.org-wide");
      if (validationError) {
        return errorResponse(validationError);
      }
    }

    const branches = await getPortfolioBranches({ portfolioId: portfolio_id, filter, sort });
    return jsonResponse(branches);
  },
};
