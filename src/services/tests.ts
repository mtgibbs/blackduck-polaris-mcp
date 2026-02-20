import * as testsApi from "../api/tests.ts";
import type { Test, TestMetrics } from "../types/polaris.ts";

export interface GetTestsOptions {
  projectId?: string;
  branchId?: string;
  status?: string;
  filter?: string;
}

export function getTests(options?: GetTestsOptions): Promise<Test[]> {
  return testsApi.getTests(options || {});
}

export function getTest(testId: string): Promise<Test> {
  return testsApi.getTest(testId);
}

export function getTestMetrics(testId: string): Promise<TestMetrics> {
  return testsApi.getTestMetrics(testId);
}
