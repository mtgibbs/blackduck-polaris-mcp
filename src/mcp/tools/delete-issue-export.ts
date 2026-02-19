import { z } from "zod";
import { deleteIssueExport } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  issue_id: z.string().describe("Polaris issue ID to unlink from the external bug tracking system"),
};

export const deleteIssueExportTool: ToolDefinition<typeof schema> = {
  name: "delete_issue_export",
  description:
    "Remove the association between a Polaris issue and its external bug tracking ticket (Jira/Azure DevOps). " +
    "This does not delete the actual ticket in the external system — it only removes the Polaris-side link.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ config_id, issue_id }) => {
    await deleteIssueExport({ configurationId: config_id, issueId: issue_id });
    return jsonResponse({ success: true });
  },
};
