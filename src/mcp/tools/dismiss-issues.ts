import { z } from "zod";
import { triageIssues } from "../../services/index.ts";
import type { TriagePropertyInput } from "../../types/polaris.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  application_id: z
    .string()
    .optional()
    .describe("Application ID (mutually exclusive with project_id)"),
  project_id: z
    .string()
    .optional()
    .describe("Project ID (mutually exclusive with application_id)"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filenames: z
    .array(z.string())
    .optional()
    .describe("Dismiss issues found in these files. Example: ['TestFile1.cs', 'TestFile2.cs']"),
  severity: z
    .string()
    .optional()
    .describe(
      "Dismiss issues of this severity (comma-separated): critical, high, medium, low",
    ),
  issue_ids: z
    .array(z.string())
    .optional()
    .describe("Dismiss specific issues by occurrence ID"),
  reason: z
    .enum(["false-positive", "intentional", "component-excluded", "other"])
    .describe("Dismissal reason"),
  comment: z
    .string()
    .optional()
    .describe("Explanation for why issues are being dismissed"),
};

export const dismissIssuesTool: ToolDefinition<typeof schema> = {
  name: "dismiss_issues",
  description:
    "Dismiss security issues matching criteria. Handles filter construction and triage property rules automatically. Simpler alternative to triage_issues for dismissals. Provide at least one filter criteria (filenames, severity, or issue_ids).",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    application_id,
    project_id,
    branch_id,
    test_id,
    filenames,
    severity,
    issue_ids,
    reason,
    comment,
  }) => {
    // Validate scope
    if (!application_id && !project_id) {
      return errorResponse("Either application_id or project_id must be provided");
    }
    if (application_id && project_id) {
      return errorResponse("application_id and project_id are mutually exclusive");
    }

    // Build RSQL filter from convenience parameters
    const filterParts: string[] = [];

    if (filenames?.length) {
      // Escape single quotes in filenames to prevent RSQL injection
      const quoted = filenames.map((f) => `'${f.replace(/'/g, "\\'")}'`).join(",");
      filterParts.push(`occurrence:filename=in=(${quoted})`);
    }

    if (severity) {
      const levels = severity.split(",").map((s) => `'${s.trim().replace(/'/g, "\\'")}'`).join(",");
      filterParts.push(`occurrence:severity=in=(${levels})`);
    }

    if (issue_ids?.length) {
      const quoted = issue_ids.map((id) => `'${id.replace(/'/g, "\\'")}'`).join(",");
      filterParts.push(`occurrence:occurrence-id=in=(${quoted})`);
    }

    if (filterParts.length === 0) {
      return errorResponse(
        "Provide at least one filter criteria: filenames, severity, or issue_ids. Refusing to dismiss all issues without a filter.",
      );
    }

    const filter = filterParts.join(";"); // AND logic

    // Build triage properties — known-good combination for dismissal
    // IMPORTANT: Only include dismissal-reason and optionally comment, never include status
    const triageProperties: TriagePropertyInput[] = [
      { key: "dismissal-reason", value: reason },
    ];
    if (comment) {
      triageProperties.push({ key: "comment", value: comment });
    }

    const result = await triageIssues({
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      filter,
      triageProperties,
    });

    return jsonResponse({
      dismissed: result.count,
      reason,
      filter,
      comment: comment ?? null,
    });
  },
};
