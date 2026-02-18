import { getClient } from "./client.ts";
import type {
  AssistFeedbackPatch,
  AssistResponse,
  CodeSnippet,
  Issue,
  Occurrence,
} from "../types/polaris.ts";

const ACCEPT_ISSUES = "application/vnd.polaris.findings.issues-1+json";
const ACCEPT_OCCURRENCES = "application/vnd.polaris.findings.occurrences-1+json";

// --- Issues ---

export interface IssueQueryParams {
  applicationId?: string;
  projectId: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  sort?: string;
  includeType?: boolean;
  includeOccurrenceProperties?: boolean;
  includeTriageProperties?: boolean;
  includeFirstDetectedOn?: boolean;
  includeContext?: boolean;
  first?: number;
}

export function getIssues(params: IssueQueryParams): Promise<Issue[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | boolean | undefined> = {
    projectId: params.projectId,
    testId: params.testId ?? "latest",
    _first: params.first ?? 100,
  };

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeType) queryParams._includeType = true;
  if (params.includeOccurrenceProperties) queryParams._includeOccurrenceProperties = true;
  if (params.includeTriageProperties) queryParams._includeTriageProperties = true;
  if (params.includeFirstDetectedOn) queryParams._includeFirstDetectedOn = true;
  if (params.includeContext) queryParams._includeContext = true;

  return client.getAllCursor<Issue>("/api/findings/issues", queryParams, ACCEPT_ISSUES);
}

export interface GetIssueParams {
  issueId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  includeAttributes?: boolean;
}

export function getIssue(params: GetIssueParams): Promise<Issue> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;
  if (params.includeAttributes) queryParams._includeAttributes = true;

  return client.get<Issue>(
    `/api/findings/issues/${params.issueId}`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_ISSUES,
  );
}

// --- Occurrences ---

export interface OccurrenceQueryParams {
  applicationId?: string;
  projectId: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  sort?: string;
  includeProperties?: boolean;
  includeType?: boolean;
  first?: number;
}

export function getOccurrences(params: OccurrenceQueryParams): Promise<Occurrence[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | boolean | undefined> = {
    projectId: params.projectId,
    testId: params.testId ?? "latest",
    _first: params.first ?? 100,
  };

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeProperties) queryParams._includeProperties = true;
  if (params.includeType) queryParams._includeType = true;

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
}

export function getOccurrence(params: GetOccurrenceParams): Promise<Occurrence> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

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
  disposition: boolean;
  comment?: string;
}

export function provideAssistFeedback(
  params: ProvideAssistFeedbackParams,
): Promise<AssistResponse> {
  const client = getClient();
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
      body,
      accept: ACCEPT_OCCURRENCES,
      contentType: "application/json-patch+json",
    },
  );
}

// --- Artifacts ---

export function getArtifact(occurrenceId: string, artifactId: string): Promise<string> {
  const client = getClient();
  return client.fetch<string>(
    `/api/findings/occurrences/${occurrenceId}/artifacts/${artifactId}`,
    { accept: "text/plain" },
  );
}
