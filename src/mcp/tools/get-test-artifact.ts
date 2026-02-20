import { z } from "zod";
import { getTestArtifact } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  test_id: z.string().describe("Test ID"),
  artifact_id: z.string().describe("Artifact ID to download"),
};

export const getTestArtifactTool: ToolDefinition<typeof schema> = {
  name: "get_test_artifact",
  description:
    "Get artifact download information. Returns download URL for binary artifact (application/octet-stream). Note: Only SCREENSHOT artifact type is supported for download.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ test_id, artifact_id }) => {
    const downloadInfo = await getTestArtifact({
      testId: test_id,
      artifactId: artifact_id,
    });
    return jsonResponse(downloadInfo);
  },
};
