import { z } from "zod";
import { updateApplication } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  application_id: z.string().describe("Application ID to update"),
  name: z.string().optional().describe("New name for the application"),
  description: z.string().optional().describe("New description for the application"),
};

export const updateApplicationTool: ToolDefinition<typeof schema> = {
  name: "update_application",
  description: "Update an existing application.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, name, description }) => {
    try {
      const app = await updateApplication({
        portfolioId: portfolio_id,
        applicationId: application_id,
        name,
        description,
      });
      return jsonResponse(app);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
