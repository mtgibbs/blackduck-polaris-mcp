import { z } from "zod";
import { getIssueCount } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope the count (mutually exclusive with project_id)"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope the count (mutually exclusive with application_id)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filter: z
    .string()
    .optional()
    .describe("RSQL filter for issues. Example: occurrence:severity=in=('critical','high')"),
  group: z
    .string()
    .optional()
    .describe(
      "Comma-separated fields to group by. Example: occurrence:severity or occurrence:severity,context:tool-type",
    ),
  include_average_age: z
    .boolean()
    .optional()
    .describe("Include the averageAgeInDays for each group in the response"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of count groups to return (default: 100, max: 500)"),
};

export const getIssueCountTool: ToolDefinition<typeof schema> = {
  name: "get_issue_count",
  description:
    "Get aggregated issue counts for a project or application, optionally grouped by fields like severity, tool-type, or status. Returns count per group with optional average age in days. Useful for dashboards and metrics.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    application_id,
    project_id,
    branch_id,
    test_id,
    filter,
    group,
    include_average_age,
    max_results,
  }) => {
    const counts = await getIssueCount({
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      filter,
      group: group?.split(",").map((g: string) => g.trim()),
      includeAverageAge: include_average_age,
      first: max_results,
    });
    return jsonResponse(counts);
  },
};
