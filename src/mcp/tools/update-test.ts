import { z } from "zod";
import { updateTest } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  test_id: z.string().describe("Test ID (required)"),
  action: z.enum(["RESUME", "CANCEL", "FAILED"]).describe(
    "Action to perform: RESUME (continue paused test), CANCEL (cancel test), or FAILED (mark test as failed for CI workflows)",
  ),
  artifacts: z.array(z.string()).optional().describe(
    "Array of artifact IDs (mandatory for RESUME action on CI tests with SAST/SCA)",
  ),
  tool_id: z.string().optional().describe(
    "Tool ID (mandatory for RESUME action on CI tests with SAST/SCA)",
  ),
  notes: z.string().optional().describe("Notes about the action (optional)"),
};

export const updateTestTool: ToolDefinition<typeof schema> = {
  name: "update_test",
  description:
    "Update a test to RESUME, CANCEL, or FAILED. RESUME is for tests in WAITING_FOR_CAPTURE state (requires artifacts and toolId for CI workflows). CANCEL works on tests not already COMPLETED/FAILED/CANCELLED. FAILED is for CI workflows in WAITING_FOR_CAPTURE.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ test_id, action, artifacts, tool_id, notes }) => {
    const response = await updateTest({
      testId: test_id,
      action,
      artifacts,
      toolId: tool_id,
      notes,
    });
    return jsonResponse(response);
  },
};
