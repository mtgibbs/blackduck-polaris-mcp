import { z } from "zod";
import { createScmTestSettings } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  scope: z
    .enum(["organization", "application", "project", "branch"])
    .describe("Scope level for test settings"),
  scope_id: z
    .string()
    .describe("UUID of the scope resource (org ID, app ID, project ID, or branch ID)"),
  pull_request_merged_default: z
    .boolean()
    .optional()
    .describe("Trigger test when PR merged on default branch"),
  assessment_types_default: z
    .string()
    .optional()
    .describe("Comma-separated assessment types for default branch, e.g. SAST,SCA"),
  pull_request_merged_non_default: z
    .boolean()
    .optional()
    .describe("Trigger test when PR merged on non-default branch"),
  assessment_types_non_default: z
    .string()
    .optional()
    .describe("Comma-separated assessment types for non-default branches"),
};

export const createScmTestSettingsTool: ToolDefinition<typeof schema> = {
  name: "create_scm_test_settings",
  description:
    "Create test automation synchronization settings at organization, application, project, or branch scope level.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    scope,
    scope_id,
    pull_request_merged_default,
    assessment_types_default,
    pull_request_merged_non_default,
    assessment_types_non_default,
  }) => {
    try {
      const assessmentTypesDefault = assessment_types_default
        ? assessment_types_default.split(",").map((s) => s.trim())
        : undefined;
      const assessmentTypesNonDefault = assessment_types_non_default
        ? assessment_types_non_default.split(",").map((s) => s.trim())
        : undefined;
      await createScmTestSettings({
        scope,
        scopeId: scope_id,
        pullRequestMergedDefault: pull_request_merged_default,
        assessmentTypesDefault,
        pullRequestMergedNonDefault: pull_request_merged_non_default,
        assessmentTypesNonDefault,
      });
      return jsonResponse({ success: true });
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
