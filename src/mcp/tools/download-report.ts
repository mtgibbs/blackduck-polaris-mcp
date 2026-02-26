import { z } from "zod";
import { downloadReport } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  report_id: z
    .string()
    .describe("Report ID (from run_report or get_reports)"),
};

export const downloadReportTool: ToolDefinition<typeof schema> = {
  name: "download_report",
  description:
    "Download a completed report. Returns download URL or file information. Only the report creator can download reports. Reports are automatically deleted after 30 days. The report must have status=COMPLETED before it can be downloaded.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ report_id }) => {
    try {
      const response = await downloadReport({ reportId: report_id });

      // If the response has a URL or download link, extract and return it
      // The API returns a Response object, so we need to handle it appropriately
      if (response.ok) {
        const contentType = response.headers.get("Content-Type");

        // If it's a redirect or has a location header, return that
        const location = response.headers.get("Location");
        if (location) {
          return jsonResponse({
            downloadUrl: location,
            message: "Report download URL retrieved successfully",
          });
        }

        // If it's JSON with download metadata, return that
        if (contentType?.includes("application/json")) {
          const data = await response.json();
          return jsonResponse(data);
        }

        // Otherwise, indicate the report is available for download
        return jsonResponse({
          status: response.status,
          statusText: response.statusText,
          message: "Report is available for download. The API has initiated the download process.",
          contentType: contentType || "unknown",
        });
      } else {
        return errorResponse(
          `Failed to download report: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      return errorResponse(
        `Failed to download report: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  },
};
