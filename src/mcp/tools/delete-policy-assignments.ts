import { z } from "zod";
import { deletePolicyAssignments } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

const assignmentSchema = z.object({
  type: z.string().describe("Assignment type (typically 'project')"),
  associationId: z.string().describe("Project or branch ID to remove the policy from"),
  policyId: z.string().describe("Policy ID to remove"),
});

export const schema = {
  assignments: z
    .array(assignmentSchema)
    .describe(
      "Array of policy assignments to delete. Each assignment identifies a policy-project link to remove.",
    ),
};

export const deletePolicyAssignmentsTool: ToolDefinition<typeof schema> = {
  name: "delete_policy_assignments",
  description:
    "Bulk delete policy assignments in Polaris. Removes policy assignments from projects/branches. Each assignment requires type (typically 'project'), associationId (project/branch ID), and policyId. Returns 204 No Content on success.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ assignments }) => {
    await deletePolicyAssignments({ assignments });
    return jsonResponse({ success: true, message: "Policy assignments deleted successfully" });
  },
};
