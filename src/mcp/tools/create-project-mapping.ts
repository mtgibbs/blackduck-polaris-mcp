import { z } from "zod";
import { createConfigProjectMapping } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_id: z.string().describe("Polaris project ID to map"),
  bts_project_key: z.string().describe("Project key in the external bug tracking system"),
  bts_project_id: z
    .string()
    .optional()
    .describe("Project ID in the external bug tracking system (optional)"),
  bts_issue_type: z.string().describe("Issue type in the external bug tracking system"),
};

export const createProjectMappingTool: ToolDefinition<typeof schema> = {
  name: "create_project_mapping",
  description:
    "Create a project mapping between a Polaris project and a project in an external bug tracking system (Jira/Azure DevOps) under a specific bug tracking configuration.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ config_id, project_id, bts_project_key, bts_project_id, bts_issue_type }) => {
    const mapping = await createConfigProjectMapping({
      configurationId: config_id,
      projectId: project_id,
      btsProjectKey: bts_project_key,
      btsProjectId: bts_project_id,
      btsIssueType: bts_issue_type,
    });
    return jsonResponse(mapping);
  },
};
