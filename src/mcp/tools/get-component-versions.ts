import { z } from "zod";
import { getComponentVersions } from "../../services/index.ts";
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
};

export const getComponentVersionsTool: ToolDefinition<typeof schema> = {
  name: "get_component_versions",
  description:
    "List component versions (SCA open-source components) for a project or application. Returns version, security risk, match types, match score, usages, and optionally component info and license definitions.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    project_id,
    application_id,
    branch_id,
    test_id,
    filter,
    include_component,
    include_license,
    max_results,
  }) => {
    const versions = await getComponentVersions({
      projectId: project_id,
      applicationId: application_id,
      branchId: branch_id,
      testId: test_id,
      filter,
      includeComponent: include_component,
      includeLicense: include_license,
      first: max_results,
    });
    return jsonResponse(versions);
  },
};
