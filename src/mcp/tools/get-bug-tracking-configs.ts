import { z } from "zod";
import { getBugTrackingConfigurations } from "../../services/index.ts";
import { summarizeBugTrackingConfig, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression for bug tracking configurations"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getBugTrackingConfigsTool: ToolDefinition<typeof schema> = {
  name: "get_bug_tracking_configurations",
  description:
    "List bug tracking integration configurations (Jira, Azure DevOps) set up in Polaris. Returns configuration IDs needed for exporting issues to external ticket systems.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ summary = true, filter }) => {
    const configs = await getBugTrackingConfigurations({
      filter,
    });
    if (summary) {
      return jsonResponse(
        summarizeResponse(configs, summarizeBugTrackingConfig),
      );
    }
    return jsonResponse(configs);
  },
};
