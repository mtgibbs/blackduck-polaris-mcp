import { z } from "zod";
import { getScmRepository } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  repo_id: z.string().describe("SCM repository ID"),
  include: z
    .string()
    .optional()
    .describe("Set to 'defaultBranchName' to include default branch"),
};

export const getScmRepositoryTool: ToolDefinition<typeof schema> = {
  name: "get_scm_repository",
  description:
    "Get a single SCM repository by ID. Optionally include the default branch name by setting include to 'defaultBranchName'.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ repo_id, include }) => {
    const repo = await getScmRepository({ repoId: repo_id, include });
    return jsonResponse(repo);
  },
};
