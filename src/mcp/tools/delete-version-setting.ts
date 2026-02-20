import { z } from "zod";
import { deleteVersionSetting } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("Version setting ID to delete"),
};

export const deleteVersionSettingTool: ToolDefinition<typeof schema> = {
  name: "delete_version_setting",
  description: "Delete an existing tool version setting by ID.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ id }) => {
    await deleteVersionSetting({ id });
    return jsonResponse({ success: true, id });
  },
};
