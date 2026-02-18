import { z } from "zod";
import { getBugTrackingConfigurations } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression for bug tracking configurations"),
};

export const getBugTrackingConfigsTool: ToolDefinition<typeof schema> = {
  name: "get_bug_tracking_configurations",
  description:
    "List bug tracking integration configurations (Jira, Azure DevOps) set up in Polaris. Returns configuration IDs needed for exporting issues to external ticket systems.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    const configs = await getBugTrackingConfigurations({
      filter,
    });
    return jsonResponse(configs);
  },
};
