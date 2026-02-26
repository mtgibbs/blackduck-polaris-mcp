import { z } from "zod";
import { getDashboardFilters } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  dashboard_id: z
    .string()
    .describe("Dashboard ID to get filters for"),
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression to filter the results"),
  offset: z
    .number()
    .optional()
    .default(0)
    .describe("Offset for pagination (default: 0)"),
  limit: z
    .number()
    .optional()
    .default(25)
    .describe("Limit for pagination (default: 25, max: 100)"),
};

export const getDashboardFiltersTool: ToolDefinition<typeof schema> = {
  name: "get_dashboard_filters",
  description:
    "Get a paginated list of saved dashboard filters for a specific dashboard. Dashboard filters are saved filter configurations that can be applied to the reporting dashboard UI.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ dashboard_id, filter, offset, limit }) => {
    try {
      const filters = await getDashboardFilters({
        dashboardId: dashboard_id,
        filter,
        offset,
        limit,
      });
      return jsonResponse(filters);
    } catch (error) {
      return errorResponse(
        `Failed to get dashboard filters: ${(error as Error).message}`,
      );
    }
  },
};
