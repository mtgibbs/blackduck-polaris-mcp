import { z } from "zod";
import { mergeLabels } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  labels_to_merge: z.array(z.string()).describe("Array of label UUIDs to merge"),
  target_name: z.string().describe("Name for the merged label"),
  target_description: z.string().optional().describe("Optional description for the merged label"),
};

export const mergeLabelsTool: ToolDefinition<typeof schema> = {
  name: "merge_labels",
  description: "Merge multiple labels into a single target label.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ labels_to_merge, target_name, target_description }) => {
    try {
      const label = await mergeLabels({
        labelsToMerge: labels_to_merge,
        targetName: target_name,
        targetDescription: target_description,
      });
      return jsonResponse(label);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
