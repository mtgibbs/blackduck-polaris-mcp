import { z } from "zod";
import { createTest } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z.string().describe(
    "Application ID that owns the project (required). Obtain from get_applications or from the applicationId field in get_projects results.",
  ),
  project_id: z.string().describe("Project ID (required)"),
  branch_id: z.string().optional().describe("Branch ID (optional)"),
  assessment_types: z.array(z.string()).describe(
    "Assessment types: SAST, SCA, DAST, or EXTERNAL_ANALYSIS (required array). Common patterns: generic scan → ['SAST', 'SCA'] (recommended default), static analysis → ['SAST'], dependency scan → ['SCA'], web app scan → ['DAST']",
  ),
  test_mode: z.string().optional().describe(
    "Test mode: SOURCE_UPLOAD, SCM, CI, DAST_WEBAPP, DAST_PREFLIGHT, DAST_API, DAST_API_PREFLIGHT, or THIRD_PARTY_RESULT_UPLOAD. Omit to let Polaris auto-deduce from assessment type.",
  ),
  scan_mode: z.string().optional().describe(
    "Scan mode: CAPTURE_ANALYSIS, ANALYSIS_ONLY, SCANNING_MATCHING, SCA_SIGNATURE, SCA_PACKAGE, DYNAMIC_TEST, DYNAMIC-PREFLIGHT, IMPORT-RESULTS, SAST_FULL_ISSUE_UPLOAD, or SAST_RAPID_ISSUE_UPLOAD. Omit to let Polaris auto-deduce from assessment type.",
  ),
  artifacts: z.array(z.string()).optional().describe(
    "Array of artifact IDs (optional)",
  ),
  notes: z.string().optional().describe("Scan notes (optional)"),
  triage: z.string().optional().describe(
    "Triage mode: REQUIRED or OPTIONAL (optional)",
  ),
  profile_details: z.object({
    id: z.string().optional().describe("DAST profile ID"),
    content: z.string().optional().describe("DAST profile content"),
  }).optional().describe("DAST profile details (optional)"),
};

export const createTestTool: ToolDefinition<typeof schema> = {
  name: "create_test",
  description:
    `Create new security scan test(s) in Polaris. Returns 207 Multi-Status with individual test creation results. If multiple assessment types are provided, a separate test is created for each.

COMMON SCAN PATTERNS:
- Generic "run a scan" request → assessment_types: ['SAST', 'SCA'] (recommended default)
- "Static analysis" or "code analysis" → assessment_types: ['SAST']
- "Dependency scan" or "component scan" → assessment_types: ['SCA']
- "Web app scan" or "DAST scan" → assessment_types: ['DAST']

Valid assessment type / test mode / scan mode combinations:
- SAST + SOURCE_UPLOAD + CAPTURE_ANALYSIS — Upload source for full SAST analysis
- SAST + SOURCE_UPLOAD + ANALYSIS_ONLY — Analyze previously captured source
- SAST + SCM + CAPTURE_ANALYSIS — Pull source from SCM for SAST
- SAST + CI + SAST_FULL_ISSUE_UPLOAD — Upload full SAST results from CI
- SAST + CI + SAST_RAPID_ISSUE_UPLOAD — Upload rapid/incremental SAST results from CI
- SCA + SOURCE_UPLOAD + SCA_SIGNATURE — Upload source for SCA signature scan
- SCA + SOURCE_UPLOAD + SCA_PACKAGE — Upload source for SCA package scan
- SCA + SOURCE_UPLOAD + SCANNING_MATCHING — Upload source for SCA scanning+matching
- SCA + SCM + SCA_SIGNATURE — Pull source from SCM for SCA signature scan
- SCA + SCM + SCA_PACKAGE — Pull source from SCM for SCA package scan
- SCA + SCM + SCANNING_MATCHING — Pull source from SCM for SCA scanning+matching
- DAST + DAST_WEBAPP + DYNAMIC_TEST — Run DAST web application scan
- DAST + DAST_PREFLIGHT + DYNAMIC-PREFLIGHT — Run DAST preflight check
- DAST + DAST_API + DYNAMIC_TEST — Run DAST API scan
- DAST + DAST_API_PREFLIGHT + DYNAMIC-PREFLIGHT — Run DAST API preflight check
- EXTERNAL_ANALYSIS + THIRD_PARTY_RESULT_UPLOAD + IMPORT-RESULTS — Import third-party results

Simplest usage: provide application_id, project_id, and assessment_types only. The API will auto-deduce test_mode and scan_mode when omitted.`,
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    application_id,
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
      applicationId: application_id,
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

    const failedItems = response.responses.filter(
      (item) => item.status < 200 || item.status >= 300,
    );
    if (failedItems.length > 0) {
      const details = failedItems.map((item) => {
        const msg = item.error?.detail ?? item.error?.title ?? `status ${item.status}`;
        return msg;
      }).join("; ");
      return errorResponse(
        `Test creation failed for ${failedItems.length}/${response.responses.length} item(s): ${details}`,
      );
    }

    return jsonResponse(response);
  },
};
