import { z } from "zod";
import { assignComponentVersionLicense } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("The component version identifier"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID to scope the operation (mutually exclusive with application_id)"),
  application_id: z
    .string()
    .optional()
    .describe("Application ID to scope the operation (mutually exclusive with project_id)"),
  license_type: z
    .enum(["CONJUNCTIVE", "DISJUNCTIVE"])
    .optional()
    .describe("License type for composite license definitions (CONJUNCTIVE or DISJUNCTIVE)"),
  license_hrefs: z
    .array(z.string())
    .optional()
    .describe(
      "Array of license href URLs from the original license definition. For composite licenses, provide multiple hrefs and set license_type.",
    ),
};

export const assignComponentVersionLicenseTool: ToolDefinition<typeof schema> = {
  name: "assign_component_version_license",
  description:
    "Assign a license definition to a component version. Supports single licenses (via license_hrefs with one entry) or composite CONJUNCTIVE/DISJUNCTIVE licenses. The selected license must be present in the original license definition.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ id, project_id, application_id, license_type, license_hrefs }) => {
    const licenseEntries = (license_hrefs ?? []).map((href) => ({
      _links: [{ href, rel: "license", method: "GET" }],
    }));

    const body = license_type && licenseEntries.length > 1
      ? { type: license_type, licenses: licenseEntries }
      : { license: licenseEntries };

    const result = await assignComponentVersionLicense({
      id,
      projectId: project_id,
      applicationId: application_id,
      body,
    });
    return jsonResponse(result);
  },
};
