import { z } from "zod";
import { getSubscriptionMetrics } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z.string().optional().describe(
    'RSQL filter expression, e.g. subscriptionId=="d381106b-6232-4035-ab48-5fcda471f265". Currently only subscriptionId filter key is supported.',
  ),
};

export const getSubscriptionMetricsTool: ToolDefinition<typeof schema> = {
  name: "get_subscription_metrics",
  description:
    "Fetch test metrics grouped per subscription with optional RSQL filter. Currently only supports filtering by subscriptionId.",
  schema,
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  handler: async ({ filter }) => {
    const metrics = await getSubscriptionMetrics({ filter });
    return jsonResponse(metrics);
  },
};
