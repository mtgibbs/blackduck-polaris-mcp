import { z } from "zod";
import { updateReportScheduler } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  configuration_id: z
    .string()
    .describe("Report configuration ID that owns the scheduler"),
  scheduler_id: z
    .string()
    .describe("Scheduler ID to update"),
  frequency: z
    .enum(["daily", "weekly", "monthly"])
    .optional()
    .describe(
      "Scheduler frequency: daily (runs every day), weekly (runs once per week on specified day), or monthly (runs once per month on specified day)",
    ),
  timezone: z
    .string()
    .optional()
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

export const updateReportSchedulerTool: ToolDefinition<typeof schema> = {
  name: "update_report_scheduler",
  description:
    "Update an existing report scheduler using PATCH. Only provided fields will be updated. Use this to change the schedule frequency, timezone, day, or time without affecting other settings.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    configuration_id,
    scheduler_id,
    frequency,
    timezone,
    day,
    time,
  }) => {
    try {
      const payload: Record<string, unknown> = {};
      if (frequency !== undefined) payload.frequency = frequency;
      if (timezone !== undefined) payload.timezone = timezone;
      if (day !== undefined) payload.day = day;
      if (time !== undefined) payload.time = time;

      const scheduler = await updateReportScheduler({
        configurationId: configuration_id,
        schedulerId: scheduler_id,
        payload,
      });
      return jsonResponse(scheduler);
    } catch (error) {
      return errorResponse(
        `Failed to update report scheduler: ${(error as Error).message}`,
      );
    }
  },
};
