import { z } from "zod";
import { getRemediationAssist } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  occurrence_id: z.string().describe("Occurrence ID to get AI remediation guidance for"),
};

export const getRemediationAssistTool: ToolDefinition<typeof schema> = {
  name: "get_remediation_assist",
  description:
    "Get AI-powered remediation guidance (Polaris Assist) for a specific vulnerability occurrence. Returns an explanation of the issue and suggested fix.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ occurrence_id }) => {
    const assist = await getRemediationAssist(occurrence_id);
    return jsonResponse(assist);
  },
};
