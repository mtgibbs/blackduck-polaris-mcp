import { z } from "zod";
import { getTools } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z.string().optional().describe("RSQL filter expression (e.g. type==coverity-analysis)"),
};

export const getToolsTool: ToolDefinition<typeof schema> = {
  name: "get_tools",
  description:
    "List all available tools in the Polaris platform. Returns tool details including name, type, version, and status. Use the filter parameter to narrow results using RSQL expressions.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    try {
      const tools = await getTools({ filter });
      return jsonResponse(tools);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
