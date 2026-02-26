import { z } from "zod";
import { createPrPolicy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

const policyRuleSchema = z.object({
  ruleNumber: z.number().describe("Rule number (for ordering)"),
  criteriaQuery: z
    .string()
    .describe(
      "RSQL criteria query matching findings (e.g., context:tool-type=in=('sast','sca','dast'), issueProperties:severity=in=('critical','high'))",
    ),
  actions: z
    .array(z.string())
    .optional()
    .describe("Actions to take (only BLOCK_PR is supported for PR policies)"),
});

export const schema = {
  name: z.string().max(255).describe("Policy name (max 255 characters)"),
  description: z.string().max(512).optional().describe("Policy description (max 512 characters)"),
  rules: z
    .array(policyRuleSchema)
    .optional()
    .describe("Rules for this policy (max 5 rules per policy)"),
};

export const createPrPolicyTool: ToolDefinition<typeof schema> = {
  name: "create_pr_policy",
  description:
    "Create a new PR policy in Polaris. PR policies block pull requests when findings match specified criteria. Supports max 5 rules per policy. Valid action: BLOCK_PR. Returns 201 Created with the new policy.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ name, description, rules }) => {
    const policy = await createPrPolicy({
      name,
      description,
      rules,
    });
    return jsonResponse(policy);
  },
};
