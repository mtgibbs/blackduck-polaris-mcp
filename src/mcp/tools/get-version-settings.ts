import { z } from "zod";
import { getVersionSettings } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z.string().optional().describe("RSQL filter expression for version settings"),
};

export const getVersionSettingsTool: ToolDefinition<typeof schema> = {
  name: "get_version_settings",
  description:
    "List all tool version settings. Optionally filter using RSQL expressions to find settings for specific contexts or tool types.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    const result = await getVersionSettings({ filter });
    return jsonResponse(result);
  },
};
