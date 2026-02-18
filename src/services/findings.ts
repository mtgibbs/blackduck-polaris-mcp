import * as findingsApi from "../api/findings.ts";
import type { AssistResponse, CodeSnippet, Issue, Occurrence } from "../types/polaris.ts";

// --- Issues ---

export interface GetIssuesOptions {
  projectId: string;
  applicationId?: string;
  branchId?: string;
  testId?: string;
  severity?: string[];
  toolType?: string[];
  delta?: string;
  sort?: string;
  first?: number;
}

export function getIssues(options: GetIssuesOptions): Promise<Issue[]> {
  const filters: string[] = [];

  if (options.severity?.length) {
    const values = options.severity.map((s) => `'${s}'`).join(",");
    filters.push(`occurrence:severity=in=(${values})`);
  }
  if (options.toolType?.length) {
    const values = options.toolType.map((t) => `'${t}'`).join(",");
    filters.push(`context:tool-type=in=(${values})`);
  }
  if (options.delta) {
    filters.push(`special:delta==${options.delta}`);
  }

  return findingsApi.getIssues({
    projectId: options.projectId,
    applicationId: options.applicationId,
    branchId: options.branchId,
    testId: options.testId,
    filter: filters.length > 0 ? filters.join(";") : undefined,
    sort: options.sort,
    includeType: true,
    includeOccurrenceProperties: true,
    includeTriageProperties: true,
    includeFirstDetectedOn: true,
    includeContext: true,
    first: options.first,
  });
}

export interface GetIssueOptions {
  issueId: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getIssue(options: GetIssueOptions): Promise<Issue> {
  return findingsApi.getIssue({
    issueId: options.issueId,
    projectId: options.projectId,
    branchId: options.branchId,
    testId: options.testId,
  });
}

// --- Occurrences ---

export interface GetOccurrencesOptions {
  projectId: string;
  applicationId?: string;
  branchId?: string;
  testId?: string;
  issueId?: string;
  filter?: string;
  sort?: string;
  first?: number;
}

export function getOccurrences(options: GetOccurrencesOptions): Promise<Occurrence[]> {
  const filters: string[] = [];

  if (options.issueId) {
    filters.push(`occurrence:issue-id==${options.issueId}`);
  }
  if (options.filter) {
    filters.push(options.filter);
  }

  return findingsApi.getOccurrences({
    projectId: options.projectId,
    applicationId: options.applicationId,
    branchId: options.branchId,
    testId: options.testId,
    filter: filters.length > 0 ? filters.join(";") : undefined,
    sort: options.sort,
    includeProperties: true,
    includeType: true,
    first: options.first,
  });
}

export interface GetOccurrenceOptions {
  occurrenceId: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getOccurrence(options: GetOccurrenceOptions): Promise<Occurrence> {
  return findingsApi.getOccurrence({
    occurrenceId: options.occurrenceId,
    projectId: options.projectId,
    branchId: options.branchId,
    testId: options.testId,
  });
}

// --- Snippet ---

export function getCodeSnippet(occurrenceId: string): Promise<CodeSnippet> {
  return findingsApi.getOccurrenceSnippet({ occurrenceId });
}

// --- Remediation Assist ---

export function getRemediationAssist(occurrenceId: string): Promise<AssistResponse> {
  return findingsApi.getOccurrenceAssist({ occurrenceId });
}

export interface ProvideAssistFeedbackOptions {
  occurrenceId: string;
  assistId: string;
  disposition: boolean;
  comment?: string;
}

export function provideAssistFeedback(
  options: ProvideAssistFeedbackOptions,
): Promise<AssistResponse> {
  return findingsApi.provideAssistFeedback(options);
}
