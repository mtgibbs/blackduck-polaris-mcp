import { z } from "zod";
import { editComponentVersion } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("The component version identifier to edit"),
  project_id: z.string().describe("Project ID (required)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  apply_on_project_level: z
    .boolean()
    .optional()
    .describe("When true, apply the edit to all branches in the project"),
  component_id: z.string().optional().describe("The new component identifier"),
  component_version_id: z.string().optional().describe("The new component version identifier"),
  component_origin_id: z.string().optional().describe("The new component origin identifier"),
  comment: z.string().optional().describe("Comment related to this edit operation"),
};

export const editComponentVersionTool: ToolDefinition<typeof schema> = {
  name: "edit_component_version",
  description:
    "Change a component version in a project in the Polaris Findings API. Returns an operationId that can be used with get_operation_status to poll for completion.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    id,
    project_id,
    branch_id,
    apply_on_project_level,
    component_id,
    component_version_id,
    component_origin_id,
    comment,
  }) => {
    const result = await editComponentVersion({
      id,
      projectId: project_id,
      branchId: branch_id,
      applyOnProjectLevel: apply_on_project_level,
      body: {
        componentId: component_id,
        componentVersionId: component_version_id,
        componentOriginId: component_origin_id,
        comment,
      },
    });
    return jsonResponse(result);
  },
};
