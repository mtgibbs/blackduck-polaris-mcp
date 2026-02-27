import { z } from "zod";
import { getLabels } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { validateFilter } from "../filter-validation.ts";

export const schema = {
  filter: z.string().optional().describe(
    "RSQL filter expression. Valid keys: name. Example: name=='production'",
  ),
  sort: z.string().optional().describe("Sort expression"),
};

export const getLabelsTool: ToolDefinition<typeof schema> = {
  name: "get_labels",
  description: "List all labels in the organization.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, sort }) => {
    // Validate filter if present
    if (filter) {
      const validationError = validateFilter(filter, "portfolio.labels");
      if (validationError) {
        return errorResponse(validationError);
      }
    }

    const labels = await getLabels({ filter, sort });
    return jsonResponse(labels);
  },
};
