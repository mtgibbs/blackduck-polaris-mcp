import { z } from "zod";
import { getScmGroupSettings } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter. Keys: applicationId, groupId. Operator: =in= only"),
};

export const getScmGroupSettingsTool: ToolDefinition<typeof schema> = {
  name: "get_scm_group_settings",
  description: "Get group sync settings, optionally filtered by applicationId or groupId.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    try {
      const result = await getScmGroupSettings({ filter });
      return jsonResponse(result);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
