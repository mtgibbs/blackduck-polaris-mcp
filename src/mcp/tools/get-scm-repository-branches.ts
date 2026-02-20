import { z } from "zod";
import { getScmRepositoryBranches } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  repo_id: z.string().describe("SCM repository ID"),
};

export const getScmRepositoryBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_scm_repository_branches",
  description: "List all branches for a given SCM repository.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ repo_id }) => {
    const branches = await getScmRepositoryBranches({ repoId: repo_id });
    return jsonResponse(branches);
  },
};
