import { z } from "zod";
import { testScmGroupConnection } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  repository_url: z.string().describe("SCM group URL"),
  scm_provider: z.string(),
  scm_pat: z.string(),
  email: z.string().optional().describe("Required for Bitbucket Cloud"),
};

export const testScmGroupConnectionTool: ToolDefinition<typeof schema> = {
  name: "test_scm_group_connection",
  description: "Test the SCM group connection for the given repository URL and provider.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ repository_url, scm_provider, scm_pat, email }) => {
    try {
      await testScmGroupConnection({
        repositoryUrl: repository_url,
        scmProvider: scm_provider,
        scmPat: scm_pat,
        email,
      });
      return jsonResponse({ success: true });
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
