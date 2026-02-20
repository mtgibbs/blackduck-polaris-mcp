import { getClient } from "./client.ts";
import type {
  CreateArtifactResponse,
  CreateTestRequest,
  CreateTestResponse,
  SubscriptionMetrics,
  Test,
  TestArtifactMetadata,
  TestComment,
  TestMetrics,
  TestProfile,
  UpdateTestRequest,
} from "../types/polaris.ts";

const ACCEPT_TESTS = "application/vnd.polaris.tests-1+json";
const ACCEPT_TEST = "application/vnd.polaris.tests.test-1+json";
const ACCEPT_COMMENTS = "application/vnd.polaris.tests.tests-comments-1+json";
const ACCEPT_ARTIFACTS = "application/vnd.polaris.tests.test-artifacts-1+json";
const ACCEPT_ARTIFACTS_LIST = "application/vnd.polaris.tests.test-artifacts-list-1+json";
const ACCEPT_PROFILES = "application/vnd.polaris.tests.test-profiles-1+json";
const ACCEPT_METRICS = "application/vnd.polaris.tests.metrics-1+json";
const CONTENT_TYPE_CREATE = "application/vnd.polaris.tests.tests-bulk-create-1+json";
const CONTENT_TYPE_UPDATE = "application/vnd.polaris.tests.test-actions-1+json";

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

export function getTestProfiles(testId: string): Promise<TestProfile> {
  const client = getClient();
  return client.get<TestProfile>(
    `/api/tests/${testId}/profiles`,
    undefined,
    ACCEPT_PROFILES,
  );
}

export function createTest(
  body: CreateTestRequest,
): Promise<CreateTestResponse> {
  const client = getClient();
  return client.fetch<CreateTestResponse>("/api/tests", {
    method: "POST",
    body,
    accept: "application/vnd.polaris.tests.tests-bulk-1+json",
    contentType: CONTENT_TYPE_CREATE,
  });
}

export function updateTest(
  testId: string,
  body: UpdateTestRequest,
): Promise<Test> {
  const client = getClient();
  return client.fetch<Test>(`/api/tests/${testId}`, {
    method: "PATCH",
    body,
    accept: ACCEPT_TEST,
    contentType: CONTENT_TYPE_UPDATE,
  });
}

export interface SubscriptionMetricsQueryParams {
  filter?: string;
}

export function getSubscriptionMetrics(
  params: SubscriptionMetricsQueryParams = {},
): Promise<SubscriptionMetrics[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.filter) {
    queryParams._filter = params.filter;
  }

  return client.getAllOffset<SubscriptionMetrics>(
    "/api/tests/metrics",
    queryParams,
    ACCEPT_METRICS,
  );
}

export interface LastRunTestsQueryParams {
  assessmentType: string;
  projectId: string;
  branchId?: string;
  profileId?: string;
}

export function getLastRunTests(
  params: LastRunTestsQueryParams,
): Promise<Test[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {
    assessmentType: params.assessmentType,
    projectId: params.projectId,
  };

  if (params.branchId) {
    queryParams.branchId = params.branchId;
  }
  if (params.profileId) {
    queryParams.profileId = params.profileId;
  }

  return client.getAllOffset<Test>("/api/tests/last-run", queryParams, ACCEPT_TESTS);
}
