import { z } from "zod";
import { getLabel } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  label_id: z.string().describe("Label ID"),
  include_usage_stats: z
    .boolean()
    .optional()
    .describe(
      "When true, response includes label usage statistics for Application and Project",
    ),
};

export const getLabelTool: ToolDefinition<typeof schema> = {
  name: "get_label",
  description: "Get a single label by ID.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ label_id, include_usage_stats }) => {
    try {
      const label = await getLabel({ labelId: label_id, includeUsageStats: include_usage_stats });
      return jsonResponse(label);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
