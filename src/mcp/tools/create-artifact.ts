import { z } from "zod";
import { createArtifact } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  file_name: z.string().describe("Name of the artifact file"),
  file_hash: z.string().describe("Hash of the artifact file contents"),
  file_size: z.string().describe("Size of the artifact file in bytes"),
  artifact_type: z.string().describe("Type of artifact"),
};

export const createArtifactTool: ToolDefinition<typeof schema> = {
  name: "create_artifact",
  description:
    "Create an artifact for an application. Returns a signedUrl for uploading file contents.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async (
    { portfolio_id, application_id, file_name, file_hash, file_size, artifact_type },
  ) => {
    const artifact = await createArtifact({
      portfolioId: portfolio_id,
      applicationId: application_id,
      fileName: file_name,
      fileHash: file_hash,
      fileSize: file_size,
      artifactType: artifact_type,
    });
    return jsonResponse(artifact);
  },
};
