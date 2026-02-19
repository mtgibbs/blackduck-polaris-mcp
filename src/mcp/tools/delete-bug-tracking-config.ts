import { z } from "zod";
import { deleteBugTrackingConfiguration } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("Bug tracking configuration ID to delete"),
};

export const deleteBugTrackingConfigTool: ToolDefinition<typeof schema> = {
  name: "delete_bug_tracking_config",
  description:
    "Delete a bug tracking integration configuration from Polaris. Also removes related OAuth, access token, and project mapping resources.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ id }) => {
    await deleteBugTrackingConfiguration({ id });
    return jsonResponse({ success: true, id });
  },
};
