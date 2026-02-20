import { z } from "zod";
import { testScmGroupConnection } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  repository_url: z.string().describe("SCM group URL"),
  scm_provider: z.string().describe("SCM provider enum value (e.g. GITHUB_STANDARD)"),
  scm_pat: z.string().describe("Personal Access Token for SCM provider"),
  email: z.string().optional().describe("Required for Bitbucket Cloud"),
};

export const testScmGroupConnectionTool: ToolDefinition<typeof schema> = {
  name: "test_scm_group_connection",
  description: "Test the SCM group connection for the given repository URL and provider.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ repository_url, scm_provider, scm_pat, email }) => {
    await testScmGroupConnection({
      repositoryUrl: repository_url,
      scmProvider: scm_provider,
      scmPat: scm_pat,
      email,
    });
    return jsonResponse({ success: true });
  },
};
