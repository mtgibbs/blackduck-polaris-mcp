import { getClient } from "./client.ts";
import type {
  Test,
  TestArtifactMetadata,
  TestComment,
  TestMetrics,
  TestProfile,
} from "../types/polaris.ts";

const ACCEPT_TESTS = "application/vnd.polaris.tests-1+json";
const ACCEPT_COMMENTS = "application/vnd.polaris.tests.tests-comments-1+json";
const ACCEPT_ARTIFACTS = "application/vnd.polaris.tests.test-artifacts-1+json";
const ACCEPT_ARTIFACTS_LIST = "application/vnd.polaris.tests.test-artifacts-list-1+json";
const ACCEPT_PROFILES = "application/vnd.polaris.tests.test-profiles-1+json";

export interface TestQueryParams {
  projectId?: string;
  branchId?: string;
  status?: string;
  filter?: string;
}

export function getTests(params: TestQueryParams = {}): Promise<Test[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.status) queryParams._filter = `status==${params.status}`;
  if (params.filter) {
    queryParams._filter = queryParams._filter
      ? `${queryParams._filter};${params.filter}`
      : params.filter;
  }

  return client.getAllOffset<Test>("/api/tests", queryParams, ACCEPT_TESTS);
}

export function getTest(testId: string): Promise<Test> {
  const client = getClient();
  return client.get<Test>(`/api/tests/${testId}`, undefined, ACCEPT_TESTS);
}

export function getTestMetrics(testId: string): Promise<TestMetrics> {
  const client = getClient();
  return client.get<TestMetrics>(
    `/api/tests/${testId}/test-metrics`,
    undefined,
    ACCEPT_TESTS,
  );
}

export function getTestComments(testId: string): Promise<TestComment[]> {
  const client = getClient();
  return client.getAllOffset<TestComment>(
    `/api/tests/${testId}/comments`,
    undefined,
    ACCEPT_COMMENTS,
  );
}

export interface CreateArtifactRequest {
  fileName: string;
  fileHash: string;
  fileSize: string;
  entitlementId?: string;
  assessmentType?: string;
  artifactType: string;
  createdAt?: string;
}

export interface CreateArtifactResponse {
  artifactId: string;
  signedUrl: string;
  createdAt: string;
  _links?: Array<{ href: string; rel: string; method: string }>;
}

export function createTestArtifact(
  body: CreateArtifactRequest,
): Promise<CreateArtifactResponse> {
  const client = getClient();
  return client.fetch<CreateArtifactResponse>("/api/tests/artifacts", {
    method: "POST",
    body,
    accept: ACCEPT_ARTIFACTS,
    contentType: ACCEPT_ARTIFACTS,
  });
}

export function getTestArtifacts(
  testId: string,
): Promise<TestArtifactMetadata[]> {
  const client = getClient();
  return client.getAllOffset<TestArtifactMetadata>(
    `/api/tests/${testId}/artifacts`,
    undefined,
    ACCEPT_ARTIFACTS_LIST,
  );
}

export interface ArtifactDownloadInfo {
  testId: string;
  artifactId: string;
  downloadUrl: string;
}

export function getTestArtifact(
  testId: string,
  artifactId: string,
): Promise<ArtifactDownloadInfo> {
  const client = getClient();
  // Binary downloads don't work well with JSON-based MCP tools
  // Return download info instead
  return Promise.resolve({
    testId,
    artifactId,
    downloadUrl: `/api/tests/${testId}/artifacts/${artifactId}`,
  });
}

export function getTestProfiles(testId: string): Promise<TestProfile> {
  const client = getClient();
  return client.get<TestProfile>(
    `/api/tests/${testId}/profiles`,
    undefined,
    ACCEPT_PROFILES,
  );
}
