import { z } from "zod";
import { getComponentVersion } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("The component version identifier"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope the query (mutually exclusive with application_id)"),
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope the query (mutually exclusive with project_id)"),
  include_component: z
    .boolean()
    .optional()
    .describe("Include component information (name, description, homePage, openHubPage)"),
  include_license: z
    .boolean()
    .optional()
    .describe("Include license definition information"),
};

export const getComponentVersionTool: ToolDefinition<typeof schema> = {
  name: "get_component_version",
  description:
    "Get a single component version by ID from the Polaris Findings API. Returns version details including security risk, match types, match score, usages, and optionally component info and license definitions.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id, project_id, application_id, include_component, include_license }) => {
    const version = await getComponentVersion({
      id,
      projectId: project_id,
      applicationId: application_id,
      includeComponent: include_component,
      includeLicense: include_license,
    });
    return jsonResponse(version);
  },
};
