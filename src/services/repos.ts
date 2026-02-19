import * as reposApi from "../api/repos.ts";
import type {
  BulkGroupImportJobStatus,
  BulkGroupImportUpdateResponse,
  BulkRepoImportGroupStatus,
  GroupMappingStatus,
  GroupsSettings,
  RepositoryBranch,
  ScmGroup,
  ScmProject,
  ScmProviderInfo,
  ScmRemoteRepository,
  ScmRepository,
  ScmRepositoryCreateResponse,
  ScmRepositoryPatchResponse,
  ScmRepositoryTestConnectionResponse,
  ScmRepositoryWithBranch,
  TestSettingsResponse,
} from "../types/polaris.ts";

// --- Repositories ---

export interface GetScmRepositoriesOptions {
  filter?: string;
}

export function getScmRepositories(
  options?: GetScmRepositoriesOptions,
): Promise<ScmRepository[]> {
  return reposApi.getRepositories(options);
}

export interface CreateScmRepositoryOptions {
  projectId: string;
  repositoryUrl: string;
  scmProvider: string;
  applicationId?: string;
  authName?: string;
  authMode?: string;
  authToken?: string;
  authEmail?: string;
}

export function createScmRepository(
  options: CreateScmRepositoryOptions,
): Promise<ScmRepositoryCreateResponse> {
  const scmAuthentication: reposApi.ScmAuthentication | undefined =
    options.authName || options.authMode || options.authToken || options.authEmail
      ? {
        name: options.authName,
        authenticationMode: options.authMode,
        authToken: options.authToken,
        email: options.authEmail,
      }
      : undefined;
  return reposApi.createRepository({
    projectId: options.projectId,
    repositoryUrl: options.repositoryUrl,
    scmProvider: options.scmProvider,
    applicationId: options.applicationId,
    scmAuthentication,
  });
}

export interface GetScmRepositoryOptions {
  repoId: string;
  include?: string;
}

export function getScmRepository(
  options: GetScmRepositoryOptions,
): Promise<ScmRepositoryWithBranch> {
  return reposApi.getRepository(options.repoId, { include: options.include });
}

export interface UpdateScmRepositoryOptions {
  repoId: string;
  projectId?: string;
  applicationId?: string;
  repositoryUrl?: string;
  scmProvider?: string;
}

export function updateScmRepository(
  options: UpdateScmRepositoryOptions,
): Promise<ScmRepositoryPatchResponse> {
  return reposApi.updateRepository(options);
}

export interface TestScmRepoConnectionOptions {
  projectId: string;
  repositoryUrl: string;
  scmProvider: string;
}

export function testScmRepoConnection(
  options: TestScmRepoConnectionOptions,
): Promise<ScmRepositoryTestConnectionResponse> {
  return reposApi.testRepoConnection(options);
}

export interface GetScmRepositoryBranchesOptions {
  repoId: string;
}

export function getScmRepositoryBranches(
  options: GetScmRepositoryBranchesOptions,
): Promise<RepositoryBranch[]> {
  return reposApi.getRepositoryBranches(options);
}

// --- Providers ---

export function getScmProviders(): Promise<ScmProviderInfo[]> {
  return reposApi.getProviders();
}

// --- SCM Connection ---

export interface TestScmProviderConnectionOptions {
  scmProvider: string;
  scmPat: string;
  scmEmail?: string;
}

export function testScmProviderConnection(
  options: TestScmProviderConnectionOptions,
): Promise<unknown> {
  return reposApi.testScmConnection(options);
}

// --- SCM Groups ---

export interface GetScmProviderGroupsOptions {
  scmProvider: string;
  scmPat: string;
  scmEmail?: string;
  topLevelOnly?: boolean;
}

export function getScmProviderGroups(options: GetScmProviderGroupsOptions): Promise<ScmGroup[]> {
  return reposApi.getScmGroups(options);
}

// --- SCM Remote Repos ---

export interface GetScmProviderRepositoriesOptions {
  scmPat: string;
  scmProvider?: string;
  groupName?: string;
  projectName?: string;
  repoSearchTerm?: string;
  includeSubGroups?: boolean;
  scmEmail?: string;
}

export function getScmProviderRepositories(
  options: GetScmProviderRepositoriesOptions,
): Promise<ScmRemoteRepository[]> {
  return reposApi.getScmRemoteRepos(options);
}

