import { z } from "zod";
import { getDownloadDescriptor } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z
    .string()
    .describe(
      "Download descriptor ID in name:version:platform:extension format (e.g. cov_thin_client:2022.3.0:win64:tar.gz)",
    ),
};

export const getDownloadDescriptorTool: ToolDefinition<typeof schema> = {
  name: "get_download_descriptor",
  description:
    "Get a signed download URL for a Polaris tool binary. The ID format is name:version:platform:extension (e.g. cov_thin_client:2022.3.0:win64:tar.gz). Returns the signed URL, filename, hash, and expiry information.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id }) => {
    const descriptor = await getDownloadDescriptor({ id });
    return jsonResponse(descriptor);
  },
};
