import { getClient } from "./client.ts";
import type {
  RepositoryBranch,
  ScmRepository,
  ScmRepositoryCreateResponse,
  ScmRepositoryPatchResponse,
  ScmRepositoryTestConnectionResponse,
  ScmRepositoryWithBranch,
} from "../types/polaris.ts";

// --- Media Type Constants ---

export const ACCEPT_REPO_LIST =
  "application/vnd.polaris.integrations.repos.repo-list-1+json;charset=UTF-8";
export const ACCEPT_REPO = "application/vnd.polaris.integrations.repos.repo-1+json;charset=UTF-8";
export const ACCEPT_REPO_CREATE =
  "application/vnd.polaris.integrations.repos.repo-create-1+json;charset=UTF-8";
export const ACCEPT_REPO_UPDATE =
  "application/vnd.polaris.integrations.repos.repo-update-1+json;charset=UTF-8";
export const ACCEPT_REPO_CONNECTION =
  "application/vnd.polaris.integrations.repos.repo-connection-1+json;charset=UTF-8";
export const ACCEPT_CONNECTION_REQUEST =
  "application/vnd.polaris.integrations.repos.connection-request-1+json;charset=UTF-8";
export const ACCEPT_BRANCH_LIST =
  "application/vnd.polaris.integrations.repos.repo-branch-list-1+json;charset=UTF-8";
export const ACCEPT_GROUPS_AUTH =
  "application/vnd.polaris.integrations.repos.scm.groups-auth-1+json;charset=UTF-8";
export const ACCEPT_PROVIDERS_LIST = "application/vnd.scm.providers-list-1+json;charset=UTF-8";
export const ACCEPT_BULK_REPO_IMPORT =
  "application/vnd.polaris.integrations.repos.bulk-repo-import-1+json;charset=UTF-8";
export const ACCEPT_BULK_REPO_IMPORT_GROUPS_STATUS =
  "application/vnd.polaris.integrations.repos.bulk-repo-import-groups-status-1+json;charset=UTF-8";
export const ACCEPT_BULK_GROUP_IMPORT =
  "application/vnd.polaris.integrations.repos.bulk-group-import-1+json;charset=UTF-8";
export const ACCEPT_BULK_GROUP_IMPORT_STATUS =
  "application/vnd.polaris.integrations.repos.bulk-group-import-status-1+json;charset=UTF-8";
export const ACCEPT_SCM_CONNECTION =
  "application/vnd.polaris.integrations.repos.scm.repo-connection-1+json;charset=UTF-8";
export const ACCEPT_SCM_GROUPS =
  "application/vnd.polaris.integrations.repos.scm.group-list-1+json;charset=UTF-8";
export const ACCEPT_SCM_REPOS =
  "application/vnd.polaris.integrations.repos.scm.repo-list-1+json;charset=UTF-8";
export const ACCEPT_SCM_PROJECTS =
  "application/vnd.polaris.integrations.repos.scm.project-list-1+json;charset=UTF-8";
export const ACCEPT_GROUPS_SETTINGS_UPDATE =
  "application/vnd.polaris.integrations.repos.groups-settings-update-1+json;charset=UTF-8";
export const ACCEPT_GROUPS_SETTINGS =
  "application/vnd.polaris.integrations.repos.groups-settings-1+json;charset=UTF-8";
export const ACCEPT_GROUP_CONNECTION_REQUEST =
  "application/vnd.polaris.integrations.repos.groups-connection-request-1+json;charset=UTF-8";
export const ACCEPT_GROUP_MAPPING_STATUS =
  "application/vnd.polaris.integrations.repos.group-mapping-status-1+json";
export const ACCEPT_TEST_SETTINGS_CREATE =
  "application/vnd.polaris.integrations.repos.test-settings-create-1+json;charset=UTF-8";
export const ACCEPT_TEST_SETTINGS = "application/vnd.polaris.integrations.repos.test-settings+json";

// --- Repositories ---

export interface GetRepositoriesParams {
  filter?: string;
}

