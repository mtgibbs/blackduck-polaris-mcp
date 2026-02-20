import { z } from "zod";
import { getConfigProjectMappings } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
};

export const getConfigProjectMappingsTool: ToolDefinition<typeof schema> = {
  name: "get_config_project_mappings",
  description:
    "List all project mappings between Polaris projects and external bug tracking projects under a specific bug tracking configuration.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id }) => {
    const mappings = await getConfigProjectMappings({ configurationId: config_id });
    return jsonResponse(mappings);
  },
};
