import { z } from "zod";
import { createVersionSetting } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  tool_type: z.string().describe("Tool type, e.g. Coverity"),
  version: z.string().describe("Tool version, e.g. 2024.12.0"),
  context: z.string().describe("Context level: tenant, application, project, or branch"),
  entity_id: z.string().describe(
    "Entity ID for the context (organization, application, project, or branch ID)",
  ),
  setting_type: z.string().describe("Setting type, e.g. Custom"),
};

export const createVersionSettingTool: ToolDefinition<typeof schema> = {
  name: "create_version_setting",
  description:
    "Create a tool version setting to pin a tool version at a specific context level (tenant, application, project, or branch).",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ tool_type, version, context, entity_id, setting_type }) => {
    const result = await createVersionSetting({
      toolType: tool_type,
      version,
      context,
      entityId: entity_id,
      settingType: setting_type,
    });
    return jsonResponse(result);
  },
};
