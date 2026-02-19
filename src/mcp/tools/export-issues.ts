import { z } from "zod";
import { exportIssue } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z
    .string()
    .describe("Bug tracking configuration ID (from get_bug_tracking_configurations)"),
  project_mapping_id: z
    .string()
    .describe("Project mapping ID that links a Polaris project to an external BTS project"),
  issue_id: z
    .string()
    .describe("Polaris issue family ID to export"),
  bts_issue_type_id: z
    .string()
    .optional()
    .describe(
      "BTS issue type ID (required when creating a new ticket, from get_external_projects)",
    ),
  bts_key: z
    .string()
    .optional()
    .describe(
      "Existing external ticket key to link to instead of creating a new ticket (e.g. 'PT-123')",
    ),
  branch_id: z
    .string()
    .optional()
    .describe("Polaris branch ID"),
};

export const exportIssuesTool: ToolDefinition<typeof schema> = {
  name: "export_issues",
  description:
    "Export a Polaris security issue to an external bug tracking system (Jira/Azure DevOps). Creates a new ticket or links to an existing one. Provide bts_issue_type_id to create a new ticket, or bts_key to link to an existing ticket.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    config_id,
    project_mapping_id,
    issue_id,
    bts_issue_type_id,
    bts_key,
    branch_id,
  }) => {
    const result = await exportIssue({
      configurationId: config_id,
      projectMappingId: project_mapping_id,
      issueFamilyId: issue_id,
      btsIssueTypeId: bts_issue_type_id,
      btsKey: bts_key,
      branchId: branch_id,
    });
    return jsonResponse(result);
  },
};
