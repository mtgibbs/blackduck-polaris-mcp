import { z } from "zod";
import { getPrPolicy } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  policy_id: z.string().describe("PR policy ID"),
};

export const getPrPolicyTool: ToolDefinition<typeof schema> = {
  name: "get_pr_policy",
  description:
    "Get a single PR policy by ID from Polaris. Returns the full policy details including rules with criteriaQuery and actions.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ policy_id }) => {
    const policy = await getPrPolicy(policy_id);
    return jsonResponse(policy);
  },
};
