import { z } from "zod";
import { createReportScheduler } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  configuration_id: z
    .string()
    .describe("Report configuration ID to create a scheduler for"),
  frequency: z
    .enum(["daily", "weekly", "monthly"])
    .describe(
      "Scheduler frequency: daily (runs every day), weekly (runs once per week on specified day), or monthly (runs once per month on specified day)",
    ),
  timezone: z
    .string()
    .describe(
      "Timezone for the scheduled execution (e.g., America/New_York, Europe/London). Use get_report_timezones to get valid timezone values.",
    ),
  day: z
    .string()
    .optional()
    .describe(
      "Day of week (for weekly: Monday-Sunday) or day of month (for monthly: 1-31). Not used for daily frequency.",
    ),
  time: z
    .string()
    .optional()
    .describe(
      "Time of day to run the report in HH:MM format (24-hour, e.g., 09:00, 14:30)",
    ),
};

export const createReportSchedulerTool: ToolDefinition<typeof schema> = {
  name: "create_report_scheduler",
  description:
    "Create a new scheduler for a report configuration. A scheduler automatically runs the associated configuration on a recurring basis (daily, weekly, or monthly). The report will be generated at the specified time in the specified timezone. Only one scheduler can exist per configuration.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    configuration_id,
    frequency,
    timezone,
    day,
    time,
  }) => {
    try {
      const scheduler = await createReportScheduler({
        configurationId: configuration_id,
        payload: {
          frequency,
          timezone,
          day,
          time,
        },
      });
      return jsonResponse(scheduler);
    } catch (error) {
      return errorResponse(
        `Failed to create report scheduler: ${(error as Error).message}`,
      );
    }
  },
};
