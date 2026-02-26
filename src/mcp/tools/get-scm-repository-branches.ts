import { z } from "zod";
import { getScmRepositoryBranches } from "../../services/index.ts";
import { summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  repo_id: z.string().describe("SCM repository ID"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getScmRepositoryBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_scm_repository_branches",
  description: "List all branches for a given SCM repository.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ summary = true, repo_id }) => {
    const branches = await getScmRepositoryBranches({ repoId: repo_id });
    if (summary) {
      return jsonResponse(
        summarizeResponse(branches, (b) => ({
          name: b.name,
          isDefault: b.isDefault,
        })),
      );
    }
    return jsonResponse(branches);
  },
};
