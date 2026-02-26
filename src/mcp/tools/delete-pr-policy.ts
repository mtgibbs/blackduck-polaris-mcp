import { z } from "zod";
import { deletePrPolicy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  policy_id: z.string().describe("PR policy ID to delete"),
};

export const deletePrPolicyTool: ToolDefinition<typeof schema> = {
  name: "delete_pr_policy",
  description:
    "Delete a PR policy from Polaris. This will remove the policy and its assignments. Returns 204 No Content on success.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true, destructiveHint: true },
  handler: async ({ policy_id }) => {
    await deletePrPolicy(policy_id);
    return jsonResponse({ success: true, message: "PR policy deleted successfully" });
  },
};
