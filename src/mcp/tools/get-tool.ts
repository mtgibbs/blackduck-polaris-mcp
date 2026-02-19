import { z } from "zod";
import { getTool } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("Tool ID in name:version format (e.g. cov_thin_client:2022.3.0)"),
};

export const getToolTool: ToolDefinition<typeof schema> = {
  name: "get_tool",
  description:
    "Get details for a single Polaris tool by its ID. The ID format is name:version (e.g. cov_thin_client:2022.3.0). Returns name, type, version, status, and beta flag.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id }) => {
    try {
      const tool = await getTool({ id });
      return jsonResponse(tool);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
