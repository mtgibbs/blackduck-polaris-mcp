import { z } from "zod";
import { createScmRepository } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().describe("Polaris project ID to associate with this repository"),
  repository_url: z.string().describe("URL of the SCM repository"),
  scm_provider: z.string().describe("SCM provider enum value"),
  application_id: z.string().optional().describe("Polaris application ID"),
  auth_name: z.string().optional().describe("Name for the SCM authentication"),
  auth_mode: z.string().optional().describe("PAT or OAUTH_2"),
  auth_token: z.string().optional().describe("Authentication token for the SCM provider"),
  auth_email: z.string().optional().describe(
    "Email for SCM authentication (required for Bitbucket Cloud)",
  ),
};

export const createScmRepositoryTool: ToolDefinition<typeof schema> = {
  name: "create_scm_repository",
  description:
    "Create a new SCM repository integration in Polaris. Associates an SCM repository URL with a Polaris project.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    project_id,
    repository_url,
    scm_provider,
    application_id,
    auth_name,
    auth_mode,
    auth_token,
    auth_email,
  }) => {
    const result = await createScmRepository({
      projectId: project_id,
      repositoryUrl: repository_url,
      scmProvider: scm_provider,
      applicationId: application_id,
      authName: auth_name,
      authMode: auth_mode,
      authToken: auth_token,
      authEmail: auth_email,
    });
    return jsonResponse(result);
  },
};
