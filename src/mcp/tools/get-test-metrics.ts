import { z } from "zod";
import { getTestMetrics } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  test_id: z.string().describe("Test ID to get metrics for"),
};

export const getTestMetricsTool: ToolDefinition<typeof schema> = {
  name: "get_test_metrics",
  description:
    "Get issue count metrics for a specific scan test, broken down by severity (critical, high, medium, low).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ test_id }) => {
    const metrics = await getTestMetrics(test_id);
    return jsonResponse(metrics);
  },
};
