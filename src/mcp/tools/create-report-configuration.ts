import { z } from "zod";
import { createReportConfiguration } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  name: z
    .string()
    .max(256)
    .describe("Configuration name (max 256 characters, must be unique)"),
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
      "Report type: issues-report, standard-compliance, standard-compliance-detail, security-audit, test-summary, issue-overview, developer-detail-static, developer-detail-sca, dast-detail-report, executive-summary, spdx, cyclonedx, or cyclonedx-v1.6",
    ),
  scope: z
    .enum(["ALL_APPLICATIONS", "SELECTED_APPLICATIONS", "SELECTED_BRANCHES"])
    .describe(
      "Report scope: ALL_APPLICATIONS (entire portfolio), SELECTED_APPLICATIONS (specified applications), or SELECTED_BRANCHES (specified branches)",
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
      "Tool types to include: DAST_POLARIS, SCA_PACKAGE, SCA_SIGNATURE, STATIC_POLARIS, STATIC_RAPID, or EXTERNAL_ANALYSIS",
    ),
  append_date: z
    .boolean()
    .optional()
    .describe("Whether to append the date to the report filename"),
  time_period: z
    .string()
    .optional()
    .describe("Time period filter: LAST_7_DAYS, LAST_30_DAYS, LAST_90_DAYS, or CUSTOM"),
  filter: z
    .string()
    .optional()
    .describe("RSQL filter expression for additional filtering"),
  standard: z
    .string()
    .optional()
    .describe("Compliance standard (for compliance reports): CWE, OWASP, PCI-DSS, etc."),
  customizations: z
    .record(z.unknown())
    .optional()
    .describe("Report-specific customizations (varies by report type)"),
  issues_discovered: z
    .string()
    .optional()
    .describe("Issues discovered filter"),
};

export const createReportConfigurationTool: ToolDefinition<typeof schema> = {
  name: "create_report_configuration",
  description:
    "Create a new report configuration. A configuration is a saved report setup that can be re-run or scheduled. Returns 409 Conflict if a configuration with the same name already exists. The configuration can later be executed using run_report_configuration.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    name,
    report_type,
    scope,
    severities,
    tools,
    append_date,
    time_period,
    filter,
    standard,
    customizations,
    issues_discovered,
  }) => {
    try {
      const configuration = await createReportConfiguration({
        payload: {
          name,
          reportType: report_type,
          scope,
          severities,
          tools,
          appendDate: append_date,
          timePeriod: time_period,
          filter,
          standard,
          customizations,
          issuesDiscovered: issues_discovered,
        },
      });
      return jsonResponse(configuration);
    } catch (error) {
      return errorResponse(
        `Failed to create report configuration: ${(error as Error).message}`,
      );
    }
  },
};
