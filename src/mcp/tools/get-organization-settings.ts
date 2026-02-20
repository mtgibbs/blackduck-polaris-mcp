import { z } from "zod";
import { getOrganizationSettings } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  _placeholder: z.string().optional().describe("No parameters required"),
};

export const getOrganizationSettingsTool: ToolDefinition<typeof schema> = {
  name: "get_organization_settings",
  description: "Get the organization settings including label creation permissions.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async () => {
    const settings = await getOrganizationSettings();
    return jsonResponse(settings);
  },
};
