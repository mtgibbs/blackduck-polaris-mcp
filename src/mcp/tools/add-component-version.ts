import { z } from "zod";
import { addComponentVersion } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().describe("Project ID to add the component version to (required)"),
  branch_id: z
    .string()
    .optional()
    .describe(
      "Branch ID — when omitted the component version is added to all branches in the project",
    ),
  component_id: z.string().describe("The identifier of the component to add"),
  component_version_id: z.string().describe("The identifier of the component version to add"),
  component_origin_id: z
    .string()
    .optional()
    .describe("The identifier of the component origin to add"),
  comment: z.string().optional().describe("Comment related to this add operation"),
};

export const addComponentVersionTool: ToolDefinition<typeof schema> = {
  name: "add_component_version",
  description:
    "Manually add a component version to a project in the Polaris Findings API. Returns an operationId that can be used with get_operation_status to poll for completion.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    project_id,
    branch_id,
    component_id,
    component_version_id,
    component_origin_id,
    comment,
  }) => {
    const result = await addComponentVersion({
      projectId: project_id,
      branchId: branch_id,
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
