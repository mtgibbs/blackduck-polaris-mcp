import type { AnyToolDefinition } from "../types.ts";
import { getPortfoliosTool } from "./get-portfolios.ts";
import { getApplicationsTool } from "./get-applications.ts";
import { getProjectsTool } from "./get-projects.ts";
import { getBranchesTool } from "./get-branches.ts";
import { getIssuesTool } from "./get-issues.ts";
import { getIssueTool } from "./get-issue.ts";
import { getOccurrencesTool } from "./get-occurrences.ts";
import { getCodeSnippetTool } from "./get-code-snippet.ts";
import { getRemediationAssistTool } from "./get-remediation-assist.ts";
import { provideAssistFeedbackTool } from "./provide-assist-feedback.ts";
import { triageIssuesTool } from "./triage-issues.ts";
import { getIssueCountTool } from "./get-issue-count.ts";
import { getTestsTool } from "./get-tests.ts";
import { getTestMetricsTool } from "./get-test-metrics.ts";
import { getBugTrackingConfigsTool } from "./get-bug-tracking-configs.ts";
import { getExternalProjectsTool } from "./get-external-projects.ts";
import { exportIssuesTool } from "./export-issues.ts";
import { exportFindingsIssuesTool } from "./export-findings-issues.ts";
import { getIssueCountOverTimeTool } from "./get-issue-count-over-time.ts";
import { changePendingFixByTool } from "./change-pending-fix-by.ts";
import { changePendingStatusTool } from "./change-pending-status.ts";
import { getTaxonomiesTool } from "./get-taxonomies.ts";
import { getTaxonTool } from "./get-taxon.ts";
import { getTaxonSubtaxaTool } from "./get-taxon-subtaxa.ts";
import { getTaxonIssueTypesTool } from "./get-taxon-issue-types.ts";
import { getComponentVersionsTool } from "./get-component-versions.ts";
import { getComponentVersionTool } from "./get-component-version.ts";
import { getComponentVersionCountTool } from "./get-component-version-count.ts";

export const tools: AnyToolDefinition[] = [
  getPortfoliosTool,
  getApplicationsTool,
  getProjectsTool,
  getBranchesTool,
  getIssuesTool,
  getIssueTool,
  getOccurrencesTool,
  getCodeSnippetTool,
  getRemediationAssistTool,
  provideAssistFeedbackTool,
  triageIssuesTool,
  getIssueCountTool,
  getTestsTool,
  getTestMetricsTool,
  getBugTrackingConfigsTool,
  getExternalProjectsTool,
  exportIssuesTool,
  exportFindingsIssuesTool,
  getIssueCountOverTimeTool,
  changePendingFixByTool,
  changePendingStatusTool,
  getTaxonomiesTool,
  getTaxonTool,
  getTaxonSubtaxaTool,
  getTaxonIssueTypesTool,
  getComponentVersionsTool,
  getComponentVersionTool,
  getComponentVersionCountTool,
];
