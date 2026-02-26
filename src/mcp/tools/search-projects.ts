import { z } from "zod";
import { getProjects } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  name: z.string().describe("Project name to search for (exact match)"),
};

export const searchProjectsTool: ToolDefinition<typeof schema> = {
  name: "search_projects",
  description:
    "Search for projects by name across all applications in a portfolio. Uses exact name matching.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, name }) => {
    // Build RSQL filter for exact name match (escape single quotes)
    const filter = `name=='${name.replace(/'/g, "\\'")}'`;

    // Query portfolio-level projects with name filter
    const projects = await getProjects({
      portfolioId: portfolio_id,
      filter,
    });

    // Return summarized response
    const items = projects.map((project) => ({
      id: project.id,
      name: project.name,
      applicationId: project.applicationId,
      defaultBranch: project.defaultBranch
        ? {
          id: project.defaultBranch.id,
          name: project.defaultBranch.name,
        }
        : undefined,
    }));

    return jsonResponse({
      total: items.length,
      items,
    });
  },
};
