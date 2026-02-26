import { z } from "zod";
import { getOccurrences } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { validateFilter } from "../filter-validation.ts";

export const schema = {
  application_id: z
    .string()
    .optional()
    .describe("Application ID (mutually exclusive with project_id)"),
  project_id: z.string().optional().describe("Project ID (mutually exclusive with application_id)"),
  issue_id: z.string().optional().describe("Issue ID to get occurrences for"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter expression. Valid filter keys (with namespaces): occurrence:issue-id, occurrence:severity, occurrence:cwe, occurrence:filename, occurrence:occurrence-id, occurrence:finding-key::filePath, context:tool-type, type:name. Example: occurrence:severity=in=('critical','high')",
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
    "Get individual occurrences (specific instances) of security issues. Provide exactly one of project_id or application_id (they are mutually exclusive). Each occurrence represents a finding at a specific location. Properties include file path, line number, severity, CWE, and more. Filter by issue_id to see all locations of a specific issue.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    application_id,
    project_id,
    issue_id,
    branch_id,
    test_id,
    filter,
    sort,
    max_results,
  }) => {
    if (!application_id && !project_id) {
      return errorResponse("Either application_id or project_id must be provided");
    }
    if (application_id && project_id) {
      return errorResponse("application_id and project_id are mutually exclusive");
    }

    if (filter) {
      const error = validateFilter(filter, "findings.occurrences");
      if (error) return errorResponse(error);
    }

    const occurrences = await getOccurrences({
      applicationId: application_id,
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
