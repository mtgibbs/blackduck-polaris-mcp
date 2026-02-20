import { z } from "zod";
import { getToolLicense } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  tool_name: z
    .string()
    .describe("Tool name, e.g. coverity-analysis (currently only coverity-analysis is supported)"),
};

export const getToolLicenseTool: ToolDefinition<typeof schema> = {
  name: "get_tool_license",
  description:
    "Download the license file for a Polaris tool. Currently only coverity-analysis is supported. Returns the license file content.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ tool_name }) => {
    const license = await getToolLicense({ toolName: tool_name });
    return jsonResponse(license);
  },
};
