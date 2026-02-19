import * as reposApi from "../api/repos.ts";
import type {
  BulkRepoImportGroupStatus,
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
