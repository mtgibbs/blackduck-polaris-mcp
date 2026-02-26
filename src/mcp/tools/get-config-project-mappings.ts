import { z } from "zod";
import { getConfigProjectMappings } from "../../services/index.ts";
import { summarizeProjectMapping, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getConfigProjectMappingsTool: ToolDefinition<typeof schema> = {
  name: "get_config_project_mappings",
  description:
    "List all project mappings between Polaris projects and external bug tracking projects under a specific bug tracking configuration.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ summary = true, config_id }) => {
    const mappings = await getConfigProjectMappings({
      configurationId: config_id,
    });
    if (summary) {
      return jsonResponse(
        summarizeResponse(mappings, summarizeProjectMapping),
      );
    }
    return jsonResponse(mappings);
  },
};
