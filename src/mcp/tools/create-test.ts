import { z } from "zod";
import { createTest } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().describe("Project ID (required)"),
  branch_id: z.string().optional().describe("Branch ID (optional)"),
  assessment_types: z.array(z.string()).describe(
    "Assessment types: SAST, SCA, DAST, or EXTERNAL_ANALYSIS (required array)",
  ),
  test_mode: z.string().optional().describe(
    "Test mode: SOURCE_UPLOAD, SCM, CI, DAST_WEBAPP, DAST_PREFLIGHT, DAST_API, DAST_API_PREFLIGHT, or THIRD_PARTY_RESULT_UPLOAD",
  ),
  scan_mode: z.string().optional().describe(
    "Scan mode: CAPTURE_ANALYSIS, ANALYSIS_ONLY, SCANNING_MATCHING, SCA_SIGNATURE, SCA_PACKAGE, DYNAMIC_TEST, DYNAMIC-PREFLIGHT, IMPORT-RESULTS, SAST_FULL_ISSUE_UPLOAD, or SAST_RAPID_ISSUE_UPLOAD",
  ),
  artifacts: z.array(z.string()).optional().describe(
    "Array of artifact IDs (optional)",
  ),
  notes: z.string().optional().describe("Scan notes (optional)"),
  triage: z.string().optional().describe(
    "Triage mode: REQUIRED or OPTIONAL (optional)",
  ),
  profile_details: z.object({
    id: z.string().optional(),
    content: z.string().optional(),
  }).optional().describe("DAST profile details (optional)"),
};

export const createTestTool: ToolDefinition<typeof schema> = {
  name: "create_test",
  description:
    "Create new security scan test(s) in Polaris. Returns 207 Multi-Status with individual test creation results. If multiple assessment types are provided, a separate test is created for each.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    project_id,
    branch_id,
    assessment_types,
    test_mode,
    scan_mode,
    artifacts,
    notes,
    triage,
    profile_details,
  }) => {
    const response = await createTest({
      projectId: project_id,
      branchId: branch_id,
      assessmentTypes: assessment_types,
      testMode: test_mode,
      scanMode: scan_mode,
      artifacts,
      notes,
      triage,
      profileDetails: profile_details,
    });
    return jsonResponse(response);
  },
};
