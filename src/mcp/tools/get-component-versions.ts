import { z } from "zod";
import { getComponentVersions } from "../../services/index.ts";
import { summarizeComponentVersion, summarizeResponse } from "../summarize.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope the query (mutually exclusive with application_id)"),
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope the query (mutually exclusive with project_id)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter. Example: component-version:security-risk=in=('HIGH','CRITICAL')",
    ),
  include_component: z
    .boolean()
    .optional()
    .describe("Include component information (name, description, homePage, openHubPage)"),
  include_license: z
    .boolean()
    .optional()
    .describe("Include license definition information"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of component versions to return (default: 100)"),
  summary: z.boolean().optional().describe(
    "Return summarized results with only essential fields. Default: true. Set to false for full API response.",
  ),
};

export const getComponentVersionsTool: ToolDefinition<typeof schema> = {
  name: "get_component_versions",
  description:
    "List component versions (SCA open-source components) for a project or application. Returns version, security risk, match types, match score, usages, and optionally component info and license definitions.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (args) => {
    const { summary = true, ...rest } = args;
    const versions = await getComponentVersions({
      projectId: rest.project_id,
      applicationId: rest.application_id,
      branchId: rest.branch_id,
      testId: rest.test_id,
      filter: rest.filter,
      includeComponent: rest.include_component,
      includeLicense: rest.include_license,
      first: rest.max_results,
    });
    if (summary) {
      return jsonResponse(
        summarizeResponse(versions, summarizeComponentVersion),
      );
    }
    return jsonResponse(versions);
  },
};
