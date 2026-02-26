import { z } from "zod";
import { getReports } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression (e.g., status==COMPLETED)"),
  sort: z
    .string()
    .optional()
    .describe("Sort expression. Format: field|direction. Example: startDate|desc"),
  offset: z
    .number()
    .optional()
    .describe("Pagination offset (default: 0)"),
  limit: z
    .number()
    .optional()
    .describe("Number of results to return (default: 25, max: 100)"),
};

export const getReportsTool: ToolDefinition<typeof schema> = {
  name: "get_reports",
  description:
    "Get a paginated list of reports. Returns report history including status, type, dates, and links. Use filter to query by status (e.g., status==COMPLETED), sort to order results (e.g., startDate|desc), and offset/limit for pagination.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, sort, offset, limit }) => {
    const reports = await getReports({ filter, sort, offset, limit });
    return jsonResponse(reports);
  },
};
