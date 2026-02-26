import { z } from "zod";
import { getScmRepositories } from "../../services/index.ts";
import { summarizeResponse, summarizeScmRepository } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter. Supported keys: repositoryId, projectId. Operator: =in= only"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getScmRepositoriesTool: ToolDefinition<typeof schema> = {
  name: "get_scm_repositories",
  description:
    "List SCM repositories integrated with Polaris. Supports filtering by repositoryId or projectId.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ summary = true, filter }) => {
    const repos = await getScmRepositories({ filter });
    if (summary) {
      return jsonResponse(summarizeResponse(repos, summarizeScmRepository));
    }
    return jsonResponse(repos);
  },
};
