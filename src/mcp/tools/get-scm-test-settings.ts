import { z } from "zod";
import { getScmTestSettings } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scope_id: z.string(),
  scope: z.enum(["organization", "application", "project", "branch"]),
};

export const getScmTestSettingsTool: ToolDefinition<typeof schema> = {
  name: "get_scm_test_settings",
  description:
    "Get test automation synchronization settings for a given scope (organization, application, project, or branch).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ scope_id, scope }) => {
    try {
      const data = await getScmTestSettings({ scopeId: scope_id, scope });
      return jsonResponse(data);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
