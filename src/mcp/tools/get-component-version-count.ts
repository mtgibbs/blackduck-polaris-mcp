import { z } from "zod";
import { getComponentVersionCount } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope the count (mutually exclusive with application_id)"),
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope the count (mutually exclusive with project_id)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter. Example: component-version:security-risk=in=('HIGH','CRITICAL')",
    ),
  group: z
    .string()
    .optional()
    .describe(
      "Comma-separated fields to group by. Example: component-version:security-risk",
    ),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of count groups to return (default: 100)"),
};

export const getComponentVersionCountTool: ToolDefinition<typeof schema> = {
  name: "get_component_version_count",
  description:
    "Get aggregated component version counts for a project or application, optionally grouped by fields like security-risk. Returns count per group. Useful for SCA dashboards and metrics.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    project_id,
    application_id,
    branch_id,
    test_id,
    filter,
    group,
    max_results,
  }) => {
    const counts = await getComponentVersionCount({
      projectId: project_id,
      applicationId: application_id,
      branchId: branch_id,
      testId: test_id,
      filter,
      group: group?.split(",").map((g: string) => g.trim()),
      first: max_results,
    });
    return jsonResponse(counts);
  },
};
