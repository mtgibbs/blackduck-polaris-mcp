import { z } from "zod";
import { getApplication } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  application_id: z.string().describe("Application ID"),
};

export const getApplicationTool: ToolDefinition<typeof schema> = {
  name: "get_application",
  description: "Get a single application by ID.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id }) => {
    try {
      const app = await getApplication({
        portfolioId: portfolio_id,
        applicationId: application_id,
      });
      return jsonResponse(app);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
