import { z } from "zod";
import { getLastRunTests } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  assessment_type: z.enum(["SAST", "SCA", "DAST", "EXTERNAL_ANALYSIS"])
    .describe(
      "Assessment type to filter for. One of: SAST, SCA, DAST, EXTERNAL_ANALYSIS.",
    ),
  project_id: z.string().describe(
    "Project ID to filter for. Required for all assessment types.",
  ),
  branch_id: z.string().optional().describe(
    "Branch ID to filter for. Required for SAST, SCA, and EXTERNAL_ANALYSIS assessment types.",
  ),
  profile_id: z.string().optional().describe(
    "Profile ID to filter for. Required for DAST assessment type.",
  ),
};

export const getLastRunTestsTool: ToolDefinition<typeof schema> = {
  name: "get_last_run_tests",
  description:
    "Retrieve the most recent completed test(s) for a specified assessment type and project. Returns one entry per tool type. branchId is required for SAST, SCA, and EXTERNAL_ANALYSIS; profileId is required for DAST.",
  schema,
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  handler: async ({ assessment_type, project_id, branch_id, profile_id }) => {
    const tests = await getLastRunTests({
      assessmentType: assessment_type,
      projectId: project_id,
      branchId: branch_id,
      profileId: profile_id,
    });
    return jsonResponse(tests);
  },
};
