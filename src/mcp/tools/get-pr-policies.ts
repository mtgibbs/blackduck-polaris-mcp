import { z } from "zod";
import { getPrPolicies } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression for PR policies"),
  offset: z
    .number()
    .optional()
    .describe("Offset for pagination (default 0)"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of results per page (max 100)"),
};

export const getPrPoliciesTool: ToolDefinition<typeof schema> = {
  name: "get_pr_policies",
  description:
    "List PR policies in Polaris. PR policies block pull requests when findings match severity/tool criteria. Policies contain rules (not wrapped in filterGroups) that use criteriaQuery syntax (e.g., context:tool-type=in=('sast','sca','dast'), issueProperties:severity=in=('critical','high')). Actions only support BLOCK_PR. Maximum 5 rules per policy.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, offset, limit }) => {
    const policies = await getPrPolicies({
      filter,
      offset,
      limit,
    });
    return jsonResponse(policies);
  },
};
