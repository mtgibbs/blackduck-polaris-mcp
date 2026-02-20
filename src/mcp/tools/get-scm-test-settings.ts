import { z } from "zod";
import { getScmTestSettings } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scope_id: z.string().describe(
    "UUID of the scope resource (org ID, app ID, project ID, or branch ID)",
  ),
  scope: z.enum(["organization", "application", "project", "branch"]).describe(
    "Scope level for test settings",
  ),
};

export const getScmTestSettingsTool: ToolDefinition<typeof schema> = {
  name: "get_scm_test_settings",
  description:
    "Get test automation synchronization settings for a given scope (organization, application, project, or branch).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ scope_id, scope }) => {
    const data = await getScmTestSettings({ scopeId: scope_id, scope });
    return jsonResponse(data);
  },
};
