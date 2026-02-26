import { z } from "zod";
import { getPolicyActions } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter expression (e.g., policyUseCase=='issue_policy' or policyUseCase=='component_policy')",
    ),
  offset: z
    .number()
    .optional()
    .describe("Offset for pagination (default 0)"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of results per page (max 100)"),
};

export const getPolicyActionsTool: ToolDefinition<typeof schema> = {
  name: "get_policy_actions",
  description:
    "List available policy actions in Polaris. Actions define what happens when a policy rule matches. " +
    "Supported actions: SEND_EMAIL, BREAK_THE_BUILD, CREATE_BUNDLE_JIRA_TICKET (for issue policies), " +
    "BLOCK_PR (for PR policies). Filter by policyUseCase to see actions for a specific policy type.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, offset, limit }) => {
    const actions = await getPolicyActions({ filter, offset, limit });
    return jsonResponse(actions);
  },
};
