import { z } from "zod";
import { updateDashboardFilter } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  dashboard_id: z
    .string()
    .describe("Dashboard ID that owns the filter"),
  filter_id: z
    .string()
    .describe("Filter ID to update"),
  name: z
    .string()
    .optional()
    .describe("Filter name (optional, for display in the UI)"),
  filter: z
    .record(z.unknown())
    .optional()
    .describe(
      "Filter configuration object containing the filter criteria and settings specific to the dashboard type",
    ),
};

export const updateDashboardFilterTool: ToolDefinition<typeof schema> = {
  name: "update_dashboard_filter",
  description:
    "Update an existing dashboard filter using PATCH. Only provided fields will be updated. Use this to modify the filter name or filter configuration without affecting other settings.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ dashboard_id, filter_id, name, filter }) => {
    try {
      const payload: Record<string, unknown> = {};
      if (name !== undefined) payload.name = name;
      if (filter !== undefined) payload.filter = filter;

      const dashboardFilter = await updateDashboardFilter({
        dashboardId: dashboard_id,
        filterId: filter_id,
        payload,
      });
      return jsonResponse(dashboardFilter);
    } catch (error) {
      return errorResponse(
        `Failed to update dashboard filter: ${(error as Error).message}`,
      );
    }
  },
};
