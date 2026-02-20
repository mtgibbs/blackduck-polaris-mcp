import { z } from "zod";
import { updateConfigProjectMapping } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_mapping_id: z.string().describe("Project mapping ID to update"),
  bts_project_key: z
    .string()
    .optional()
    .describe("Updated project key in the external bug tracking system"),
  bts_project_id: z
    .string()
    .optional()
    .describe("Updated project ID in the external bug tracking system"),
  bts_issue_type: z
    .string()
    .optional()
    .describe("Updated issue type in the external bug tracking system"),
};

export const updateProjectMappingTool: ToolDefinition<typeof schema> = {
  name: "update_project_mapping",
  description:
    "Update a project mapping between a Polaris project and an external bug tracking project under a specific bug tracking configuration.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async (
    { config_id, project_mapping_id, bts_project_key, bts_project_id, bts_issue_type },
  ) => {
    const mapping = await updateConfigProjectMapping({
      configurationId: config_id,
      projectMappingId: project_mapping_id,
      btsProjectKey: bts_project_key,
      btsProjectId: bts_project_id,
      btsIssueType: bts_issue_type,
    });
    return jsonResponse(mapping);
  },
};
