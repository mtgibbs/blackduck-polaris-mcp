import { z } from "zod";
import { getComponentOrigin } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("Component origin ID"),
  project_id: z
    .string()
    .describe("Project ID to scope the query (required for component origins)"),
};

export const getComponentOriginTool: ToolDefinition<typeof schema> = {
  name: "get_component_origin",
  description:
    "Get a single component origin by ID. Returns detailed information including upgrade guidance and transitive upgrade guidance for the component.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id, project_id }) => {
    const origin = await getComponentOrigin({ id, projectId: project_id });
    return jsonResponse(origin);
  },
};
