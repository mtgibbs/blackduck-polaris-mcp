import { z } from "zod";
import { getVersionMapping } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter string to filter version mappings (e.g., type==sast, version==2022.3.0)",
    ),
};

export const getVersionMappingTool: ToolDefinition<typeof schema> = {
  name: "get_version_mapping",
  description:
    "Get tool version mappings showing which scanner tools are mapped to which analysis engine versions.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    const mappings = await getVersionMapping({ filter });
    return jsonResponse(mappings);
  },
};
