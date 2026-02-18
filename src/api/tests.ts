import { getClient } from "./client.ts";
import type { Test, TestMetrics } from "../types/polaris.ts";

const ACCEPT_TESTS = "application/vnd.polaris.tests-1+json";

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
