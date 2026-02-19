import { z } from "zod";
import { deleteConfigProjectMapping } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_mapping_id: z.string().describe("Project mapping ID to delete"),
};

export const deleteProjectMappingTool: ToolDefinition<typeof schema> = {
  name: "delete_project_mapping",
  description:
    "Delete a project mapping under a specific bug tracking configuration. This cascades to delete all linked issues under the mapping.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ config_id, project_mapping_id }) => {
    await deleteConfigProjectMapping({
      configurationId: config_id,
      projectMappingId: project_mapping_id,
    });
    return jsonResponse({ success: true });
  },
};
