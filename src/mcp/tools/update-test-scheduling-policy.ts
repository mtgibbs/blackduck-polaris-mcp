import { z } from "zod";
import { updateTestSchedulingPolicy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

const scheduleRuleSchema = z.object({
  ruleNumber: z.number().describe("Rule number (for ordering)"),
  frequency: z
    .enum(["daily", "weekly"])
    .describe("Test frequency: 'daily' or 'weekly'"),
});

const scheduleGroupSchema = z.object({
  rules: z
    .array(scheduleRuleSchema)
    .describe("Schedule rules in this group (max 5 rules per policy)"),
});

export const schema = {
  policy_id: z.string().describe("Test scheduling policy ID to update"),
  name: z.string().max(255).describe("Policy name (max 255 characters)"),
  description: z.string().max(512).optional().describe("Policy description (max 512 characters)"),
  schedule_groups: z
    .array(scheduleGroupSchema)
    .optional()
    .describe("Schedule groups containing rules (max 5 rules per policy)"),
};

export const updateTestSchedulingPolicyTool: ToolDefinition<typeof schema> = {
  name: "update_test_scheduling_policy",
  description:
    "Update an existing test scheduling policy in Polaris (full replacement). Test scheduling policies control automatic test frequency. Supports max 5 rules per policy. Valid frequency values: 'daily' or 'weekly'. Returns 200 OK with the updated policy.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ policy_id, name, description, schedule_groups }) => {
    const policy = await updateTestSchedulingPolicy({
      id: policy_id,
      name,
      description,
      scheduleGroups: schedule_groups,
    });
    return jsonResponse(policy);
  },
};
