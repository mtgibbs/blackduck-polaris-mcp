import { z } from "zod";
import { getExternalIssueTypes } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_key: z.string().describe("Project key in the external bug tracking system"),
};

export const getExternalIssueTypesTool: ToolDefinition<typeof schema> = {
  name: "get_external_issue_types",
  description:
    "List issue types available in an external bug tracking project (Jira, Azure DevOps). Returns issue type IDs and names for use when exporting Polaris issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id, project_key }) => {
    const issueTypes = await getExternalIssueTypes({
      configurationId: config_id,
      projectKey: project_key,
    });
    return jsonResponse(issueTypes);
  },
};
