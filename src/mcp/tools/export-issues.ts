import { z } from "zod";
import { exportIssue } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";
import { resolveExportParams } from "../export-helpers.ts";

export const schema = {
  config_id: z
    .string()
    .describe("Bug tracking configuration ID (from get_bug_tracking_configurations)"),
  project_mapping_id: z
    .string()
    .optional()
    .describe(
      "Project mapping ID that links a Polaris project to an external BTS project. If omitted, auto-resolves from project_id.",
    ),
  project_id: z
    .string()
    .optional()
    .describe(
      "Polaris project ID for auto-resolution of project_mapping_id. Either project_mapping_id or project_id must be provided.",
    ),
  issue_id: z
    .string()
    .describe("Polaris issue family ID to export"),
  bts_issue_type_id: z
    .string()
    .optional()
    .describe(
      "BTS issue type ID (required when creating a new ticket, from get_external_issue_types). Auto-resolved from project mapping default if omitted.",
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
    .describe("Polaris branch ID. If omitted, the project default branch is used."),
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
    project_id,
    issue_id,
    bts_issue_type_id,
    bts_key,
    branch_id,
  }) => {
    // Validate that either project_mapping_id or project_id is provided
    if (!project_mapping_id && !project_id) {
      return errorResponse(
        "Either project_mapping_id or project_id must be provided. " +
          "Use get_config_project_mappings to find project_mapping_id for your project.",
      );
    }

    // Auto-resolve project_mapping_id and bts_issue_type_id if needed
    let resolvedProjectMappingId = project_mapping_id;
    let resolvedBtsIssueTypeId = bts_issue_type_id;

    if (!project_mapping_id && project_id) {
      const resolution = await resolveExportParams(
        config_id,
        project_id,
        bts_issue_type_id,
      );

      if ("error" in resolution) {
        return errorResponse(resolution.error);
      }

      resolvedProjectMappingId = resolution.projectMappingId;
      resolvedBtsIssueTypeId = resolution.issueTypeId;
    }

    // Validate that bts_issue_type_id is present when creating a new ticket (no bts_key)
    // This validation happens AFTER auto-resolution to catch cases where resolution didn't provide an issue type
    if (!bts_key && !resolvedBtsIssueTypeId) {
      return errorResponse(
        "bts_issue_type_id is required when creating a new ticket (bts_key not provided). " +
          "Use get_external_issue_types to find available issue types for your bug tracking system.",
      );
    }

    const result = await exportIssue({
      configurationId: config_id,
      projectMappingId: resolvedProjectMappingId!,
      issueFamilyId: issue_id,
      btsIssueTypeId: resolvedBtsIssueTypeId,
      btsKey: bts_key,
      branchId: branch_id,
    });
    return jsonResponse(result);
  },
};
