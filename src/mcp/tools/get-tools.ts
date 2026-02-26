import { z } from "zod";
import { getTools } from "../../services/index.ts";
import { summarizePolarisTool, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z.string().optional().describe("RSQL filter expression (e.g. type==coverity-analysis)"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getToolsTool: ToolDefinition<typeof schema> = {
  name: "get_tools",
  description:
    "List all available tools in the Polaris platform. Returns tool details including name, type, version, and status. Use the filter parameter to narrow results using RSQL expressions.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ summary = true, filter }) => {
    const tools = await getTools({ filter });
    if (summary) {
      return jsonResponse(summarizeResponse(tools, summarizePolarisTool));
    }
    return jsonResponse(tools);
  },
};
