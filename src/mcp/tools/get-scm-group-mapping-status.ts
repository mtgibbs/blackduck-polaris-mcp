import { z } from "zod";
import { getScmGroupMappingStatus } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z.string().describe("Polaris application ID"),
  project_id: z.string().optional().describe("Filter by specific project ID"),
};

export const getScmGroupMappingStatusTool: ToolDefinition<typeof schema> = {
  name: "get_scm_group_mapping_status",
  description:
    "Get the group mapping status for a given application, showing which projects have valid SCM group mappings.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ application_id, project_id }) => {
    const result = await getScmGroupMappingStatus({
      applicationId: application_id,
      projectId: project_id,
    });
    return jsonResponse(result);
  },
};
