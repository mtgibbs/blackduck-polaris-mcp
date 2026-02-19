import { z } from "zod";
import { getComponentVersionActivityLog } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("The component version identifier"),
  project_id: z.string().describe("Project ID (required for activity log)"),
  first: z.number().optional().describe("Maximum number of activity log entries to return"),
};

export const getComponentVersionActivityLogTool: ToolDefinition<typeof schema> = {
  name: "get_component_version_activity_log",
  description:
    "Get the activity log for a component version showing ADD, EDIT, and RESET operations performed on it within a project.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id, project_id, first }) => {
    const entries = await getComponentVersionActivityLog({
      id,
      projectId: project_id,
      first,
    });
    return jsonResponse(entries);
  },
};
