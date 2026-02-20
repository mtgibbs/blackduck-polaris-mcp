import { z } from "zod";
import { deleteScmTestSettings } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scope_id: z.string().describe(
    "UUID of the scope resource (org ID, app ID, project ID, or branch ID)",
  ),
  scope: z.enum(["organization", "application", "project", "branch"]).describe(
    "Scope level for test settings",
  ),
};

export const deleteScmTestSettingsTool: ToolDefinition<typeof schema> = {
  name: "delete_scm_test_settings",
  description:
    "Delete test automation synchronization settings for a given scope (organization, application, project, or branch).",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ scope_id, scope }) => {
    await deleteScmTestSettings({ scopeId: scope_id, scope });
    return jsonResponse({ success: true });
  },
};
