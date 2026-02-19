import { z } from "zod";
import { bulkImportGroups } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scm_provider: z.string().describe("SCM provider enum value"),
  scm_pat: z.string().describe("Personal Access Token for the SCM provider"),
  scm_email: z.string().optional().describe("Required for Bitbucket Cloud"),
  automatic_mapping: z.boolean().optional().describe("Auto-map groups to applications"),
  repository_selections: z
    .string()
    .describe("JSON array of repository selections with application mappings"),
  issue_policy_ids: z.string().optional().describe("Comma-separated issue policy UUIDs"),
  scan_policy_ids: z.string().optional().describe("Comma-separated scan policy UUIDs"),
};

export const bulkImportGroupsTool: ToolDefinition<typeof schema> = {
  name: "bulk_import_groups",
  description:
    "Initiate a bulk group and repository import job. Imports SCM groups and their repositories in bulk and returns the job status URL.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    scm_provider,
    scm_pat,
    scm_email,
    automatic_mapping,
    repository_selections,
    issue_policy_ids,
    scan_policy_ids,
  }) => {
    try {
      const parsedRepositorySelections = JSON.parse(repository_selections);
      const issuePolicyIds = issue_policy_ids
        ? issue_policy_ids.split(",").map((s) => s.trim())
        : undefined;
      const scanPolicyIds = scan_policy_ids
        ? scan_policy_ids.split(",").map((s) => s.trim())
        : undefined;
      const policySettings = issuePolicyIds || scanPolicyIds
        ? { issuePolicyIds, scanPolicyIds }
        : undefined;
      const result = await bulkImportGroups({
        scmProvider: scm_provider,
        scmPat: scm_pat,
        scmEmail: scm_email,
        automaticMapping: automatic_mapping,
        repositorySelections: parsedRepositorySelections,
        policySettings,
      });
      return jsonResponse(result);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
