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
import { getTestsTool } from "./get-tests.ts";
import { getTestMetricsTool } from "./get-test-metrics.ts";

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
  getTestsTool,
  getTestMetricsTool,
];
