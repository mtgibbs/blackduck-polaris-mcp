import { z } from "zod";
import { getConfigProjectMappings } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { validateFilter } from "../filter-validation.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter expression. Valid keys: configurationId, projectId, btsProjectKey. Examples: projectId=='abc123', btsProjectKey=='PROJ-1'",
    ),
};

export const getConfigProjectMappingsTool: ToolDefinition<typeof schema> = {
  name: "get_config_project_mappings",
  description:
    "List all project mappings between Polaris projects and external bug tracking projects under a specific bug tracking configuration.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id, filter }) => {
    // Validate filter if present
    if (filter) {
      const validationError = validateFilter(filter, "bugtracking.project_mappings");
      if (validationError) {
        return errorResponse(validationError);
      }
    }

    const mappings = await getConfigProjectMappings({
      configurationId: config_id,
      filter,
    });
    return jsonResponse(mappings);
  },
};
