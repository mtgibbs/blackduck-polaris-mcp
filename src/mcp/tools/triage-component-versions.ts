import { z } from "zod";
import { triageComponentVersions } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope triage (mutually exclusive with application_id)"),
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope triage (mutually exclusive with project_id)"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter for component versions to triage. Example: component-version:id=in=('id1','id2') or triageProperties:ignored==true",
    ),
  triage_properties: z
    .array(
      z.object({
        key: z.enum(["comment", "ignored"]).describe("Triage attribute key"),
        value: z
          .union([z.string(), z.boolean()])
          .describe("Triage attribute value (string for comment, boolean for ignored)"),
      }),
    )
    .describe("Array of triage properties to set. Valid keys: comment, ignored"),
};

export const triageComponentVersionsTool: ToolDefinition<typeof schema> = {
  name: "triage_component_versions",
  description:
    "Bulk triage component versions matching a filter within an application or project. Sets triage properties such as ignored (boolean) or comment (string). Returns the count of triaged component versions.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ project_id, application_id, filter, triage_properties }) => {
    if (!application_id && !project_id) {
      return errorResponse("Either application_id or project_id must be provided");
    }
    if (application_id && project_id) {
      return errorResponse("application_id and project_id are mutually exclusive");
    }

    const result = await triageComponentVersions({
      projectId: project_id,
      applicationId: application_id,
      filter,
      triageProperties: triage_properties,
    });
    return jsonResponse(result);
  },
};
