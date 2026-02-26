import { z } from "zod";
import { getReportTimezones } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  _placeholder: z.string().optional().describe("No parameters required"),
};

export const getReportTimezonesTool: ToolDefinition<typeof schema> = {
  name: "get_report_timezones",
  description:
    "Get list of valid timezone identifier strings for report scheduler configuration. Returns an array of timezone names (e.g., 'America/New_York', 'Europe/London', 'UTC'). Use these values when creating or updating report schedulers with create_report_scheduler or update_report_scheduler.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async () => {
    const timezones = await getReportTimezones();
    return jsonResponse(timezones);
  },
};
