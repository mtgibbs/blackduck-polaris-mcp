import { z } from "zod";
import { getScmGroupMappingStatus } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z.string(),
  project_id: z.string().optional(),
};

export const getScmGroupMappingStatusTool: ToolDefinition<typeof schema> = {
  name: "get_scm_group_mapping_status",
  description:
    "Get the group mapping status for a given application, showing which projects have valid SCM group mappings.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ application_id, project_id }) => {
    try {
      const result = await getScmGroupMappingStatus({
        applicationId: application_id,
        projectId: project_id,
      });
      return jsonResponse(result);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
