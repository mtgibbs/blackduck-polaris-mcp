import { z } from "zod";
import { addIssueExportComment } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  issue_id: z.string().describe("Polaris issue ID linked to an external bug tracking ticket"),
  comment: z.string().describe("Comment text to add to the linked external ticket"),
};

export const addIssueExportCommentTool: ToolDefinition<typeof schema> = {
  name: "add_issue_export_comment",
  description:
    "Add a comment to a linked issue in the external bug tracking system (Jira/Azure DevOps) " +
    "via the Polaris integration.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ config_id, issue_id, comment }) => {
    const result = await addIssueExportComment({
      configurationId: config_id,
      issueId: issue_id,
      comment,
    });
    return jsonResponse(result);
  },
};
