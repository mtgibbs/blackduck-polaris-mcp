import { z } from "zod";
import { testBugTrackingConnection } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z.string().describe("Bug tracking configuration ID"),
};

export const testBugTrackingConnectionTool: ToolDefinition<typeof schema> = {
  name: "test_bug_tracking_connection",
  description:
    "Test the connection to a bug tracking instance for a given configuration in Polaris.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id }) => {
    const result = await testBugTrackingConnection({ id });
    return jsonResponse(result);
  },
};
