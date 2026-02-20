import { z } from "zod";
import { updateEntitlementQuantity } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  entitlement_ids: z.array(z.string()).describe("Array of entitlement UUIDs"),
  quantity: z.number().describe("Subscription quantity to allocate"),
};

export const updateEntitlementQuantityTool: ToolDefinition<typeof schema> = {
  name: "update_entitlement_quantity",
  description: "Update the quantity allocation for application entitlements.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, entitlement_ids, quantity }) => {
    const result = await updateEntitlementQuantity({
      portfolioId: portfolio_id,
      applicationId: application_id,
      entitlementIds: entitlement_ids,
      quantity,
    });
    return jsonResponse(result);
  },
};
