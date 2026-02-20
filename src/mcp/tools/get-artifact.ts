import { z } from "zod";
import { getArtifact } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  artifact_id: z.string().describe("Artifact ID"),
};

export const getArtifactTool: ToolDefinition<typeof schema> = {
  name: "get_artifact",
  description: "Get an artifact by ID for an application.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, artifact_id }) => {
    const artifact = await getArtifact({
      portfolioId: portfolio_id,
      applicationId: application_id,
      artifactId: artifact_id,
    });
    return jsonResponse(artifact);
  },
};
