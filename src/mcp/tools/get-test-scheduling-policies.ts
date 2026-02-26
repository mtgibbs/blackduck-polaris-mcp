import { z } from "zod";
import { getTestSchedulingPolicies } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression for test scheduling policies"),
  offset: z
    .number()
    .optional()
    .describe("Offset for pagination (default 0)"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of results per page (max 100)"),
};

export const getTestSchedulingPoliciesTool: ToolDefinition<typeof schema> = {
  name: "get_test_scheduling_policies",
  description:
    "List test scheduling policies in Polaris. Test scheduling policies control automatic test frequency (daily/weekly). Policies contain scheduleGroups with rules that specify ruleNumber and frequency ('daily' or 'weekly'). Multi-policy support is not available - typically one policy per project/branch. Maximum 5 rules per policy.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, offset, limit }) => {
    const policies = await getTestSchedulingPolicies({
      filter,
      offset,
      limit,
    });
    return jsonResponse(policies);
  },
};
