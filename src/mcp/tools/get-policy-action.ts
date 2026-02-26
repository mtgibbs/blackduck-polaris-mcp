import { z } from "zod";
import { getPolicyAction } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  action_id: z.string().describe("The ID of the policy action to retrieve"),
};

export const getPolicyActionTool: ToolDefinition<typeof schema> = {
  name: "get_policy_action",
  description:
    "Get details of a specific policy action in Polaris. Actions define what happens when a policy rule matches. " +
    "Supported actions: SEND_EMAIL, BREAK_THE_BUILD, CREATE_BUNDLE_JIRA_TICKET, BLOCK_PR.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ action_id }) => {
    const action = await getPolicyAction(action_id);
    return jsonResponse(action);
  },
};
