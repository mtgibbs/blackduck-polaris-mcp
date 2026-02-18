import { z } from "zod";
import { getOccurrences } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().describe("Project ID"),
  issue_id: z.string().optional().describe("Issue ID to get occurrences for"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter expression. Example fields: occurrence:severity, occurrence:cwe, occurrence:filename, context:tool-type, type:name",
    ),
  sort: z
    .string()
    .optional()
    .describe("Sort expression. Format: field|direction"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of occurrences to return (default: 100, max: 500)"),
};

export const getOccurrencesTool: ToolDefinition<typeof schema> = {
  name: "get_occurrences",
  description:
    "Get individual occurrences (specific instances) of security issues. Each occurrence represents a finding at a specific location. Properties include file path, line number, severity, CWE, and more. Filter by issue_id to see all locations of a specific issue.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ project_id, issue_id, branch_id, test_id, filter, sort, max_results }) => {
    const occurrences = await getOccurrences({
      projectId: project_id,
      issueId: issue_id,
      branchId: branch_id,
      testId: test_id,
      filter,
      sort,
      first: max_results,
    });
    return jsonResponse(occurrences);
  },
};
