import { z } from "zod";
import { createTestArtifact } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  file_name: z.string().describe("File name including extension"),
  file_hash: z.string().describe(
    "Base64-encoded MD5 hash of the file (e.g., using gsutil hash -m)",
  ),
  file_size: z.string().describe("File size in bytes"),
  entitlement_id: z.string().optional().describe(
    "Entitlement ID (not required for CI use case)",
  ),
  assessment_type: z.string().optional().describe(
    "Assessment type (required for CI use case only)",
  ),
  artifact_type: z.string().describe(
    "Artifact type: SOURCE_CODE, TOOL_CAPTURE, CLI_LOG, CLI_ERROR, or THIRD_PARTY_RESULTS",
  ),
  created_at: z.string().optional().describe(
    "Created datetime in ISO 8601 format",
  ),
};

export const createTestArtifactTool: ToolDefinition<typeof schema> = {
  name: "create_test_artifact",
  description:
    "Create a test artifact metadata entry and get a signed upload URL. Does not upload file contents - returns signedUrl for subsequent PUT upload.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    file_name,
    file_hash,
    file_size,
    entitlement_id,
    assessment_type,
    artifact_type,
    created_at,
  }) => {
    const response = await createTestArtifact({
      fileName: file_name,
      fileHash: file_hash,
      fileSize: file_size,
      entitlementId: entitlement_id,
      assessmentType: assessment_type,
      artifactType: artifact_type,
      createdAt: created_at,
    });
    return jsonResponse(response);
  },
};
