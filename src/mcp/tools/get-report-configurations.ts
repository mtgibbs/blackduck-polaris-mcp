import { z } from "zod";
import { getReportConfigurations } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression (e.g., name==MyConfig)"),
  sort: z
    .string()
    .optional()
    .describe("Sort expression. Format: field|direction. Example: createdAt|desc"),
  offset: z
    .number()
    .optional()
    .describe("Pagination offset (default: 0)"),
  limit: z
    .number()
    .optional()
    .describe("Number of results to return (default: 25, max: 100)"),
};

export const getReportConfigurationsTool: ToolDefinition<typeof schema> = {
  name: "get_report_configurations",
  description:
    "Get a paginated list of report configurations. Configurations are saved report setups that can be re-run or scheduled. Use filter to search by name or other fields, sort to order results, and offset/limit for pagination.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, sort, offset, limit }) => {
    const configurations = await getReportConfigurations({
      filter,
      sort,
      offset,
      limit,
    });
    return jsonResponse(configurations);
  },
};
