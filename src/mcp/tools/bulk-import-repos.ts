import { z } from "zod";
import { bulkImportRepos } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z.string().describe("Polaris application ID"),
  scm_provider: z.string().describe("SCM provider enum value"),
  scm_pat: z.string().describe("Personal Access Token for the SCM provider"),
  scm_email: z.string().optional().describe("Required for Bitbucket Cloud"),
  repositories: z
    .string()
    .describe(
      "JSON array of repository selections: [{ groupName: string, allRepositoriesInGroup: boolean, includeRepositories?: string[], excludeRepositories?: string[] }]",
    ),
  issue_policy_ids: z.string().optional().describe("Comma-separated issue policy UUIDs"),
  scan_policy_ids: z.string().optional().describe("Comma-separated scan policy UUIDs"),
};

export const bulkImportReposTool: ToolDefinition<typeof schema> = {
  name: "bulk_import_repos",
  description:
    "Initiate a bulk repository import job for a Polaris application. Imports SCM repositories in bulk and returns the job status URL.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    application_id,
    scm_provider,
    scm_pat,
    scm_email,
    repositories,
    issue_policy_ids,
    scan_policy_ids,
  }) => {
    try {
      const parsedRepositories = JSON.parse(repositories);
      const issuePolicyIds = issue_policy_ids
        ? issue_policy_ids.split(",").map((s) => s.trim())
        : undefined;
      const scanPolicyIds = scan_policy_ids
        ? scan_policy_ids.split(",").map((s) => s.trim())
        : undefined;
      const policySettings = issuePolicyIds || scanPolicyIds
        ? { issuePolicyIds, scanPolicyIds }
        : undefined;
      const result = await bulkImportRepos({
        applicationId: application_id,
        scmProvider: scm_provider,
        scmPat: scm_pat,
        scmEmail: scm_email,
        repositories: parsedRepositories,
        policySettings,
      });
      return jsonResponse(result);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
