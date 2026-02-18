import { z } from "zod";
import { getCodeSnippet } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  occurrence_id: z.string().describe("Occurrence ID to get the code snippet for"),
};

export const getCodeSnippetTool: ToolDefinition<typeof schema> = {
  name: "get_code_snippet",
  description:
    "Get the source code snippet for a specific vulnerability occurrence, showing the exact lines of code with the issue highlighted.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ occurrence_id }) => {
    const snippet = await getCodeSnippet(occurrence_id);
    return jsonResponse(snippet);
  },
};
