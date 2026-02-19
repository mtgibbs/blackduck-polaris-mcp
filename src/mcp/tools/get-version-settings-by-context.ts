import { z } from "zod";
import { getVersionSettingsByContext } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  context: z.string().describe("Context level: tenant, application, project, or branch"),
  entity_id: z
    .string()
    .optional()
    .describe("Entity ID for the context (organization, application, project, or branch ID)"),
};

export const getVersionSettingsByContextTool: ToolDefinition<typeof schema> = {
  name: "get_version_settings_by_context",
  description:
    "Get tool version settings for a specific context level (tenant, application, project, or branch). Optionally filter by entity ID.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ context, entity_id }) => {
    const result = await getVersionSettingsByContext({ context, entityId: entity_id });
    return jsonResponse(result);
  },
};
