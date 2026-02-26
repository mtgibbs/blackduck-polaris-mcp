import { z } from "zod";
import { updateReportConfiguration } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  configuration_id: z
    .string()
    .describe("Report configuration ID to update"),
  name: z
    .string()
    .max(256)
    .optional()
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
    .optional()
    .describe(
      "Report type: issues-report, standard-compliance, standard-compliance-detail, security-audit, test-summary, issue-overview, developer-detail-static, developer-detail-sca, dast-detail-report, executive-summary, spdx, cyclonedx, or cyclonedx-v1.6",
    ),
  scope: z
    .enum(["ALL_APPLICATIONS", "SELECTED_APPLICATIONS", "SELECTED_BRANCHES"])
    .optional()
    .describe(
      "Report scope: ALL_APPLICATIONS (entire portfolio), SELECTED_APPLICATIONS (specified applications), or SELECTED_BRANCHES (specified branches)",
    ),
  severities: z
    .array(z.enum(["critical", "high", "medium", "low"]))
    .optional()
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
    .optional()
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

export const updateReportConfigurationTool: ToolDefinition<typeof schema> = {
  name: "update_report_configuration",
  description:
    "Update an existing report configuration using PATCH. Only provided fields will be updated. Returns 409 Conflict if the new name conflicts with an existing configuration.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    configuration_id,
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
      const payload: Record<string, unknown> = {};
      if (name !== undefined) payload.name = name;
      if (report_type !== undefined) payload.reportType = report_type;
      if (scope !== undefined) payload.scope = scope;
      if (severities !== undefined) payload.severities = severities;
      if (tools !== undefined) payload.tools = tools;
      if (append_date !== undefined) payload.appendDate = append_date;
      if (time_period !== undefined) payload.timePeriod = time_period;
      if (filter !== undefined) payload.filter = filter;
      if (standard !== undefined) payload.standard = standard;
      if (customizations !== undefined) payload.customizations = customizations;
      if (issues_discovered !== undefined) {
        payload.issuesDiscovered = issues_discovered;
      }

      const configuration = await updateReportConfiguration({
        configurationId: configuration_id,
        payload,
      });
      return jsonResponse(configuration);
    } catch (error) {
      return errorResponse(
        `Failed to update report configuration: ${(error as Error).message}`,
      );
    }
  },
};
