import { z } from "zod";
import { getScmProviderProjects } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  group_name: z.string().describe("Group or organization name"),
  scm_pat: z.string().describe("Personal Access Token for SCM provider"),
  scm_provider: z.string().optional().describe("SCM provider enum value (Azure DevOps only)"),
};

export const getScmProjectsTool: ToolDefinition<typeof schema> = {
  name: "get_scm_projects",
  description:
    "List projects within a group from an SCM provider. Used for Azure DevOps to list projects within an organization.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ group_name, scm_pat, scm_provider }) => {
    const projects = await getScmProviderProjects({
      groupName: group_name,
      scmPat: scm_pat,
      scmProvider: scm_provider,
    });
    return jsonResponse(projects);
  },
};
