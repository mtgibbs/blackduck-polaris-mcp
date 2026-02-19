import { z } from "zod";
import { getComponentOrigins } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z
    .string()
    .describe("Project ID to scope the query (required for component origins)"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter. Example: component-origin:external-namespace=='maven'",
    ),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of component origins to return (default: 100)"),
};

export const getComponentOriginsTool: ToolDefinition<typeof schema> = {
  name: "get_component_origins",
  description:
    "List component origins (SCA package provenance) for a project. Returns external namespace, external ID, package URL, security risk counts, and upgrade guidance.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ project_id, filter, max_results }) => {
    const origins = await getComponentOrigins({
      projectId: project_id,
      filter,
      first: max_results,
    });
    return jsonResponse(origins);
  },
};