export function getRepositories(params?: GetRepositoriesParams): Promise<ScmRepository[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  return client.getAllOffset<ScmRepository>(
    "/api/integrations/repos",
    queryParams,
    ACCEPT_REPO_LIST,
  );
}

export interface ScmAuthentication {
  name?: string;
  authenticationMode?: string;
  authToken?: string;
  email?: string;
}

export interface CreateRepositoryParams {
  projectId: string;
  repositoryUrl: string;
  scmProvider: string;
  applicationId?: string;
  scmAuthentication?: ScmAuthentication;
}

export function createRepository(
  params: CreateRepositoryParams,
): Promise<ScmRepositoryCreateResponse> {
  const client = getClient();
  const body: Record<string, unknown> = {
    projectId: params.projectId,
    repositoryUrl: params.repositoryUrl,
    scmProvider: params.scmProvider,
  };
  if (params.applicationId) body.applicationId = params.applicationId;
  if (params.scmAuthentication) body.scmAuthentication = params.scmAuthentication;
  return client.fetch<ScmRepositoryCreateResponse>("/api/integrations/repos", {
    method: "POST",
    body,
    accept: ACCEPT_REPO,
    contentType: ACCEPT_REPO_CREATE,
  });
}

export interface GetRepositoryParams {
  include?: string;
}

export function getRepository(
  repoId: string,
  params?: GetRepositoryParams,
): Promise<ScmRepositoryWithBranch> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params?.include) queryParams._include = params.include;
  return client.get<ScmRepositoryWithBranch>(
    `/api/integrations/repos/${repoId}`,
    queryParams,
    ACCEPT_REPO,
  );
}

export interface UpdateRepositoryParams {
  repoId: string;
  projectId?: string;
  applicationId?: string;
  repositoryUrl?: string;
  scmProvider?: string;
  scmAuthentication?: ScmAuthentication;
}

export function updateRepository(
  params: UpdateRepositoryParams,
): Promise<ScmRepositoryPatchResponse> {
  const client = getClient();
  const body: Record<string, unknown> = {};
  if (params.projectId) body.projectId = params.projectId;
  if (params.applicationId) body.applicationId = params.applicationId;
  if (params.repositoryUrl) body.repositoryUrl = params.repositoryUrl;
  if (params.scmProvider) body.scmProvider = params.scmProvider;
  if (params.scmAuthentication) body.scmAuthentication = params.scmAuthentication;
  return client.fetch<ScmRepositoryPatchResponse>(`/api/integrations/repos/${params.repoId}`, {
    method: "PATCH",
    body,
    accept: ACCEPT_REPO,
    contentType: ACCEPT_REPO_UPDATE,
  });
}

export interface TestRepoConnectionParams {
  projectId: string;
  repositoryUrl: string;
  scmProvider: string;
  applicationId?: string;
  scmAuthentication?: ScmAuthentication;
}

export function testRepoConnection(
  params: TestRepoConnectionParams,
): Promise<ScmRepositoryTestConnectionResponse> {
  const client = getClient();
  const body: Record<string, unknown> = {
    projectId: params.projectId,
    repositoryUrl: params.repositoryUrl,
    scmProvider: params.scmProvider,
  };
  if (params.applicationId) body.applicationId = params.applicationId;
  if (params.scmAuthentication) body.scmAuthentication = params.scmAuthentication;
  return client.fetch<ScmRepositoryTestConnectionResponse>(
    "/api/integrations/repos/test-connection",
    {
      method: "POST",
      body,
      accept: ACCEPT_REPO_CONNECTION,
      contentType: ACCEPT_CONNECTION_REQUEST,
    },
  );
}

export interface GetRepositoryBranchesParams {
  repoId: string;
}

export function getRepositoryBranches(
  params: GetRepositoryBranchesParams,
): Promise<RepositoryBranch[]> {
  const client = getClient();
  return client.getAllOffset<RepositoryBranch>(
    `/api/integrations/repos/${params.repoId}/branches`,
    undefined,
    ACCEPT_BRANCH_LIST,
  );
}
