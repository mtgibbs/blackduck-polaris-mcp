import { z } from "zod";
import { getReportConfiguration } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  configuration_id: z
    .string()
    .describe("Report configuration ID"),
};

export const getReportConfigurationTool: ToolDefinition<typeof schema> = {
  name: "get_report_configuration",
  description:
    "Get details of a specific report configuration by ID. Returns the configuration with its name, report type, scope, filters, and other settings.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ configuration_id }) => {
    try {
      const configuration = await getReportConfiguration({
        configurationId: configuration_id,
      });
      return jsonResponse(configuration);
    } catch (error) {
      return errorResponse(
        `Failed to get report configuration: ${(error as Error).message}`,
      );
    }
  },
};
