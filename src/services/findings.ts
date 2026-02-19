import * as findingsApi from "../api/findings.ts";
import type {
  AssistResponse,
  CodeSnippet,
  ComponentVersion,
  ComponentVersionCountItem,
  Issue,
  IssueCountItem,
  IssueCountOverTimeResponse,
  IssueExportItem,
  Occurrence,
  Taxon,
  TaxonIssueType,
  Taxonomy,
  TriagePropertyInput,
  TriageResult,
} from "../types/polaris.ts";

// --- Issues ---

export interface GetIssuesOptions {
  applicationId?: string;
  projectId?: string;
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
    applicationId: options.applicationId,
    projectId: options.projectId,
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
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getIssue(options: GetIssueOptions): Promise<Issue> {
  return findingsApi.getIssue({
    issueId: options.issueId,
    applicationId: options.applicationId,
    projectId: options.projectId,
    branchId: options.branchId,
    testId: options.testId,
    includeType: true,
    includeOccurrenceProperties: true,
    includeTriageProperties: true,
    includeFirstDetectedOn: true,
    includeContext: true,
    includeComponentLocations: true,
  });
}

// --- Occurrences ---

export interface GetOccurrencesOptions {
  applicationId?: string;
  projectId?: string;
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
    includeProperties: true,
    includeType: true,
  });
}

// --- Snippet ---

export interface GetCodeSnippetOptions {
  occurrenceId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getCodeSnippet(options: GetCodeSnippetOptions): Promise<CodeSnippet> {
  return findingsApi.getOccurrenceSnippet(options);
}

// --- Remediation Assist ---

export interface GetRemediationAssistOptions {
  occurrenceId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getRemediationAssist(
  options: GetRemediationAssistOptions,
): Promise<AssistResponse> {
  return findingsApi.getOccurrenceAssist(options);
}

export interface ProvideAssistFeedbackOptions {
  occurrenceId: string;
  assistId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  disposition: boolean;
  comment?: string;
}

export function provideAssistFeedback(
  options: ProvideAssistFeedbackOptions,
): Promise<AssistResponse> {
  return findingsApi.provideAssistFeedback(options);
}

// --- Triage Issues ---

export interface TriageIssuesOptions {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  triageProperties: TriagePropertyInput[];
}

export function triageIssues(options: TriageIssuesOptions): Promise<TriageResult> {
  return findingsApi.triageIssues(options);
}

// --- Issue Count ---

export interface GetIssueCountOptions {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  group?: string[];
  includeAverageAge?: boolean;
  first?: number;
}

export function getIssueCount(options: GetIssueCountOptions): Promise<IssueCountItem[]> {
  return findingsApi.getIssueCount(options);
}

// --- Export Findings Issues ---

export interface ExportFindingsIssuesOptions {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  sort?: string;
  fileName?: string;
}

export function exportFindingsIssues(
  options: ExportFindingsIssuesOptions,
): Promise<IssueExportItem[]> {
  return findingsApi.exportIssues(options);
}

// --- Issue Count Over Time ---

export interface GetIssueCountOverTimeOptions {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  lastXDays?: number;
  fromDate?: string;
  toDate?: string;
}

export function getIssueCountOverTime(
  options: GetIssueCountOverTimeOptions,
): Promise<IssueCountOverTimeResponse> {
  return findingsApi.getIssueCountOverTime(options);
}

// --- Pending Approval ---

export interface ChangePendingFixByOptions {
  projectId: string;
  branchId?: string;
  ids: string[];
  action: "approved" | "rejected";
  comment?: string;
}

export function changePendingFixBy(options: ChangePendingFixByOptions): Promise<void> {
  return findingsApi.changePendingFixBy(options);
}

export interface ChangePendingStatusOptions {
  projectId: string;
  branchId?: string;
  ids: string[];
  action: "approved" | "rejected";
  comment?: string;
}

export function changePendingStatus(options: ChangePendingStatusOptions): Promise<void> {
  return findingsApi.changePendingStatus(options);
}

// --- Taxonomy ---

export interface GetTaxonomiesOptions {
  includeDescendants?: boolean;
  includeOnlyStandards?: boolean;
  first?: number;
}

export function getTaxonomies(options: GetTaxonomiesOptions): Promise<Taxonomy[]> {
  return findingsApi.getTaxonomies(options);
}

export function getTaxon(taxonId: string): Promise<Taxon> {
  return findingsApi.getTaxon({ taxonId });
}

export interface GetTaxonSubtaxaOptions {
  taxonId: string;
  first?: number;
}

export function getTaxonSubtaxa(options: GetTaxonSubtaxaOptions): Promise<Taxon[]> {
  return findingsApi.getTaxonSubtaxa(options);
}

export interface GetTaxonIssueTypesOptions {
  taxonId: string;
  first?: number;
}

export function getTaxonIssueTypes(options: GetTaxonIssueTypesOptions): Promise<TaxonIssueType[]> {
  return findingsApi.getTaxonIssueTypes(options);
}

// --- Component Versions ---

export interface GetComponentVersionsOptions {
  projectId?: string;
  applicationId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  includeComponent?: boolean;
  includeLicense?: boolean;
  first?: number;
}

export function getComponentVersions(
  options: GetComponentVersionsOptions,
): Promise<ComponentVersion[]> {
  return findingsApi.getComponentVersions(options);
}

export interface GetComponentVersionOptions {
  id: string;
  projectId?: string;
  applicationId?: string;
  includeComponent?: boolean;
  includeLicense?: boolean;
}

export function getComponentVersion(
  options: GetComponentVersionOptions,
): Promise<ComponentVersion> {
  return findingsApi.getComponentVersion(options);
}

export interface GetComponentVersionCountOptions {
  projectId?: string;
  applicationId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  group?: string[];
  first?: number;
}

export function getComponentVersionCount(
  options: GetComponentVersionCountOptions,
): Promise<ComponentVersionCountItem[]> {
  return findingsApi.getComponentVersionCount(options);
}
