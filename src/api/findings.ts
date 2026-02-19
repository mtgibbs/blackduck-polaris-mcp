import { getClient } from "./client.ts";
import type {
  AssistFeedbackPatch,
  AssistResponse,
  CodeSnippet,
  Issue,
  IssueCountItem,
  IssueCountOverTimeResponse,
  IssueExportItem,
  Occurrence,
  PendingApprovalRequest,
  TriagePropertyInput,
  TriageRequest,
  TriageResult,
} from "../types/polaris.ts";

/**
 * Validates that exactly one of applicationId or projectId is provided.
 * Per the Findings API spec, these are mutually exclusive and one must be set.
 */
function validateScope(
  applicationId: string | undefined,
  projectId: string | undefined,
): void {
  if (!applicationId && !projectId) {
    throw new Error("Either applicationId or projectId must be provided");
  }
  if (applicationId && projectId) {
    throw new Error("applicationId and projectId are mutually exclusive");
  }
}

const ACCEPT_ISSUES = "application/vnd.polaris.findings.issues-1+json";
const ACCEPT_OCCURRENCES = "application/vnd.polaris.findings.occurrences-1+json";

// --- Issues ---

export interface IssueQueryParams {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  sort?: string;
  includeType?: boolean;
  includeOccurrenceProperties?: boolean;
  includeTriageProperties?: boolean;
  includeFirstDetectedOn?: boolean;
  includeContext?: boolean;
  includeIssueExclusion?: boolean;
  includeExtensionProperties?: boolean;
  includeComponentLocations?: boolean;
  first?: number;
  last?: number;
}

export function getIssues(params: IssueQueryParams): Promise<Issue[]> {
  validateScope(params.applicationId, params.projectId);

  const client = getClient();
  const queryParams: Record<string, string | number | boolean | undefined> = {
    testId: params.testId ?? "latest",
    _first: params.first ?? 100,
  };

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeType) queryParams._includeType = true;
  if (params.includeOccurrenceProperties) queryParams._includeOccurrenceProperties = true;
  if (params.includeTriageProperties) queryParams._includeTriageProperties = true;
  if (params.includeFirstDetectedOn) queryParams._includeFirstDetectedOn = true;
  if (params.includeContext) queryParams._includeContext = true;
  if (params.includeIssueExclusion) queryParams._includeIssueExclusion = true;
  if (params.includeExtensionProperties) queryParams._includeExtensionProperties = true;
  if (params.includeComponentLocations) queryParams._includeComponentLocations = true;
  if (params.last) {
    queryParams._last = params.last;
    delete queryParams._first;
  }

  return client.getAllCursor<Issue>("/api/findings/issues", queryParams, ACCEPT_ISSUES);
}

export interface GetIssueParams {
  issueId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  includeType?: boolean;
  includeOccurrenceProperties?: boolean;
  includeTriageProperties?: boolean;
  includeFirstDetectedOn?: boolean;
  includeContext?: boolean;
  includeIssueExclusion?: boolean;
  includeExtensionProperties?: boolean;
  includeComponentLocations?: boolean;
}

export function getIssue(params: GetIssueParams): Promise<Issue> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;
  if (params.includeType) queryParams._includeType = true;
  if (params.includeOccurrenceProperties) queryParams._includeOccurrenceProperties = true;
  if (params.includeTriageProperties) queryParams._includeTriageProperties = true;
  if (params.includeFirstDetectedOn) queryParams._includeFirstDetectedOn = true;
  if (params.includeContext) queryParams._includeContext = true;
  if (params.includeIssueExclusion) queryParams._includeIssueExclusion = true;
  if (params.includeExtensionProperties) queryParams._includeExtensionProperties = true;
  if (params.includeComponentLocations) queryParams._includeComponentLocations = true;

  return client.get<Issue>(
    `/api/findings/issues/${params.issueId}`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_ISSUES,
  );
}

// --- Triage Issues ---

export interface TriageIssuesParams {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  triageProperties: TriagePropertyInput[];
}

export function triageIssues(params: TriageIssuesParams): Promise<TriageResult> {
  validateScope(params.applicationId, params.projectId);

  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

  const body: TriageRequest = {
    triageProperties: params.triageProperties,
  };
  if (params.filter) body.filter = params.filter;

  return client.fetch<TriageResult>("/api/findings/issues/_actions/triage", {
    method: "POST",
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    body,
    accept: ACCEPT_ISSUES,
    contentType: ACCEPT_ISSUES,
  });
}

// --- Issue Count ---

export interface GetIssueCountParams {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  group?: string[];
  includeAverageAge?: boolean;
  first?: number;
}

export function getIssueCount(params: GetIssueCountParams): Promise<IssueCountItem[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | boolean | undefined> = {
    _first: params.first ?? 100,
  };

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;
  if (params.filter) queryParams._filter = params.filter;
  if (params.group?.length) queryParams._group = params.group.join(",");
  if (params.includeAverageAge) queryParams._includeAverageAge = true;

  return client.getAllCursor<IssueCountItem>(
    "/api/findings/issues/_actions/count",
    queryParams,
    ACCEPT_ISSUES,
  );
}

// --- Export Issues ---

export interface ExportIssuesParams {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  sort?: string;
  fileName?: string;
}

export function exportIssues(params: ExportIssuesParams): Promise<IssueExportItem[]> {
  validateScope(params.applicationId, params.projectId);

  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.fileName) queryParams.fileName = params.fileName;

  return client.get<IssueExportItem[]>(
    "/api/findings/issues/_actions/export",
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_ISSUES,
  );
}

// --- Issue Count Over Time ---

