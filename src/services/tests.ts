import * as testsApi from "../api/tests.ts";
import type { Test, TestMetrics } from "../types/polaris.ts";

export function getTests(
  projectId?: string,
  branchId?: string,
  status?: string,
): Promise<Test[]> {
  return testsApi.getTests({ projectId, branchId, status });
}

export function getTest(testId: string): Promise<Test> {
  return testsApi.getTest(testId);
}

export function getTestMetrics(testId: string): Promise<TestMetrics> {
  return testsApi.getTestMetrics(testId);
}
