import { z } from "zod";
import { getExternalProjects } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z
    .string()
    .describe("Bug tracking configuration ID (from get_bug_tracking_configurations)"),
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression for external projects"),
};

export const getExternalProjectsTool: ToolDefinition<typeof schema> = {
  name: "get_external_projects",
  description:
    "List projects in the external bug tracking system (Jira/Azure DevOps) linked to a Polaris bug tracking configuration. Returns project keys needed for exporting issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id, filter }) => {
    const projects = await getExternalProjects({
      configurationId: config_id,
      filter,
    });
    return jsonResponse(projects);
  },
};
