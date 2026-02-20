import { z } from "zod";
import { getTestArtifacts } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  test_id: z.string().describe("Test ID to fetch artifact metadata for"),
};

export const getTestArtifactsTool: ToolDefinition<typeof schema> = {
  name: "get_test_artifacts",
  description: "List artifact metadata for a test. Note: Only SCREENSHOT artifact type is listed.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ test_id }) => {
    const artifacts = await getTestArtifacts({ testId: test_id });
    return jsonResponse(artifacts);
  },
};
