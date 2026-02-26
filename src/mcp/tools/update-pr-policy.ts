import { z } from "zod";
import { updatePrPolicy } from "../../services/index.ts";
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
  policy_id: z.string().describe("PR policy ID to update"),
  name: z.string().max(255).describe("Policy name (max 255 characters)"),
  description: z.string().max(512).optional().describe("Policy description (max 512 characters)"),
  rules: z
    .array(policyRuleSchema)
    .optional()
    .describe("Rules for this policy (max 5 rules per policy)"),
};

export const updatePrPolicyTool: ToolDefinition<typeof schema> = {
  name: "update_pr_policy",
  description:
    "Update an existing PR policy in Polaris (full replacement). PR policies block pull requests when findings match specified criteria. Supports max 5 rules per policy. Valid action: BLOCK_PR. Returns 200 OK with the updated policy.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ policy_id, name, description, rules }) => {
    const policy = await updatePrPolicy({
      id: policy_id,
      name,
      description,
      rules,
    });
    return jsonResponse(policy);
  },
};
