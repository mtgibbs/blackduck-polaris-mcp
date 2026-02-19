import { z } from "zod";
import { getIssueCountOverTime } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope the query (mutually exclusive with project_id)"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope the query (mutually exclusive with application_id)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  last_x_days: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe(
      "Number of days until today for which to count issues. Mutually exclusive with from_date and to_date.",
    ),
  from_date: z
    .string()
    .optional()
    .describe(
      "Start date (ISO 8601) from which to count issues. Mutually exclusive with last_x_days. Example: 2021-09-25T16:20:24.345Z",
    ),
  to_date: z
    .string()
    .optional()
    .describe(
      "End date (ISO 8601) until which to count issues. Mutually exclusive with last_x_days. Example: 2021-09-25T16:20:24.345Z",
    ),
};

export const getIssueCountOverTimeTool: ToolDefinition<typeof schema> = {
  name: "get_issue_count_over_time",
  description:
    "Get detected and absent issue counts over a period of time for a project or application. Returns a time series of detected/absent counts grouped by tool type and date. Useful for trend analysis and security dashboards.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    application_id,
    project_id,
    branch_id,
    last_x_days,
    from_date,
    to_date,
  }) => {
    if (!application_id && !project_id) {
      return errorResponse("Either application_id or project_id must be provided");
    }
    if (last_x_days !== undefined && (from_date || to_date)) {
      return errorResponse("last_x_days is mutually exclusive with from_date and to_date");
    }
    const result = await getIssueCountOverTime({
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      lastXDays: last_x_days,
      fromDate: from_date,
      toDate: to_date,
    });
    return jsonResponse(result);
  },
};
