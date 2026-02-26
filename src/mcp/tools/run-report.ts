import { z } from "zod";
import { runReport } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";
import type { ReportApplication } from "../../types/polaris.ts";

export const schema = {
  report_type: z
    .enum([
      "issues-report",
      "standard-compliance",
      "standard-compliance-detail",
      "security-audit",
      "test-summary",
      "issue-overview",
      "developer-detail-static",
      "developer-detail-sca",
      "dast-detail-report",
      "executive-summary",
      "spdx",
      "cyclonedx",
      "cyclonedx-v1.6",
    ])
    .describe(
      "Report type: issues-report (all security issues), standard-compliance (compliance overview), standard-compliance-detail (detailed compliance), security-audit (audit report), test-summary (scan summary), issue-overview (issue overview), developer-detail-static (SAST details), developer-detail-sca (SCA details), dast-detail-report (DAST details), executive-summary (executive overview), spdx (SPDX SBOM), cyclonedx (CycloneDX SBOM 1.4), cyclonedx-v1.6 (CycloneDX SBOM 1.6)",
    ),
  applications: z
    .array(
      z.object({
        id: z.string().describe("Application ID"),
        name: z.string().describe("Application name"),
        projects: z.array(
          z.object({
            id: z.string().describe("Project ID"),
            name: z.string().describe("Project name"),
            branches: z.array(
              z.object({
                id: z.string().describe("Branch ID"),
                name: z.string().describe("Branch name"),
                isDefault: z.boolean().optional().describe("Whether this is the default branch"),
              }),
            ).describe("Project branches to include in report"),
          }),
        ).describe("Projects to include in report"),
      }),
    )
    .describe(
      "Applications and their projects/branches to include in the report. Nested structure: applications contain projects, projects contain branches.",
    ),
  severities: z
    .array(z.enum(["critical", "high", "medium", "low"]))
    .describe("Issue severities to include in the report"),
  tools: z
    .array(
      z.enum([
        "DAST_POLARIS",
        "SCA_PACKAGE",
        "SCA_SIGNATURE",
        "STATIC_POLARIS",
        "STATIC_RAPID",
        "EXTERNAL_ANALYSIS",
      ]),
    )
    .describe(
      "Tool types to include: DAST_POLARIS (DAST), SCA_PACKAGE (SCA package), SCA_SIGNATURE (SCA signature), STATIC_POLARIS (SAST), STATIC_RAPID (Rapid scan), EXTERNAL_ANALYSIS (external)",
    ),
  standard: z
    .string()
    .optional()
    .describe("Compliance standard (for compliance reports): CWE, OWASP, PCI-DSS, etc."),
  time_period: z
    .string()
    .optional()
    .describe("Time period filter: LAST_7_DAYS, LAST_30_DAYS, LAST_90_DAYS, CUSTOM"),
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression for additional filtering"),
  scope: z
    .enum(["ALL_APPLICATIONS", "SELECTED_APPLICATIONS", "SELECTED_BRANCHES"])
    .optional()
    .describe(
      "Report scope: ALL_APPLICATIONS (entire portfolio), SELECTED_APPLICATIONS (specified applications), SELECTED_BRANCHES (specified branches)",
    ),
  customizations: z
    .record(z.unknown())
    .optional()
    .describe("Report-specific customizations (varies by report type)"),
  issues_discovered: z
    .string()
    .optional()
    .describe("Issues discovered filter"),
};

export const runReportTool: ToolDefinition<typeof schema> = {
  name: "run_report",
  description:
    "Run a new Polaris report. Initiates report generation and returns a report object with status INITIATED. The client should poll get_report with the returned report ID to check for completion (status becomes COMPLETED or FAILED). Reports are generated asynchronously.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    report_type,
    applications,
    severities,
    tools,
    standard,
    time_period,
    filter,
    scope,
    customizations,
    issues_discovered,
  }) => {
    const report = await runReport({
      reportType: report_type,
      payload: {
        applications: applications as ReportApplication[],
        severities,
        tools,
        standard,
        timePeriod: time_period,
        filter,
        scope,
        customizations,
        issuesDiscovered: issues_discovered,
      },
    });
    return jsonResponse(report);
  },
};
