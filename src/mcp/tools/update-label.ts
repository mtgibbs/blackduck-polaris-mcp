import { z } from "zod";
import { updateLabel } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  label_id: z.string().describe("Label ID to update"),
  name: z.string().optional().describe("New name for the label"),
  description: z.string().optional().describe("New description for the label"),
};

export const updateLabelTool: ToolDefinition<typeof schema> = {
  name: "update_label",
  description: "Update an existing label.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ label_id, name, description }) => {
    const label = await updateLabel({ labelId: label_id, name, description });
    return jsonResponse(label);
  },
};
