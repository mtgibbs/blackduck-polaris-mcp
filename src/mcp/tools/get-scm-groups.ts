import { z } from "zod";
import { getScmProviderGroups } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scm_provider: z.string().describe("SCM provider enum value (e.g. GITHUB_STANDARD)"),
  scm_pat: z.string().describe("Personal Access Token for SCM provider"),
  scm_email: z.string().optional().describe("Required for Bitbucket Cloud"),
  top_level_only: z.boolean().optional().describe("GitLab only: fetch only top-level groups"),
};

export const getScmGroupsTool: ToolDefinition<typeof schema> = {
  name: "get_scm_groups",
  description:
    "List groups from an SCM provider (e.g. GitHub orgs, GitLab groups). Requires a PAT for authentication.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ scm_provider, scm_pat, scm_email, top_level_only }) => {
    try {
      const groups = await getScmProviderGroups({
        scmProvider: scm_provider,
        scmPat: scm_pat,
        scmEmail: scm_email,
        topLevelOnly: top_level_only,
      });
      return jsonResponse(groups);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
