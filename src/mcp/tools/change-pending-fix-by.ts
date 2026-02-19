import { z } from "zod";
import { changePendingFixBy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().describe("Project ID (required) — scopes the pending fix-by approval"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  ids: z
    .array(z.string())
    .describe("Array of issueFamilyId values to approve or reject the pending fix-by change for"),
  action: z
    .enum(["approved", "rejected"])
    .describe("Whether to approve or reject the pending fix-by date changes"),
  comment: z.string().optional().describe("Optional comment to attach to the approval decision"),
};

export const changePendingFixByTool: ToolDefinition<typeof schema> = {
  name: "change_pending_fix_by",
  description:
    "Approve or reject pending fix-by date changes for one or more issues. Requires a projectId and an array of issueFamilyIds. Returns 204 on success.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ project_id, branch_id, ids, action, comment }) => {
    await changePendingFixBy({
      projectId: project_id,
      branchId: branch_id,
      ids,
      action,
      comment,
    });
    return jsonResponse({ success: true, action, count: ids.length });
  },
};
