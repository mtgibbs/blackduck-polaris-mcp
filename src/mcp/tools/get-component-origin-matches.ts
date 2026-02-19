import { z } from "zod";
import { getComponentOriginMatches } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("Component origin ID"),
  project_id: z
    .string()
    .describe("Project ID to scope the query (required for component origins)"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of dependency path matches to return (default: 100)"),
};

export const getComponentOriginMatchesTool: ToolDefinition<typeof schema> = {
  name: "get_component_origin_matches",
  description:
    "Get dependency path matches for a component origin. Returns file paths and match types (e.g., FILE_DEPENDENCY_DIRECT, FILE_EXACT) showing where the component is used.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id, project_id, max_results }) => {
    const matches = await getComponentOriginMatches({
      id,
      projectId: project_id,
      first: max_results,
    });
    return jsonResponse(matches);
  },
};
