import { z } from "zod";
import { getTests } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().optional().describe("Project ID to filter tests"),
  branch_id: z.string().optional().describe("Branch ID to filter tests"),
  status: z.string().optional().describe("Test status filter (e.g., completed, running, failed)"),
  filter: z.string().optional().describe("RSQL filter expression"),
};

export const getTestsTool: ToolDefinition<typeof schema> = {
  name: "get_tests",
  description:
    "List security scan tests (SAST, SCA, DAST). Shows scan history with status, assessment type, and timing information.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ project_id, branch_id, status, filter }) => {
    const tests = await getTests({
      projectId: project_id,
      branchId: branch_id,
      status,
      filter,
    });
    return jsonResponse(tests);
  },
};
