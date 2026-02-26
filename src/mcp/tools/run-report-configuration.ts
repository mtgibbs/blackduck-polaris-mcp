import { z } from "zod";
import { runReportConfiguration } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  configuration_id: z
    .string()
    .describe("Report configuration ID to run"),
};

export const runReportConfigurationTool: ToolDefinition<typeof schema> = {
  name: "run_report_configuration",
  description:
    "Run a saved report configuration. Initiates report generation using the configuration's saved settings and returns a report object with status INITIATED. The client should poll get_report with the returned report ID to check for completion (status becomes COMPLETED or FAILED). This is an alternative to run_report that uses pre-configured settings.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ configuration_id }) => {
    try {
      const report = await runReportConfiguration({
        configurationId: configuration_id,
      });
      return jsonResponse(report);
    } catch (error) {
      return errorResponse(
        `Failed to run report configuration: ${(error as Error).message}`,
      );
    }
  },
};
