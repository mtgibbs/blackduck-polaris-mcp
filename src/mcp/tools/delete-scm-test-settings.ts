import { z } from "zod";
import { deleteScmTestSettings } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scope_id: z.string(),
  scope: z.enum(["organization", "application", "project", "branch"]),
};

export const deleteScmTestSettingsTool: ToolDefinition<typeof schema> = {
  name: "delete_scm_test_settings",
  description:
    "Delete test automation synchronization settings for a given scope (organization, application, project, or branch).",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ scope_id, scope }) => {
    try {
      await deleteScmTestSettings({ scopeId: scope_id, scope });
      return jsonResponse({ success: true });
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
