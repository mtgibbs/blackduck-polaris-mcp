import * as testsApi from "../api/tests.ts";
import type {
  CreateTestRequest,
  Test,
  TestAction,
  TestArtifactMetadata,
  TestComment,
  TestMetrics,
  TestProfile,
  UpdateTestRequest,
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

export interface CreateTestOptions {
  projectId: string;
  branchId?: string;
  assessmentTypes: string[];
  testMode?: string;
  scanMode?: string;
  artifacts?: string[];
  notes?: string;
  triage?: string;
  profileDetails?: {
    id?: string;
    content?: string;
  };
}

export function createTest(
  options: CreateTestOptions,
): Promise<testsApi.CreateTestResponse> {
  const body: CreateTestRequest = {
    projectId: options.projectId,
    branchId: options.branchId,
    assessmentTypes: options.assessmentTypes,
    testMode: options.testMode,
    scanMode: options.scanMode,
    artifacts: options.artifacts,
    notes: options.notes,
    triage: options.triage,
    profileDetails: options.profileDetails,
  };
  return testsApi.createTest(body);
}

export interface UpdateTestOptions {
  testId: string;
  action: TestAction;
  artifacts?: string[];
  toolId?: string;
  notes?: string;
}

export function updateTest(options: UpdateTestOptions): Promise<Test> {
  const body: UpdateTestRequest = {
    action: options.action,
    artifacts: options.artifacts,
    toolId: options.toolId,
    notes: options.notes,
  };
  return testsApi.updateTest(options.testId, body);
}
