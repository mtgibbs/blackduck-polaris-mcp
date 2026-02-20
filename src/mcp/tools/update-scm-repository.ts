import { z } from "zod";
import { updateScmRepository } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  repo_id: z.string().describe("SCM repository ID to update"),
  project_id: z.string().optional().describe("Polaris project ID"),
  application_id: z.string().optional().describe("Polaris application ID"),
  repository_url: z.string().optional().describe("New URL of the SCM repository"),
  scm_provider: z.string().optional().describe("SCM provider enum value"),
};

export const updateScmRepositoryTool: ToolDefinition<typeof schema> = {
  name: "update_scm_repository",
  description: "Update an existing SCM repository integration in Polaris.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ repo_id, project_id, application_id, repository_url, scm_provider }) => {
    const result = await updateScmRepository({
      repoId: repo_id,
      projectId: project_id,
      applicationId: application_id,
      repositoryUrl: repository_url,
      scmProvider: scm_provider,
    });
    return jsonResponse(result);
  },
};
