import { z } from "zod";
import { updateVersionSetting } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("Version setting ID to update"),
  tool_type: z.string().describe("Tool type, e.g. Coverity"),
  version: z.string().describe("Tool version, e.g. 2024.12.0"),
  context: z.string().describe("Context level: tenant, application, project, or branch"),
  entity_id: z.string().describe(
    "Entity ID for the context (organization, application, project, or branch ID)",
  ),
  setting_type: z.string().describe("Setting type, e.g. Custom"),
};

export const updateVersionSettingTool: ToolDefinition<typeof schema> = {
  name: "update_version_setting",
  description:
    "Update an existing tool version setting by ID. Performs a full replacement (PUT) of the version setting.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ id, tool_type, version, context, entity_id, setting_type }) => {
    const result = await updateVersionSetting({
      id,
      toolType: tool_type,
      version,
      context,
      entityId: entity_id,
      settingType: setting_type,
    });
    return jsonResponse(result);
  },
};
