import { z } from "zod";
import { getBranches } from "../../services/index.ts";
import { summarizeBranch, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  filter: z.string().optional().describe(
    "RSQL filter expression for branches. Filterable fields: name, source, labelId, isDefault. Example: name=='main'",
  ),
  sort: z
    .string()
    .optional()
    .describe("Sort expression. Sortable fields: name, source. Format: field|direction"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_branches",
  description: "List branches for a project. Each branch can have its own scan results and issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (args) => {
    const { summary = true, ...rest } = args;
    const branches = await getBranches({
      portfolioId: rest.portfolio_id,
      applicationId: rest.application_id,
      projectId: rest.project_id,
      filter: rest.filter,
      sort: rest.sort,
    });
    if (summary) {
      return jsonResponse(summarizeResponse(branches, summarizeBranch));
    }
    return jsonResponse(branches);
  },
};
