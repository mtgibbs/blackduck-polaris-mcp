import { z } from "zod";
import { getProjects } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().optional().describe(
    "Application ID to filter projects (omit to list all projects org-wide)",
  ),
  filter: z.string().optional().describe(
    "RSQL filter expression. Org-wide fields: id, name, description, applicationId, createdAt, updatedAt. In-app fields: id, name, projectType, labelId. Examples: name=='my-project', applicationId=='uuid'",
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
  handler: async ({ portfolio_id, application_id, filter, sort }) => {
    const projects = await getProjects({
      portfolioId: portfolio_id,
      applicationId: application_id,
      filter,
      sort,
    });
    return jsonResponse(projects);
  },
};
