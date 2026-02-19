import { z } from "zod";
import { getScmRepositories } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter. Supported keys: repositoryId, projectId. Operator: =in= only"),
};

export const getScmRepositoriesTool: ToolDefinition<typeof schema> = {
  name: "get_scm_repositories",
  description:
    "List SCM repositories integrated with Polaris. Supports filtering by repositoryId or projectId.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    const repos = await getScmRepositories({ filter });
    return jsonResponse(repos);
  },
};
