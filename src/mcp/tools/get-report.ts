import { z } from "zod";
import { getReport } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  report_id: z
    .string()
    .describe("Report ID (from run_report or get_reports)"),
};

export const getReportTool: ToolDefinition<typeof schema> = {
  name: "get_report",
  description:
    "Get details for a single report by ID. Returns full report metadata including status (INITIATED, IN_PROGRESS, COMPLETED, FAILED), configuration, dates, file size, and download links. Use this to check report completion status after running run_report.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ report_id }) => {
    const report = await getReport({ reportId: report_id });
    return jsonResponse(report);
  },
};
