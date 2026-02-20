import { z } from "zod";
import { deleteApplication } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  application_id: z.string().describe("Application ID to delete"),
};

export const deleteApplicationTool: ToolDefinition<typeof schema> = {
  name: "delete_application",
  description: "Delete an application from a portfolio.",
  schema,
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id }) => {
    await deleteApplication({
      portfolioId: portfolio_id,
      applicationId: application_id,
    });
    return jsonResponse({ success: true });
  },
};
