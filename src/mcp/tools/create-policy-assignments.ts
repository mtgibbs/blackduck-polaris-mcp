import { z } from "zod";
import { createPolicyAssignments } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

const assignmentSchema = z.object({
  type: z.string().describe("Assignment type (typically 'project')"),
  associationId: z.string().describe("Project or branch ID to assign the policy to"),
  policyId: z.string().describe("Policy ID to assign"),
});

export const schema = {
  assignments: z
    .array(assignmentSchema)
    .describe(
      "Array of policy assignments to create. Each assignment links a policy to a project/branch. Note: Up to 5 issue policies per project, 1 test scheduling policy per project.",
    ),
};

export const createPolicyAssignmentsTool: ToolDefinition<typeof schema> = {
  name: "create_policy_assignments",
  description:
    "Bulk create policy assignments in Polaris. Assigns one or more policies to projects/branches. Each assignment requires type (typically 'project'), associationId (project/branch ID), and policyId. Returns 204 No Content on success. Limits: up to 5 issue policies per project, 1 test scheduling policy per project.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ assignments }) => {
    await createPolicyAssignments({ assignments });
    return jsonResponse({ success: true, message: "Policy assignments created successfully" });
  },
};
