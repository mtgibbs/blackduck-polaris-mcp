import { z } from "zod";
import { createLabel } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  name: z.string().describe("Name of the label"),
  description: z.string().optional().describe("Optional description of the label"),
};

export const createLabelTool: ToolDefinition<typeof schema> = {
  name: "create_label",
  description: "Create a new label in the organization.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ name, description }) => {
    try {
      const label = await createLabel({ name, description });
      return jsonResponse(label);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
