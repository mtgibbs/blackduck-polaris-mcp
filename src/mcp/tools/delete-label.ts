import { z } from "zod";
import { deleteLabel } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  label_id: z.string().describe("Label ID to delete"),
};

export const deleteLabelTool: ToolDefinition<typeof schema> = {
  name: "delete_label",
  description: "Delete a label from the organization.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ label_id }) => {
    await deleteLabel({ labelId: label_id });
    return jsonResponse({ success: true });
  },
};
