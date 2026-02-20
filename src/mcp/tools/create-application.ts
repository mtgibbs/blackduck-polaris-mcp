import { z } from "zod";
import { createApplication } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  name: z.string().describe("Name of the application to create"),
  description: z.string().optional().describe("Optional description for the application"),
};

export const createApplicationTool: ToolDefinition<typeof schema> = {
  name: "create_application",
  description: "Create a new application in a portfolio.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ portfolio_id, name, description }) => {
    const app = await createApplication({
      portfolioId: portfolio_id,
      name,
      description,
    });
    return jsonResponse(app);
  },
};
