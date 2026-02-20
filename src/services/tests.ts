import * as testsApi from "../api/tests.ts";
import type {
  Test,
  TestArtifactMetadata,
  TestComment,
  TestMetrics,
  TestProfile,
} from "../types/polaris.ts";

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

export function getTestComments(
  options: { testId: string },
): Promise<TestComment[]> {
  return testsApi.getTestComments(options.testId);
}

export interface CreateArtifactOptions {
  fileName: string;
  fileHash: string;
  fileSize: string;
  entitlementId?: string;
  assessmentType?: string;
  artifactType: string;
  createdAt?: string;
}

export function createTestArtifact(
  options: CreateArtifactOptions,
): Promise<testsApi.CreateArtifactResponse> {
  return testsApi.createTestArtifact(options);
}

export function getTestArtifacts(
  options: { testId: string },
): Promise<TestArtifactMetadata[]> {
  return testsApi.getTestArtifacts(options.testId);
}

export function getTestArtifact(
  options: { testId: string; artifactId: string },
): Promise<testsApi.ArtifactDownloadInfo> {
  return testsApi.getTestArtifact(options.testId, options.artifactId);
}

export function getTestProfiles(
  options: { testId: string },
): Promise<TestProfile> {
  return testsApi.getTestProfiles(options.testId);
}
