import { z } from "zod";
import { createBugTrackingConfiguration } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  system: z
    .enum(["jira", "azure"])
    .describe("Bug tracking system type (jira or azure)"),
  url: z.string().describe("URL of the bug tracking instance"),
  type: z.enum(["JIRA", "AZURE"]).describe("Bug tracking system type enum value"),
  enabled: z.boolean().describe("Whether the configuration is enabled"),
  deployment_type: z
    .string()
    .optional()
    .describe("Deployment type for JIRA (e.g. cloud or server)"),
  access_token: z.string().optional().describe("Access token for AZURE DevOps"),
};

export const createBugTrackingConfigTool: ToolDefinition<typeof schema> = {
  name: "create_bug_tracking_config",
  description:
    "Create a new bug tracking integration configuration (Jira or Azure DevOps) in Polaris.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ system, url, type, enabled, deployment_type, access_token }) => {
    const config = await createBugTrackingConfiguration({
      system,
      url,
      type,
      enabled,
      details: {
        deploymentType: deployment_type,
        accessToken: access_token,
      },
    });
    return jsonResponse(config);
  },
};
