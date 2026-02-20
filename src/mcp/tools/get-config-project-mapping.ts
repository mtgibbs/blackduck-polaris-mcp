import { z } from "zod";
import { getConfigProjectMapping } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_mapping_id: z.string().describe("Project mapping ID"),
};

export const getConfigProjectMappingTool: ToolDefinition<typeof schema> = {
  name: "get_config_project_mapping",
  description:
    "Get a single project mapping between a Polaris project and an external bug tracking project under a specific bug tracking configuration.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id, project_mapping_id }) => {
    const mapping = await getConfigProjectMapping({
      configurationId: config_id,
      projectMappingId: project_mapping_id,
    });
    return jsonResponse(mapping);
  },
};
