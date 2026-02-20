import { z } from "zod";
import { updateBugTrackingConfiguration } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("Bug tracking configuration ID"),
  url: z.string().optional().describe("URL of the bug tracking instance"),
  type: z.enum(["JIRA", "AZURE"]).optional().describe("Bug tracking system type enum value"),
  enabled: z.boolean().optional().describe("Whether the configuration is enabled"),
  deployment_type: z
    .string()
    .optional()
    .describe("Deployment type for JIRA (e.g. cloud or server)"),
  access_token: z.string().optional().describe("Access token for AZURE DevOps"),
};

export const updateBugTrackingConfigTool: ToolDefinition<typeof schema> = {
  name: "update_bug_tracking_config",
  description: "Update an existing bug tracking integration configuration in Polaris.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ id, url, type, enabled, deployment_type, access_token }) => {
    const config = await updateBugTrackingConfiguration({
      id,
      url,
      type,
      enabled,
      details: deployment_type !== undefined || access_token !== undefined
        ? { deploymentType: deployment_type, accessToken: access_token }
        : undefined,
    });
    return jsonResponse(config);
  },
};
