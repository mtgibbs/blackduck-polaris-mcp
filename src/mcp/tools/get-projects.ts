import { z } from "zod";
import { getProjects } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { validateFilter } from "../filter-validation.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().optional().describe(
    "Application ID to filter projects (omit to list all projects org-wide)",
  ),
  name: z.string().optional().describe(
    "Filter by project name (exact match). Equivalent to filter=\"name=='value'\"",
  ),
  filter: z.string().optional().describe(
    "RSQL filter expression. Valid keys: name, description, subItemType, inTrash. Examples: name=='my-project', subItemType=='git', inTrash==false",
  ),
  sort: z.string().optional().describe(
    "Sort expression. Format: field|direction. Sortable fields: id, name, projectType, description. Example: name|asc",
  ),
};

export const getProjectsTool: ToolDefinition<typeof schema> = {
  name: "get_projects",
  description:
    "List projects in a portfolio, optionally filtered by application. Projects represent codebases that are scanned for vulnerabilities.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, name, filter, sort }) => {
    // Build filter from convenience parameter
    let combinedFilter = filter;
    if (name) {
      const nameFilter = `name=='${name}'`;
      combinedFilter = filter ? `${nameFilter};${filter}` : nameFilter;
    }

    // Validate filter if present
    if (combinedFilter) {
      const validationError = validateFilter(combinedFilter, "portfolio.projects");
      if (validationError) {
        return errorResponse(validationError);
      }
    }

    const projects = await getProjects({
      portfolioId: portfolio_id,
      applicationId: application_id,
      filter: combinedFilter,
      sort,
    });
    return jsonResponse(projects);
  },
};
