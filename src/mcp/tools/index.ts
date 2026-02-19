import type { AnyToolDefinition } from "../types.ts";
import { getPortfoliosTool } from "./get-portfolios.ts";
import { getApplicationsTool } from "./get-applications.ts";
import { getProjectsTool } from "./get-projects.ts";
import { getBranchesTool } from "./get-branches.ts";
import { getIssuesTool } from "./get-issues.ts";
import { getIssueTool } from "./get-issue.ts";
import { getIssueTriageHistoryTool } from "./get-issue-triage-history.ts";
import { getIssueDetectionHistoryTool } from "./get-issue-detection-history.ts";
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
import { getExternalProjectByKeyTool } from "./get-external-project-by-key.ts";
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
import { addComponentVersionTool } from "./add-component-version.ts";
import { editComponentVersionTool } from "./edit-component-version.ts";
import { resetComponentVersionTool } from "./reset-component-version.ts";
import { deleteComponentVersionTool } from "./delete-component-version.ts";
import { getOperationStatusTool } from "./get-operation-status.ts";
import { getComponentVersionActivityLogTool } from "./get-component-version-activity-log.ts";
import { getComponentVersionTriageHistoryTool } from "./get-component-version-triage-history.ts";
import { triageComponentVersionsTool } from "./triage-component-versions.ts";
import { assignComponentVersionLicenseTool } from "./assign-component-version-license.ts";
import { getComponentOriginsTool } from "./get-component-origins.ts";
import { getComponentOriginTool } from "./get-component-origin.ts";
import { getComponentOriginMatchesTool } from "./get-component-origin-matches.ts";
import { createBugTrackingConfigTool } from "./create-bug-tracking-config.ts";
import { updateBugTrackingConfigTool } from "./update-bug-tracking-config.ts";
import { deleteBugTrackingConfigTool } from "./delete-bug-tracking-config.ts";
import { testBugTrackingConnectionTool } from "./test-bug-tracking-connection.ts";

export const tools: AnyToolDefinition[] = [
  getPortfoliosTool,
  getApplicationsTool,
  getProjectsTool,
  getBranchesTool,
  getIssuesTool,
  getIssueTool,
  getIssueTriageHistoryTool,
  getIssueDetectionHistoryTool,
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
  getExternalProjectByKeyTool,
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
  addComponentVersionTool,
  editComponentVersionTool,
  resetComponentVersionTool,
  deleteComponentVersionTool,
  getOperationStatusTool,
  getComponentVersionActivityLogTool,
  getComponentVersionTriageHistoryTool,
  triageComponentVersionsTool,
  assignComponentVersionLicenseTool,
  getComponentOriginsTool,
  getComponentOriginTool,
  getComponentOriginMatchesTool,
  createBugTrackingConfigTool,
  updateBugTrackingConfigTool,
  deleteBugTrackingConfigTool,
  testBugTrackingConnectionTool,
];
