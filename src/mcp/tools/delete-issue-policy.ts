import { z } from "zod";
import { deleteIssuePolicy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  policy_id: z.string().describe("Issue policy ID to delete"),
};

export const deleteIssuePolicyTool: ToolDefinition<typeof schema> = {
  name: "delete_issue_policy",
  description:
    "Delete an issue policy from Polaris. Returns 204 No Content on success. Note: Deleting a policy does not remove it from projects where it was assigned - use delete_policy_assignments to unassign first.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ policy_id }) => {
    await deleteIssuePolicy(policy_id);
    return jsonResponse({ success: true, id: policy_id });
  },
};