// --- SCM Projects ---

export interface GetScmProviderProjectsOptions {
  groupName: string;
  scmPat: string;
  scmProvider?: string;
}

export function getScmProviderProjects(
  options: GetScmProviderProjectsOptions,
): Promise<ScmProject[]> {
  return reposApi.getScmProjects(options);
}

// --- Group Auth ---

export interface CreateScmGroupAuthOptions {
  applicationId: string;
  scmProvider: string;
  authName?: string;
  authMode?: string;
  authToken?: string;
  authEmail?: string;
  groupUrl?: string;
}

export function createScmGroupAuth(options: CreateScmGroupAuthOptions): Promise<void> {
  const scmAuthentication: reposApi.ScmAuthentication | undefined =
    options.authName || options.authMode || options.authToken || options.authEmail
      ? {
        name: options.authName,
        authenticationMode: options.authMode,
        authToken: options.authToken,
        email: options.authEmail,
      }
      : undefined;
  return reposApi.createGroupAuth({
    applicationId: options.applicationId,
    scmProvider: options.scmProvider,
    scmAuthentication,
    groupUrl: options.groupUrl,
  });
}

// --- Bulk Repo Import ---

export interface BulkImportReposOptions {
  applicationId: string;
  scmProvider: string;
  scmPat: string;
  scmEmail?: string;
  policySettings?: reposApi.PolicySettings;
  repositories?: reposApi.RepositorySelection[];
}

export function bulkImportRepos(
  options: BulkImportReposOptions,
): Promise<{ location: string }> {
  return reposApi.importReposForGroup(options);
}

export interface GetBulkRepoImportGroupsStatusOptions {
  filter?: string;
}

export function getBulkRepoImportGroupsStatus(
  options?: GetBulkRepoImportGroupsStatusOptions,
): Promise<BulkRepoImportGroupStatus[]> {
  return reposApi.getRepoImportGroupsStatus(options);
}

// --- Bulk Group Import ---

export interface BulkImportGroupsOptions {
  scmProvider: string;
  scmPat: string;
  scmEmail?: string;
  automaticMapping?: boolean;
  policySettings?: reposApi.PolicySettings;
  repositorySelections?: reposApi.GroupRepositorySelection[];
}

export function bulkImportGroups(
  options: BulkImportGroupsOptions,
): Promise<{ location: string }> {
  return reposApi.importGroupsRepos({
    scmProvider: options.scmProvider,
    scmPat: options.scmPat,
    scmEmail: options.scmEmail,
    automaticMapping: options.automaticMapping,
    policySettings: options.policySettings,
    repositorySelections: options.repositorySelections,
  });
}

export interface AbortGroupImportJobOptions {
  jobId: string;
}

export function abortGroupImportJob(
  options: AbortGroupImportJobOptions,
): Promise<BulkGroupImportUpdateResponse> {
  return reposApi.updateGroupImportJob({ jobId: options.jobId, action: "ABORT" });
}

export function getGroupImportJobStatus(jobId: string): Promise<BulkGroupImportJobStatus> {
  return reposApi.getGroupImportJobStatus(jobId);
}

export interface GetAllGroupImportStatusesOptions {
  filter?: string;
}

export function getAllGroupImportStatuses(
  options?: GetAllGroupImportStatusesOptions,
): Promise<BulkGroupImportJobStatus[]> {
  return reposApi.getAllGroupImportStatuses(options);
}

// --- Groups Settings ---

export interface UpdateScmGroupSettingsOptions {
  applicationId: string;
  importNewRepositories?: boolean;
  syncReposAndBranches?: boolean;
  automaticallyTestCodeChanges?: boolean;
  importNewBranches?: boolean;
  branchNameExpressions?: string[];
}

