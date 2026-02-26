import { z } from "zod";
import { getTestSchedulingPolicy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  policy_id: z.string().describe("Test scheduling policy ID"),
};

export const getTestSchedulingPolicyTool: ToolDefinition<typeof schema> = {
  name: "get_test_scheduling_policy",
  description:
    "Get a single test scheduling policy by ID from Polaris. Returns the full policy details including scheduleGroups with rules specifying frequency (daily/weekly).",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ policy_id }) => {
    const policy = await getTestSchedulingPolicy(policy_id);
    return jsonResponse(policy);
  },
};
