import { z } from "zod";
import { getLinkedIssues } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
};

export const getLinkedIssuesTool: ToolDefinition<typeof schema> = {
  name: "get_linked_issues",
  description:
    "List all linked issues (exported Polaris issues) for a bug tracking configuration. Returns issue links and keys in the external bug tracking system.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id }) => {
    const issues = await getLinkedIssues({ configurationId: config_id });
    return jsonResponse(issues);
  },
};
