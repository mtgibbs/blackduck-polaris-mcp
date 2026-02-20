import { z } from "zod";
import { getScmProviderRepositories } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scm_pat: z.string().describe("Personal Access Token for SCM provider"),
  scm_provider: z.string().optional().describe("SCM provider enum value"),
  scm_email: z.string().optional().describe("Required for Bitbucket Cloud"),
  group_name: z.string().optional().describe("Filter by group or organization name"),
  project_name: z.string().optional().describe("Filter by project name (Azure DevOps)"),
  repo_search_term: z.string().optional().describe("Search term to filter repositories by name"),
  include_sub_groups: z
    .boolean()
    .optional()
    .describe("GitLab only: include repos from sub-groups"),
};

export const getScmRemoteReposTool: ToolDefinition<typeof schema> = {
  name: "get_scm_remote_repos",
  description:
    "List repositories from an SCM provider. Requires a PAT. Results can be filtered by group, project, or search term.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    scm_pat,
    scm_provider,
    scm_email,
    group_name,
    project_name,
    repo_search_term,
    include_sub_groups,
  }) => {
    const repos = await getScmProviderRepositories({
      scmPat: scm_pat,
      scmProvider: scm_provider,
      scmEmail: scm_email,
      groupName: group_name,
      projectName: project_name,
      repoSearchTerm: repo_search_term,
      includeSubGroups: include_sub_groups,
    });
    return jsonResponse(repos);
  },
};
