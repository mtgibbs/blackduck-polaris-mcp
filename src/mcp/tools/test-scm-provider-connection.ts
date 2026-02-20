import { z } from "zod";
import { testScmProviderConnection } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scm_provider: z.string().describe("SCM provider enum value (e.g. GITHUB_STANDARD)"),
  scm_pat: z.string().describe("Personal Access Token for SCM provider"),
  scm_email: z.string().optional().describe("Required for Bitbucket Cloud"),
};

export const testScmProviderConnectionTool: ToolDefinition<typeof schema> = {
  name: "test_scm_provider_connection",
  description:
    "Test the connection to an SCM provider using a Personal Access Token. Validates that the PAT is valid and the provider is reachable.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ scm_provider, scm_pat, scm_email }) => {
    await testScmProviderConnection({
      scmProvider: scm_provider,
      scmPat: scm_pat,
      scmEmail: scm_email,
    });
    return jsonResponse({ success: true });
  },
};
