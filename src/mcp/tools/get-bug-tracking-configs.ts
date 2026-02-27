import { z } from "zod";
import { getBugTrackingConfigurations } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { validateFilter } from "../filter-validation.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter expression. Valid keys: type, url, enabled. Examples: type=='JIRA', enabled==true",
    ),
};

export const getBugTrackingConfigsTool: ToolDefinition<typeof schema> = {
  name: "get_bug_tracking_configurations",
  description:
    "List bug tracking integration configurations (Jira, Azure DevOps) set up in Polaris. Returns configuration IDs needed for exporting issues to external ticket systems.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    // Validate filter if present
    if (filter) {
      const validationError = validateFilter(filter, "bugtracking.configurations");
      if (validationError) {
        return errorResponse(validationError);
      }
    }

    const configs = await getBugTrackingConfigurations({
      filter,
    });
    return jsonResponse(configs);
  },
};
