import { z } from "zod";
import { getVersionMatrix } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  id: z
    .string()
    .describe(
      "Tool ID in name:version format (e.g. cov_thin_client:2022.3.0) to get the version compatibility matrix for",
    ),
};

export const getVersionMatrixTool: ToolDefinition<typeof schema> = {
  name: "get_version_matrix",
  description:
    "Get the version compatibility matrix for a specific tool, showing which versions of other tools are compatible.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ id }) => {
    const matrix = await getVersionMatrix({ id });
    return jsonResponse(matrix);
  },
};
