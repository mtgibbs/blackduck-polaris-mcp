import { z } from "zod";
import { getLabels } from "../../services/index.ts";
import { summarizeLabel, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z.string().optional().describe("RSQL filter. Filterable: id, name"),
  sort: z.string().optional().describe("Sort expression"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getLabelsTool: ToolDefinition<typeof schema> = {
  name: "get_labels",
  description: "List all labels in the organization.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (args) => {
    const { summary = true, ...rest } = args;
    const labels = await getLabels({ filter: rest.filter, sort: rest.sort });
    if (summary) {
      return jsonResponse(summarizeResponse(labels, summarizeLabel));
    }
    return jsonResponse(labels);
  },
};
