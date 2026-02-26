import { z } from "zod";
import { updatePolicySettings } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  policy_id: z
    .string()
    .describe("The ID of the policy to set as default"),
  default_policy_status: z
    .boolean()
    .describe("Whether this policy should be the default (true = default)"),
};

export const updatePolicySettingsTool: ToolDefinition<typeof schema> = {
  name: "update_policy_settings",
  description:
    "Set a policy as the default policy in Polaris. POSTs to /api/policies/policy-settings. " +
    "IMPORTANT: Setting a new default policy will NOT reassign it to existing projects — " +
    "it only applies to newly created projects going forward.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ policy_id, default_policy_status }) => {
    await updatePolicySettings({
      policyId: policy_id,
      defaultPolicyStatus: default_policy_status,
    });
    return jsonResponse({
      success: true,
      message: `Policy ${policy_id} default status set to ${default_policy_status}`,
    });
  },
};
