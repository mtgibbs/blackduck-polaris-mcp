import { z } from "zod";
import { updateScmGroupSettings } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z.string(),
  import_new_repositories: z.boolean().optional(),
  sync_repos_and_branches: z.boolean().optional(),
  automatically_test_code_changes: z.boolean().optional(),
  import_new_branches: z.boolean().optional(),
  branch_name_expressions: z
    .string()
    .optional()
    .describe("Comma-separated branch name expressions"),
};

export const updateScmGroupSettingsTool: ToolDefinition<typeof schema> = {
  name: "update_scm_group_settings",
  description:
    "Update group sync settings for a given application, controlling repository and branch synchronization behavior.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    application_id,
    import_new_repositories,
    sync_repos_and_branches,
    automatically_test_code_changes,
    import_new_branches,
    branch_name_expressions,
  }) => {
    try {
      const branchNameExpressions = branch_name_expressions
        ? branch_name_expressions.split(",").map((s) => s.trim())
        : undefined;
      await updateScmGroupSettings({
        applicationId: application_id,
        importNewRepositories: import_new_repositories,
        syncReposAndBranches: sync_repos_and_branches,
        automaticallyTestCodeChanges: automatically_test_code_changes,
        importNewBranches: import_new_branches,
        branchNameExpressions,
      });
      return jsonResponse({ success: true });
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
