import { z } from "zod";
import { deleteDashboardFilter } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  dashboard_id: z
    .string()
    .describe("Dashboard ID that owns the filter"),
  filter_id: z
    .string()
    .describe("Filter ID to delete"),
};

export const deleteDashboardFilterTool: ToolDefinition<typeof schema> = {
  name: "delete_dashboard_filter",
  description:
    "Delete a dashboard filter by ID. Returns 204 No Content on success. This action is permanent and cannot be undone.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ dashboard_id, filter_id }) => {
    try {
      await deleteDashboardFilter({
        dashboardId: dashboard_id,
        filterId: filter_id,
      });
      return jsonResponse({ success: true });
    } catch (error) {
      return errorResponse(
        `Failed to delete dashboard filter: ${(error as Error).message}`,
      );
    }
  },
};
