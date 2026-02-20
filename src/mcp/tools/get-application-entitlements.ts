import { z } from "zod";
import { getApplicationEntitlements } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
};

export const getApplicationEntitlementsTool: ToolDefinition<typeof schema> = {
  name: "get_application_entitlements",
  description: "Get entitlements for an application.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id }) => {
    const entitlements = await getApplicationEntitlements({
      portfolioId: portfolio_id,
      applicationId: application_id,
    });
    return jsonResponse(entitlements);
  },
};
