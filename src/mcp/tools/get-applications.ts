import { z } from "zod";
import { getApplications } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { validateFilter } from "../filter-validation.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  name: z.string().optional().describe(
    "Filter by application name (exact match). Equivalent to filter=\"name=='value'\"",
  ),
  filter: z.string().optional().describe(
    "RSQL filter expression. Valid keys: name, description, subscriptionType, inTrash. Operators: ==, !=, =in=(), =out=(). Examples: name=='my-app', inTrash==false",
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
  handler: async ({ portfolio_id, name, filter, sort }) => {
    // Build filter from convenience parameter
    let combinedFilter = filter;
    if (name) {
      const nameFilter = `name=='${name.replace(/'/g, "\\'")}'`;
      combinedFilter = filter ? `${nameFilter};${filter}` : nameFilter;
    }

    // Validate filter if present
    if (combinedFilter) {
      const validationError = validateFilter(combinedFilter, "portfolio.applications");
      if (validationError) {
        return errorResponse(validationError);
      }
    }

    const apps = await getApplications({
      portfolioId: portfolio_id,
      filter: combinedFilter,
      sort,
    });
    return jsonResponse(apps);
  },
};
