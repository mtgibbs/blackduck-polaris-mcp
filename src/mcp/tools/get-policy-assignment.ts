import { z } from "zod";
import { getPolicyAssignment } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  assignment_id: z
    .string()
    .describe("Policy assignment ID"),
};

export const getPolicyAssignmentTool: ToolDefinition<typeof schema> = {
  name: "get_policy_assignment",
  description:
    "Get a single policy assignment by ID. Returns the assignment details including the policy ID, association ID (project/branch), and assignment type.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ assignment_id }) => {
    const assignment = await getPolicyAssignment(assignment_id);
    return jsonResponse(assignment);
  },
};
