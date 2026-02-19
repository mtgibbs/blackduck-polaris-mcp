import { z } from "zod";
import { resetComponentVersion } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("The component version identifier to reset"),
  project_id: z.string().describe("Project ID (required)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  comment: z.string().optional().describe("Comment for the reset operation"),
};

export const resetComponentVersionTool: ToolDefinition<typeof schema> = {
  name: "reset_component_version",
  description:
    "Reset a component version to its default value after it has been manually modified. The version does not reset until the next scan of the branch.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ id, project_id, branch_id, comment }) => {
    await resetComponentVersion({
      id,
      projectId: project_id,
      branchId: branch_id,
      comment,
    });
    return jsonResponse({ success: true });
  },
};
