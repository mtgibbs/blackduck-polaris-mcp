import * as reposApi from "../api/repos.ts";
import type {
  RepositoryBranch,
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
