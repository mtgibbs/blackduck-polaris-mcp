import { z } from "zod";
import { getReportTypes } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {};

export const getReportTypesTool: ToolDefinition<typeof schema> = {
  name: "get_report_types",
  description:
    "Get list of supported report types. Returns report type identifiers with descriptions. Use these report type values when calling run_report.\n\n" +
    "Report types include:\n" +
    "- issues-report: Detailed security issues report\n" +
    "- standard-compliance: Standards compliance summary\n" +
    "- standard-compliance-detail: Detailed compliance report\n" +
    "- security-audit: Security audit report\n" +
    "- test-summary: Test execution summary\n" +
    "- issue-overview: Issue overview report\n" +
    "- developer-detail-static: Developer detail for static analysis\n" +
    "- developer-detail-sca: Developer detail for SCA\n" +
    "- dast-detail-report: DAST detailed findings\n" +
    "- executive-summary: Executive summary report\n" +
    "- spdx: SPDX SBOM format\n" +
    "- cyclonedx: CycloneDX SBOM format (latest)\n" +
    "- cyclonedx-v1.6: CycloneDX SBOM format version 1.6",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async () => {
    const reportTypes = await getReportTypes();
    return jsonResponse(reportTypes);
  },
};
