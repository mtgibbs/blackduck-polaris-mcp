import { z } from "zod";
import { createDashboardFilter } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  dashboard_id: z
    .string()
    .describe("Dashboard ID to create a filter for"),
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

export const createDashboardFilterTool: ToolDefinition<typeof schema> = {
  name: "create_dashboard_filter",
  description:
    "Create a new saved filter for a dashboard. Dashboard filters allow users to save and reuse common filter configurations in the Polaris reporting dashboard UI. The filter object structure varies by dashboard type.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ dashboard_id, name, filter }) => {
    try {
      const payload: Record<string, unknown> = {};
      if (name !== undefined) payload.name = name;
      if (filter !== undefined) payload.filter = filter;

      const dashboardFilter = await createDashboardFilter({
        dashboardId: dashboard_id,
        payload,
      });
      return jsonResponse(dashboardFilter);
    } catch (error) {
      return errorResponse(
        `Failed to create dashboard filter: ${(error as Error).message}`,
      );
    }
  },
};
