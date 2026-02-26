import { z } from "zod";
import { getIssuePolicies } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression for issue policies"),
  offset: z
    .number()
    .optional()
    .describe("Offset for pagination (default 0)"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of results per page (max 100)"),
  associationId: z
    .string()
    .optional()
    .describe("Filter by project/branch association ID"),
};

export const getIssuePoliciesTool: ToolDefinition<typeof schema> = {
  name: "get_issue_policies",
  description:
    "List issue policies in Polaris. Issue policies trigger actions (SEND_EMAIL, BREAK_THE_BUILD, CREATE_BUNDLE_JIRA_TICKET) when issues match severity/tool filters. Policies contain filterGroups with rules that use powerFilterQuery syntax (e.g., context:tool-type=in=('sast','sca','dast'), issueProperties:severity=in=('critical','high','medium','low')). Maximum 5 rules per policy.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, offset, limit, associationId }) => {
    const policies = await getIssuePolicies({
      filter,
      offset,
      limit,
      associationId,
    });
    return jsonResponse(policies);
  },
};
