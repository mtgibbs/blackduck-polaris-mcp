import { z } from "zod";
import { updateIssuePolicy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

const fixByRuleSchema = z.object({
  fixByAction: z.string().describe("Action that triggered the fix-by requirement"),
  fixByPeriod: z.number().describe("Number of days to fix the issue"),
});

const policyRuleSchema = z.object({
  ruleNumber: z.number().describe("Rule number (for ordering)"),
  powerFilterQuery: z
    .string()
    .describe(
      "RSQL filter query matching issues (e.g., context:tool-type=in=('sast','sca','dast'), issueProperties:severity=in=('critical','high'))",
    ),
  actions: z
    .array(z.string())
    .optional()
    .describe("Actions to take: SEND_EMAIL, BREAK_THE_BUILD, CREATE_BUNDLE_JIRA_TICKET"),
  fixByRule: z
    .array(fixByRuleSchema)
    .optional()
    .describe("Fix-by date rules (max 5 entries per rule)"),
});

const filterGroupSchema = z.object({
  rules: z
    .array(policyRuleSchema)
    .describe("Rules in this filter group (max 5 rules per policy)"),
});

export const schema = {
  policy_id: z.string().describe("Issue policy ID to update"),
  name: z.string().max(255).describe("Policy name (max 255 characters)"),
  description: z.string().max(512).optional().describe("Policy description (max 512 characters)"),
  filter_groups: z
    .array(filterGroupSchema)
    .optional()
    .describe("Filter groups containing rules (max 5 rules per policy)"),
};

export const updateIssuePolicyTool: ToolDefinition<typeof schema> = {
  name: "update_issue_policy",
  description:
    "Update an existing issue policy in Polaris (full replacement). Supports max 5 rules per policy, max 5 fixByRule entries per rule. Valid actions: SEND_EMAIL, BREAK_THE_BUILD, CREATE_BUNDLE_JIRA_TICKET. Returns 200 OK with the updated policy.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ policy_id, name, description, filter_groups }) => {
    const policy = await updateIssuePolicy({
      id: policy_id,
      name,
      description,
      filterGroups: filter_groups,
    });
    return jsonResponse(policy);
  },
};