export interface GetIssueCountOverTimeParams {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  lastXDays?: number;
  fromDate?: string;
  toDate?: string;
}

export function getIssueCountOverTime(
  params: GetIssueCountOverTimeParams,
): Promise<IssueCountOverTimeResponse> {
  validateScope(params.applicationId, params.projectId);

  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.lastXDays !== undefined) queryParams._lastXDays = params.lastXDays;
  if (params.fromDate) queryParams._fromDate = params.fromDate;
  if (params.toDate) queryParams._toDate = params.toDate;

  return client.get<IssueCountOverTimeResponse>(
    "/api/findings/issues/_actions/count-over-time",
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_ISSUES,
  );
}

// --- Occurrences ---

export interface OccurrenceQueryParams {
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  sort?: string;
  includeProperties?: boolean;
  includeType?: boolean;
  first?: number;
  last?: number;
}

export function getOccurrences(params: OccurrenceQueryParams): Promise<Occurrence[]> {
  validateScope(params.applicationId, params.projectId);

  const client = getClient();
  const queryParams: Record<string, string | number | boolean | undefined> = {
    testId: params.testId ?? "latest",
    _first: params.first ?? 100,
  };

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeProperties) queryParams._includeProperties = true;
  if (params.includeType) queryParams._includeType = true;
  if (params.last) {
    queryParams._last = params.last;
    delete queryParams._first;
  }

  return client.getAllCursor<Occurrence>(
    "/api/findings/occurrences",
    queryParams,
    ACCEPT_OCCURRENCES,
  );
}

export interface GetOccurrenceParams {
  occurrenceId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  includeProperties?: boolean;
  includeType?: boolean;
}

export function getOccurrence(params: GetOccurrenceParams): Promise<Occurrence> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;
  if (params.includeProperties) queryParams._includeProperties = true;
  if (params.includeType) queryParams._includeType = true;

  return client.get<Occurrence>(
    `/api/findings/occurrences/${params.occurrenceId}`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_OCCURRENCES,
  );
}

// --- Snippet ---

export interface GetSnippetParams {
  occurrenceId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getOccurrenceSnippet(params: GetSnippetParams): Promise<CodeSnippet> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

  return client.get<CodeSnippet>(
    `/api/findings/occurrences/${params.occurrenceId}/snippet`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_OCCURRENCES,
  );
}

// --- Remediation Assist ---

export interface GetAssistParams {
  occurrenceId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getOccurrenceAssist(params: GetAssistParams): Promise<AssistResponse> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

  return client.get<AssistResponse>(
    `/api/findings/occurrences/${params.occurrenceId}/assist`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_OCCURRENCES,
  );
}

// --- Assist Feedback ---

export interface ProvideAssistFeedbackParams {
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
  params: ProvideAssistFeedbackParams,
): Promise<AssistResponse> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

  const body: AssistFeedbackPatch[] = [
    {
      op: "add",
      path: "/feedbackResponses/-",
      value: {
        disposition: params.disposition,
        ...(params.comment !== undefined ? { comment: params.comment } : {}),
      },
    },
  ];

  return client.fetch<AssistResponse>(
    `/api/findings/occurrences/${params.occurrenceId}/assist/${params.assistId}`,
    {
      method: "PATCH",
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      body,
      accept: ACCEPT_OCCURRENCES,
      contentType: "application/json-patch+json",
    },
  );
}

// --- Pending Approval ---

const CONTENT_TYPE_CHANGE_PENDING_FIX_BY =
  "application/vnd.polaris.findings.issues-change-pending-fix-by-1+json";
const CONTENT_TYPE_CHANGE_PENDING_STATUS =
  "application/vnd.polaris.findings.issues-change-pending-status-1+json";

export interface ChangePendingFixByParams {
  projectId: string;
  branchId?: string;
  ids: string[];
  action: "approved" | "rejected";
  comment?: string;
}

export function changePendingFixBy(params: ChangePendingFixByParams): Promise<void> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {
    projectId: params.projectId,
  };
  if (params.branchId) queryParams.branchId = params.branchId;

  const body: PendingApprovalRequest = {
    ids: params.ids,
    action: params.action,
    ...(params.comment !== undefined ? { comment: params.comment } : {}),
  };

  return client.fetch<void>("/api/findings/issues/_actions/change-pending-fix-by", {
    method: "POST",
    params: queryParams,
    body,
    accept: ACCEPT_ISSUES,
    contentType: CONTENT_TYPE_CHANGE_PENDING_FIX_BY,
  });
}

export interface ChangePendingStatusParams {
  projectId: string;
  branchId?: string;
  ids: string[];
  action: "approved" | "rejected";
  comment?: string;
}

export function changePendingStatus(params: ChangePendingStatusParams): Promise<void> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {
    projectId: params.projectId,
  };
  if (params.branchId) queryParams.branchId = params.branchId;

  const body: PendingApprovalRequest = {
    ids: params.ids,
    action: params.action,
    ...(params.comment !== undefined ? { comment: params.comment } : {}),
  };

  return client.fetch<void>("/api/findings/issues/_actions/change-pending-status", {
    method: "POST",
    params: queryParams,
    body,
    accept: ACCEPT_ISSUES,
    contentType: CONTENT_TYPE_CHANGE_PENDING_STATUS,
  });
}

// --- Artifacts ---

export interface GetArtifactParams {
  occurrenceId: string;
  artifactId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getArtifact(params: GetArtifactParams): Promise<string> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

  return client.fetch<string>(
    `/api/findings/occurrences/${params.occurrenceId}/artifacts/${params.artifactId}`,
    {
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      accept: "text/plain",
    },
  );
}