export function updateScmGroupSettings(options: UpdateScmGroupSettingsOptions): Promise<void> {
  const repository: reposApi.RepositorySubSettings = {};
  if (options.importNewRepositories !== undefined) {
    repository.importNewRepositories = options.importNewRepositories;
  }
  if (options.syncReposAndBranches !== undefined) {
    repository.syncReposAndBranches = options.syncReposAndBranches;
  }
  if (options.automaticallyTestCodeChanges !== undefined) {
    repository.automaticallyTestCodeChanges = options.automaticallyTestCodeChanges;
  }
  const branch: reposApi.BranchSubSettings = {};
  if (options.importNewBranches !== undefined) {
    branch.importNewBranches = options.importNewBranches;
  }
  if (options.branchNameExpressions !== undefined) {
    branch.branchNameExpressions = options.branchNameExpressions;
  }
  const hasRepository = Object.keys(repository).length > 0;
  const hasBranch = Object.keys(branch).length > 0;
  const settings = hasRepository || hasBranch
    ? {
      ...(hasRepository ? { repository } : {}),
      ...(hasBranch ? { branch } : {}),
    }
    : undefined;
  return reposApi.updateGroupSettings({
    applicationId: options.applicationId,
    settings,
  });
}

export interface GetScmGroupSettingsOptions {
  filter?: string;
}

export function getScmGroupSettings(
  options?: GetScmGroupSettingsOptions,
): Promise<GroupsSettings[]> {
  return reposApi.getGroupSettings(options);
}

export interface TestScmGroupConnectionOptions {
  repositoryUrl: string;
  scmProvider: string;
  scmPat: string;
  email?: string;
}

export function testScmGroupConnection(options: TestScmGroupConnectionOptions): Promise<void> {
  return reposApi.testGroupConnection(options);
}

export interface GetScmGroupMappingStatusOptions {
  applicationId: string;
  projectId?: string;
}

export function getScmGroupMappingStatus(
  options: GetScmGroupMappingStatusOptions,
): Promise<GroupMappingStatus[]> {
  return reposApi.getGroupMappingStatus(options);
}

// --- Test Settings ---

export interface CreateScmTestSettingsOptions {
  scope: "organization" | "application" | "project" | "branch";
  scopeId: string;
  pullRequestMergedDefault?: boolean;
  assessmentTypesDefault?: string[];
  pullRequestMergedNonDefault?: boolean;
  assessmentTypesNonDefault?: string[];
}

export function createScmTestSettings(options: CreateScmTestSettingsOptions): Promise<void> {
  const hasDefault = options.pullRequestMergedDefault !== undefined ||
    (options.assessmentTypesDefault && options.assessmentTypesDefault.length > 0);
  const hasNonDefault = options.pullRequestMergedNonDefault !== undefined ||
    (options.assessmentTypesNonDefault && options.assessmentTypesNonDefault.length > 0);

  const defaultSettings: Record<string, unknown> = {};
  if (options.pullRequestMergedDefault !== undefined) {
    defaultSettings.pullRequestMerged = options.pullRequestMergedDefault;
  }
  if (options.assessmentTypesDefault && options.assessmentTypesDefault.length > 0) {
    defaultSettings.assessmentTypes = options.assessmentTypesDefault;
  }

  const nonDefaultSettings: Record<string, unknown> = {};
  if (options.pullRequestMergedNonDefault !== undefined) {
    nonDefaultSettings.pullRequestMerged = options.pullRequestMergedNonDefault;
  }
  if (options.assessmentTypesNonDefault && options.assessmentTypesNonDefault.length > 0) {
    nonDefaultSettings.assessmentTypes = options.assessmentTypesNonDefault;
  }

  const branchSettings: Record<string, unknown> = {};
  if (hasDefault) branchSettings.default = defaultSettings;
  if (hasNonDefault) branchSettings.nonDefault = nonDefaultSettings;

  const testSyncSettings = hasDefault || hasNonDefault ? { branch: branchSettings } : undefined;

  return reposApi.createTestSettings({
    scope: options.scope,
    scopeId: options.scopeId,
    testSyncSettings: testSyncSettings as reposApi.CreateTestSettingsParams["testSyncSettings"],
  });
}

export interface GetScmTestSettingsOptions {
  scopeId: string;
  scope: string;
}

export function getScmTestSettings(
  options: GetScmTestSettingsOptions,
): Promise<TestSettingsResponse> {
  return reposApi.getTestSettings(options);
}

export interface DeleteScmTestSettingsOptions {
  scopeId: string;
  scope: string;
}

export function deleteScmTestSettings(options: DeleteScmTestSettingsOptions): Promise<void> {
  return reposApi.deleteTestSettings(options);
}
