import { z } from "zod";
import { createScmGroupAuth } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z.string().describe("Polaris application ID"),
  scm_provider: z.string().describe("SCM provider enum value"),
  auth_name: z.string().optional().describe("Name for the SCM authentication"),
  auth_mode: z.string().optional().describe("PAT or OAUTH_2"),
  auth_token: z.string().optional().describe("Authentication token for the SCM provider"),
  auth_email: z
    .string()
    .optional()
    .describe("Email for SCM authentication (required for Bitbucket Cloud)"),
  group_url: z.string().optional().describe("URL of the SCM group or organization"),
};

export const createScmGroupAuthTool: ToolDefinition<typeof schema> = {
  name: "create_scm_group_auth",
  description:
    "Create group authentication for an SCM provider in Polaris. Associates authentication credentials with an application for SCM group access.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    application_id,
    scm_provider,
    auth_name,
    auth_mode,
    auth_token,
    auth_email,
    group_url,
  }) => {
    try {
      await createScmGroupAuth({
        applicationId: application_id,
        scmProvider: scm_provider,
        authName: auth_name,
        authMode: auth_mode,
        authToken: auth_token,
        authEmail: auth_email,
        groupUrl: group_url,
      });
      return jsonResponse({ success: true });
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
