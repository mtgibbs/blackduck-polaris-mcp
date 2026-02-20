import { z } from "zod";
import { getLinkedIssue } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  issue_id: z.string().describe("Linked issue ID"),
};

export const getLinkedIssueTool: ToolDefinition<typeof schema> = {
  name: "get_linked_issue",
  description:
    "Get a single linked issue (exported Polaris issue) by ID for a bug tracking configuration. Returns issue link and key in the external bug tracking system.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id, issue_id }) => {
    const issue = await getLinkedIssue({ configurationId: config_id, issueId: issue_id });
    return jsonResponse(issue);
  },
};
