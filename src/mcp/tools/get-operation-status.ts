import { z } from "zod";
import { getOperationStatus } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z
    .string()
    .describe(
      "The operation identifier returned by add, edit, or delete component version operations",
    ),
};

export const getOperationStatusTool: ToolDefinition<typeof schema> = {
  name: "get_operation_status",
  description:
    "Get the status of a component version operation (add, edit, or delete). Possible statuses: PROCESSING, COMPLETED, ERROR. Poll this endpoint after initiating an add, edit, or delete operation.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id }) => {
    const status = await getOperationStatus(id);
    return jsonResponse(status);
  },
};
