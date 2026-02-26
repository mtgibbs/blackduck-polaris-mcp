import { z } from "zod";
import { deleteReportConfiguration } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  configuration_id: z
    .string()
    .describe("Report configuration ID to delete"),
};

export const deleteReportConfigurationTool: ToolDefinition<typeof schema> = {
  name: "delete_report_configuration",
  description:
    "Delete a report configuration by ID. Returns 204 No Content on success. Deleting a configuration does not delete reports that were generated using it.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ configuration_id }) => {
    try {
      await deleteReportConfiguration({
        configurationId: configuration_id,
      });
      return jsonResponse({ success: true });
    } catch (error) {
      return errorResponse(
        `Failed to delete report configuration: ${(error as Error).message}`,
      );
    }
  },
};
