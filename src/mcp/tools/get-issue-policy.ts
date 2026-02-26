import { z } from "zod";
import { getIssuePolicy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  policy_id: z.string().describe("Issue policy ID"),
};

export const getIssuePolicyTool: ToolDefinition<typeof schema> = {
  name: "get_issue_policy",
  description:
    "Get a single issue policy by ID. Returns the complete policy including filterGroups with rules, each containing powerFilterQuery, actions array, and optional fixByRule entries. Valid actions: SEND_EMAIL, BREAK_THE_BUILD, CREATE_BUNDLE_JIRA_TICKET.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ policy_id }) => {
    const policy = await getIssuePolicy(policy_id);
    return jsonResponse(policy);
  },
};
