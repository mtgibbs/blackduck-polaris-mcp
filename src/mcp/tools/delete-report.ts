import { z } from "zod";
import { deleteReport } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  report_id: z
    .string()
    .describe("Report ID to delete"),
};

export const deleteReportTool: ToolDefinition<typeof schema> = {
  name: "delete_report",
  description:
    "Delete a report by ID. Removes the report from the system. Note: Reports are automatically deleted after 30 days.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ report_id }) => {
    await deleteReport({ reportId: report_id });
    return jsonResponse({ success: true, message: "Report deleted successfully" });
  },
};
