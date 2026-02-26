import { z } from "zod";
import { getIssues, getLinkedIssues } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  project_id: z.string().describe("Project ID to check export status for"),
  branch_id: z
    .string()
    .optional()
    .describe("Branch ID (defaults to default branch)"),
  severity: z
    .string()
    .optional()
    .describe("Comma-separated severity filter: critical,high,medium,low"),
};

export const getExportStatusTool: ToolDefinition<typeof schema> = {
  name: "get_export_status",
  description:
    "Check which issues have been exported to the bug tracking system and which have not. Fetches issues and linked issues in parallel, then partitions them into exported (with issueKey and issueLink) and not-exported lists. Returns summary counts and items for each category.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id, project_id, branch_id, severity }) => {
    // Fetch issues and linked issues in parallel
    const [issues, linkedIssues] = await Promise.all([
      getIssues({
        projectId: project_id,
        branchId: branch_id,
        testId: "latest",
        severity: severity?.split(",").map((s: string) => s.trim()),
      }),
      getLinkedIssues({ configurationId: config_id }),
    ]);

    // Create a map of issueId -> LinkedIssue for O(1) lookup
    const linkedIssuesMap = new Map(
      linkedIssues.map((linked) => [linked.issueId, linked]),
    );

    // Helper to extract severity from occurrenceProperties
    const getSeverity = (issue: typeof issues[0]): string => {
      const severityProp = issue.occurrenceProperties?.find(
        (prop) => prop.key === "severity",
      );
      return severityProp?.value?.toString() ?? "unknown";
    };

    // Helper to get issue name
    const getIssueName = (issue: typeof issues[0]): string => {
      return issue.type?._localized?.name ?? issue.type?.altName ?? "Unknown";
    };

    // Partition issues into exported and not-exported
    const exported = [];
    const notExported = [];

    for (const issue of issues) {
      const linked = linkedIssuesMap.get(issue.id);
      const itemBase = {
        issueId: issue.id,
        name: getIssueName(issue),
        severity: getSeverity(issue),
      };

      if (linked?.issueKey && linked?.issueLink) {
        // Issue is exported
        exported.push({
          ...itemBase,
          issueKey: linked.issueKey,
          issueLink: linked.issueLink,
        });
      } else {
        // Issue is not exported
        notExported.push(itemBase);
      }
    }

    return jsonResponse({
      project_id,
      totalIssues: issues.length,
      exported: {
        count: exported.length,
        items: exported,
      },
      notExported: {
        count: notExported.length,
        items: notExported,
      },
    });
  },
};
