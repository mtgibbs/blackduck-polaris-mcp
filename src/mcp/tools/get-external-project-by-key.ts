import { z } from "zod";
import { getExternalProjectByKey } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_key: z
    .string()
    .describe("Case-sensitive project key in the external bug tracking system"),
};

export const getExternalProjectByKeyTool: ToolDefinition<typeof schema> = {
  name: "get_external_project_by_key",
  description:
    "Get a single external project from the bug tracking system (Jira/Azure DevOps) by its case-sensitive project key.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id, project_key }) => {
    const project = await getExternalProjectByKey({
      configurationId: config_id,
      projectKey: project_key,
    });
    return jsonResponse(project);
  },
};
