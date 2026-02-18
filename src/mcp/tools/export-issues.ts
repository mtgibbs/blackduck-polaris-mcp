import { z } from "zod";
import { exportIssues } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z
    .string()
    .describe("Bug tracking configuration ID (from get_bug_tracking_configurations)"),
  project_id: z
    .string()
    .describe("Polaris project ID the issues belong to"),
  issue_ids: z
    .array(z.string())
    .describe("Array of Polaris issue IDs to export"),
  branch_id: z
    .string()
    .optional()
    .describe("Polaris branch ID (defaults to default branch)"),
  external_project_key: z
    .string()
    .optional()
    .describe("External project key in Jira/Azure DevOps (from get_external_projects)"),
  external_issue_type_id: z
    .string()
    .optional()
    .describe("External issue type ID in Jira/Azure DevOps"),
  external_ticket_id: z
    .string()
    .optional()
    .describe(
      "Existing external ticket ID to link to instead of creating a new ticket (link mode)",
    ),
};

export const exportIssuesTool: ToolDefinition<typeof schema> = {
  name: "export_issues",
  description:
    "Export Polaris security issues to an external bug tracking system (Jira/Azure DevOps). Creates new tickets or links to existing ones. When external_ticket_id is provided, links issues to that ticket instead of creating new ones.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    config_id,
    project_id,
    issue_ids,
    branch_id,
    external_project_key,
    external_issue_type_id,
    external_ticket_id,
  }) => {
    const results = await exportIssues({
      configurationId: config_id,
      projectId: project_id,
      issueIds: issue_ids,
      branchId: branch_id,
      externalProjectKey: external_project_key,
      externalIssueTypeId: external_issue_type_id,
      externalTicketId: external_ticket_id,
    });
    return jsonResponse(results);
  },
};
