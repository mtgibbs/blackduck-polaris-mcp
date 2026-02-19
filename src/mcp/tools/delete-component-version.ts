import { z } from "zod";
import { deleteComponentVersion } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("The component version identifier to delete"),
  project_id: z.string().describe("Project ID (required)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
};

export const deleteComponentVersionTool: ToolDefinition<typeof schema> = {
  name: "delete_component_version",
  description:
    "Delete a manually added component version from a project. Only manually added component versions can be deleted. Returns an operationId that can be used with get_operation_status to poll for completion.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ id, project_id, branch_id }) => {
    const result = await deleteComponentVersion({
      id,
      projectId: project_id,
      branchId: branch_id,
    });
    return jsonResponse(result);
  },
};
