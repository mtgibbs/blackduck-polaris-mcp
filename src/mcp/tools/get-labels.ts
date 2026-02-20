import { z } from "zod";
import { getLabels } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z.string().optional().describe("RSQL filter. Filterable: id, name"),
  sort: z.string().optional().describe("Sort expression"),
};

export const getLabelsTool: ToolDefinition<typeof schema> = {
  name: "get_labels",
  description: "List all labels in the organization.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, sort }) => {
    const labels = await getLabels({ filter, sort });
    return jsonResponse(labels);
  },
};
