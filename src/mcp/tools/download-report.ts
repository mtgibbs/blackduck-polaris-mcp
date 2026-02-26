import { z } from "zod";
import { getReport, getReportDownloadUrl } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  report_id: z
    .string()
    .describe("Report ID (from run_report or get_reports)"),
};

export const downloadReportTool: ToolDefinition<typeof schema> = {
  name: "download_report",
  description:
    "Get download information for a completed report. Returns the download URL and report metadata. The report must have status=COMPLETED before it can be downloaded. Only the report creator can download reports. Reports are automatically deleted after 30 days.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ report_id }) => {
    const report = await getReport({ reportId: report_id });

    if (report.status !== "COMPLETED") {
      return errorResponse(
        `Report is not ready for download. Current status: ${report.status}.` +
          (report.status === "INITIATED" || report.status === "IN_PROGRESS"
            ? " Poll get_report to check for completion."
            : ""),
      );
    }

    const downloadUrl = getReportDownloadUrl({ reportId: report_id });

    return jsonResponse({
      downloadUrl,
      report: {
        id: report.id,
        name: report.name,
        status: report.status,
        reportType: report.reportType,
        format: report.format,
        fileSize: report.fileSize,
        completedDate: report.completedDate,
      },
    });
  },
};
