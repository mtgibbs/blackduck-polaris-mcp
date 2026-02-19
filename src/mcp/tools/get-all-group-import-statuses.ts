import { z } from "zod";
import { getAllGroupImportStatuses } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter. Key: state. Values: NOT_STARTED, IN_PROGRESS, FAILED, ABORTED, TIMED_OUT, PARTIALLY_COMPLETED, COMPLETED",
    ),
};

export const getAllGroupImportStatusesTool: ToolDefinition<typeof schema> = {
  name: "get_all_group_import_statuses",
  description:
    "Get the status of all bulk group import jobs. Supports filtering by state (NOT_STARTED, IN_PROGRESS, FAILED, ABORTED, TIMED_OUT, PARTIALLY_COMPLETED, COMPLETED).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    try {
      const result = await getAllGroupImportStatuses({ filter });
      return jsonResponse(result);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
