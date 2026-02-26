import { z } from "zod";
import { createTestSchedulingPolicy } from "../../services/index.ts";
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
  name: z.string().max(255).describe("Policy name (max 255 characters)"),
  description: z.string().max(512).optional().describe("Policy description (max 512 characters)"),
  schedule_groups: z
    .array(scheduleGroupSchema)
    .optional()
    .describe("Schedule groups containing rules (max 5 rules per policy)"),
};

export const createTestSchedulingPolicyTool: ToolDefinition<typeof schema> = {
  name: "create_test_scheduling_policy",
  description:
    "Create a new test scheduling policy in Polaris. Test scheduling policies control automatic test frequency. Supports max 5 rules per policy. Valid frequency values: 'daily' or 'weekly'. Returns 201 Created with the new policy.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ name, description, schedule_groups }) => {
    const policy = await createTestSchedulingPolicy({
      name,
      description,
      scheduleGroups: schedule_groups,
    });
    return jsonResponse(policy);
  },
};
