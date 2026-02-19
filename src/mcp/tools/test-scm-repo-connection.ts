import { z } from "zod";
import { testScmRepoConnection } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().describe("Polaris project ID"),
  repository_url: z.string().describe("URL of the SCM repository to test"),
  scm_provider: z.string().describe("SCM provider enum value"),
};

export const testScmRepoConnectionTool: ToolDefinition<typeof schema> = {
  name: "test_scm_repo_connection",
  description:
    "Test the connection to an SCM repository from Polaris. Returns whether the connection is successful.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ project_id, repository_url, scm_provider }) => {
    const result = await testScmRepoConnection({
      projectId: project_id,
      repositoryUrl: repository_url,
      scmProvider: scm_provider,
    });
    return jsonResponse(result);
  },
};
