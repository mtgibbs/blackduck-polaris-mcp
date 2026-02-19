import { z } from "zod";
import { getBulkRepoImportGroupsStatus } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter. Keys: state, portfolioItemId. Example: state==COMPLETED"),
};

export const getBulkRepoImportGroupsStatusTool: ToolDefinition<typeof schema> = {
  name: "get_bulk_repo_import_groups_status",
  description:
    "Get the status of bulk repository import groups. Supports filtering by state (NOT_STARTED, IN_PROGRESS, FAILED, COMPLETED) and portfolioItemId.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    try {
      const statuses = await getBulkRepoImportGroupsStatus({ filter });
      return jsonResponse(statuses);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
