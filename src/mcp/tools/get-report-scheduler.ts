import { z } from "zod";
import { getReportScheduler } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  configuration_id: z
    .string()
    .describe("Report configuration ID that owns the scheduler"),
  scheduler_id: z
    .string()
    .describe("Scheduler ID to retrieve"),
};

export const getReportSchedulerTool: ToolDefinition<typeof schema> = {
  name: "get_report_scheduler",
  description:
    "Get details of a specific report scheduler by ID. Returns the scheduler configuration including frequency, timezone, day, time, and execution history metadata.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ configuration_id, scheduler_id }) => {
    try {
      const scheduler = await getReportScheduler({
        configurationId: configuration_id,
        schedulerId: scheduler_id,
      });
      return jsonResponse(scheduler);
    } catch (error) {
      return errorResponse(
        `Failed to get report scheduler: ${(error as Error).message}`,
      );
    }
  },
};
