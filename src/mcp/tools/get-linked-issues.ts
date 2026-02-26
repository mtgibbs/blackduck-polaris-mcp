import { z } from "zod";
import { getLinkedIssues } from "../../services/index.ts";
import { summarizeLinkedIssue, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getLinkedIssuesTool: ToolDefinition<typeof schema> = {
  name: "get_linked_issues",
  description:
    "List all linked issues (exported Polaris issues) for a bug tracking configuration. Returns issue links and keys in the external bug tracking system.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ summary = true, config_id }) => {
    const issues = await getLinkedIssues({ configurationId: config_id });
    if (summary) {
      return jsonResponse(summarizeResponse(issues, summarizeLinkedIssue));
    }
    return jsonResponse(issues);
  },
};
