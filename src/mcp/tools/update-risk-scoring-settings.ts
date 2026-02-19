import { z } from "zod";
import { updateRiskScoringSettings } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  is_enabled: z.boolean().describe("Enable or disable risk scoring for the organization"),
  risk_factors: z.string().describe(
    "JSON string of risk factors array. Each factor: { name, weight (1-100), description, defaultCategory (uuid or 0-based index), categories: [{ name, impact (0-10) }] }. Sum of weights must equal 100.",
  ),
};

export const updateRiskScoringSettingsTool: ToolDefinition<typeof schema> = {
  name: "update_risk_scoring_settings",
  description: "Update the organization risk scoring settings.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ is_enabled, risk_factors }) => {
    try {
      const riskFactors = JSON.parse(risk_factors);
      const settings = await updateRiskScoringSettings({
        isEnabled: is_enabled,
        riskFactors,
      });
      return jsonResponse(settings);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
