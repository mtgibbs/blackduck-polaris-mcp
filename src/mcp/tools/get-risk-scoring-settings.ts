import { z } from "zod";
import { getRiskScoringSettings } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  _placeholder: z.string().optional().describe("No parameters required"),
};

export const getRiskScoringSettingsTool: ToolDefinition<typeof schema> = {
  name: "get_risk_scoring_settings",
  description: "Get the organization risk scoring settings including risk factors and categories.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async () => {
    try {
      const settings = await getRiskScoringSettings();
      return jsonResponse(settings);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
