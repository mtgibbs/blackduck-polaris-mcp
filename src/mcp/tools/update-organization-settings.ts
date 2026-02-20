import { z } from "zod";
import { updateOrganizationSettings } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  allow_label_creation: z
    .boolean()
    .describe("Whether application role users can create labels"),
};

export const updateOrganizationSettingsTool: ToolDefinition<typeof schema> = {
  name: "update_organization_settings",
  description: "Update organization settings.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ allow_label_creation }) => {
    const settings = await updateOrganizationSettings({
      allowLabelCreationForApplicationRoleUser: allow_label_creation,
    });
    return jsonResponse(settings);
  },
};
