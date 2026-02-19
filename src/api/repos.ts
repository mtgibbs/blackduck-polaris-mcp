import { getClient } from "./client.ts";
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

// --- Providers ---

export function getProviders(): Promise<ScmProviderInfo[]> {
  const client = getClient();
  return client.getAllOffset<ScmProviderInfo>(
    "/api/integrations/repos/providers",
    undefined,
    ACCEPT_PROVIDERS_LIST,
  );
}

// --- SCM Connection ---

export interface TestScmConnectionParams {
  scmProvider: string;
  scmPat: string;
  scmEmail?: string;
}

export function testScmConnection(params: TestScmConnectionParams): Promise<unknown> {
  const client = getClient();
  const headers: Record<string, string> = {
    "X-Polaris-SCM-PAT": params.scmPat,
  };
  if (params.scmEmail) headers["X-Polaris-SCM-Email"] = params.scmEmail;
  return client.fetch<unknown>("/api/integrations/repos/scm/test-connection", {
    method: "GET",
    params: { scmProvider: params.scmProvider },
    accept: ACCEPT_SCM_CONNECTION,
    headers,
  });
}

// --- SCM Groups ---

export interface GetScmGroupsParams {
  scmProvider: string;
  scmPat: string;
  scmEmail?: string;
  topLevelOnly?: boolean;
  cursor?: string;
  limit?: number;
}

export function getScmGroups(params: GetScmGroupsParams): Promise<ScmGroup[]> {
  const client = getClient();
  const headers: Record<string, string> = {
    "X-Polaris-SCM-PAT": params.scmPat,
  };
  if (params.scmEmail) headers["X-Polaris-SCM-Email"] = params.scmEmail;
  const queryParams: Record<string, string | number | boolean | undefined> = {
    scmProvider: params.scmProvider,
  };
  if (params.topLevelOnly !== undefined) queryParams.topLevelOnly = params.topLevelOnly;
  if (params.cursor) queryParams._cursor = params.cursor;
  if (params.limit) queryParams._limit = params.limit;
  return client.fetch<ScmGroup[]>("/api/integrations/repos/scm/groups", {
    method: "GET",
    params: queryParams,
    accept: ACCEPT_SCM_GROUPS,
    headers,
  });
}

// --- SCM Remote Repos ---

export interface GetScmRemoteReposParams {
  scmPat: string;
  scmProvider?: string;
  groupName?: string;
  projectName?: string;
  repoSearchTerm?: string;
  includeSubGroups?: boolean;
  scmEmail?: string;
  cursor?: string;
  limit?: number;
}

export function getScmRemoteRepos(params: GetScmRemoteReposParams): Promise<ScmRemoteRepository[]> {
  const client = getClient();
  const headers: Record<string, string> = {
    "X-Polaris-SCM-PAT": params.scmPat,
  };
  if (params.scmEmail) headers["X-Polaris-SCM-Email"] = params.scmEmail;
  const queryParams: Record<string, string | number | boolean | undefined> = {};
  if (params.scmProvider) queryParams.scmProvider = params.scmProvider;
  if (params.groupName) queryParams.groupName = params.groupName;
  if (params.projectName) queryParams.projectName = params.projectName;
  if (params.repoSearchTerm) queryParams.repoSearchTerm = params.repoSearchTerm;
  if (params.includeSubGroups !== undefined) queryParams.includeSubGroups = params.includeSubGroups;
  if (params.cursor) queryParams._cursor = params.cursor;
  if (params.limit) queryParams._limit = params.limit;
  return client.fetch<ScmRemoteRepository[]>("/api/integrations/repos/scm", {
    method: "GET",
    params: queryParams,
    accept: ACCEPT_SCM_REPOS,
    headers,
  });
}

// --- SCM Projects ---

export interface GetScmProjectsParams {
  groupName: string;
  scmPat: string;
  scmProvider?: string;
  cursor?: string;
  limit?: number;
}

export function getScmProjects(params: GetScmProjectsParams): Promise<ScmProject[]> {
  const client = getClient();
  const headers: Record<string, string> = {
    "X-Polaris-SCM-PAT": params.scmPat,
  };
  const queryParams: Record<string, string | number | boolean | undefined> = {};
  if (params.scmProvider) queryParams.scmProvider = params.scmProvider;
  if (params.cursor) queryParams._cursor = params.cursor;
  if (params.limit) queryParams._limit = params.limit;
  return client.fetch<ScmProject[]>(
    `/api/integrations/repos/scm/groups/${params.groupName}/projects`,
    {
      method: "GET",
      params: queryParams,
      accept: ACCEPT_SCM_PROJECTS,
      headers,
    },
  );
}

// --- Group Auth ---

export interface CreateGroupAuthParams {
  applicationId: string;
  scmProvider: string;
  scmAuthentication?: ScmAuthentication;
  groupUrl?: string;
}

export function createGroupAuth(params: CreateGroupAuthParams): Promise<void> {
  const client = getClient();
  const body: Record<string, unknown> = {
    applicationId: params.applicationId,
    scmProvider: params.scmProvider,
  };
  if (params.scmAuthentication) body.scmAuthentication = params.scmAuthentication;
  if (params.groupUrl) body.groupUrl = params.groupUrl;
  return client.fetch<void>("/api/integrations/repos/scm/groups/auth", {
    method: "POST",
    body,
    accept: ACCEPT_GROUPS_AUTH,
    contentType: ACCEPT_GROUPS_AUTH,
  });
}

// --- Bulk Repo Import ---

export interface RepositorySelection {
  groupName: string;
  allRepositoriesInGroup: boolean;
  includeRepositories?: string[];
  excludeRepositories?: string[];
}

export interface PolicySettings {
  issuePolicyIds?: string[];
  scanPolicyIds?: string[];
}

export interface ImportReposForGroupParams {
  applicationId: string;
  scmProvider: string;
  scmPat: string;
  scmEmail?: string;
  policySettings?: PolicySettings;
  repositories?: RepositorySelection[];
}

export async function importReposForGroup(
  params: ImportReposForGroupParams,
): Promise<{ location: string }> {
  const client = getClient();
  const headers: Record<string, string> = {
    "X-Polaris-SCM-PAT": params.scmPat,
  };
  if (params.scmEmail) headers["X-Polaris-SCM-Email"] = params.scmEmail;
  const body: Record<string, unknown> = {
    applicationId: params.applicationId,
    scmProvider: params.scmProvider,
  };
  if (params.policySettings) body.policySettings = params.policySettings;
  if (params.repositories) body.repositories = params.repositories;
  const location = await client.fetchLocation("/api/integrations/repos/bulk-repo-import", {
    method: "POST",
    body,
    accept: ACCEPT_BULK_REPO_IMPORT,
    contentType: ACCEPT_BULK_REPO_IMPORT,
    headers,
  });
  return { location };
}

export interface GetRepoImportGroupsStatusParams {
  filter?: string;
}

export function getRepoImportGroupsStatus(
  params?: GetRepoImportGroupsStatusParams,
): Promise<BulkRepoImportGroupStatus[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  return client.getAllOffset<BulkRepoImportGroupStatus>(
    "/api/integrations/repos/bulk-repo-import/groups/status",
    queryParams,
    ACCEPT_BULK_REPO_IMPORT_GROUPS_STATUS,
  );
}

// --- Bulk Group Import ---

export interface RoleUserMapping {
  roleId: string;
  userId: string;
}

export interface GroupRepositorySelection {
  applicationName?: string;
  applicationNameTemplate?: string;
  repositories?: RepositorySelection[];
  nestedRepositories?: RepositorySelection[];
}

export interface ImportGroupsReposParams {
  scmProvider: string;
  scmPat: string;
  scmEmail?: string;
  automaticMapping?: boolean;
  policySettings?: PolicySettings;
  roleUsersMappings?: RoleUserMapping[];
  repositorySelections?: GroupRepositorySelection[];
}

export async function importGroupsRepos(
  params: ImportGroupsReposParams,
): Promise<{ location: string }> {
  const client = getClient();
  const headers: Record<string, string> = {
    "X-Polaris-SCM-PAT": params.scmPat,
  };
  if (params.scmEmail) headers["X-Polaris-SCM-Email"] = params.scmEmail;
  const body: Record<string, unknown> = {
    scmProvider: params.scmProvider,
  };
  if (params.automaticMapping !== undefined) body.automaticMapping = params.automaticMapping;
  if (params.policySettings) body.policySettings = params.policySettings;
  if (params.roleUsersMappings) body.roleUsersMappings = params.roleUsersMappings;
  if (params.repositorySelections) body.repositorySelections = params.repositorySelections;
  const location = await client.fetchLocation("/api/integrations/repos/bulk-group-import", {
    method: "POST",
    body,
    accept: ACCEPT_BULK_GROUP_IMPORT,
    contentType: ACCEPT_BULK_GROUP_IMPORT,
    headers,
  });
  return { location };
}

export interface UpdateGroupImportJobParams {
  jobId: string;
  action: string;
}

export function updateGroupImportJob(
  params: UpdateGroupImportJobParams,
): Promise<BulkGroupImportUpdateResponse> {
  const client = getClient();
  return client.fetch<BulkGroupImportUpdateResponse>(
    `/api/integrations/repos/bulk-group-import/${params.jobId}`,
    {
      method: "PATCH",
      body: { action: params.action },
      accept: ACCEPT_BULK_GROUP_IMPORT,
      contentType: ACCEPT_BULK_GROUP_IMPORT,
    },
  );
}

export function getGroupImportJobStatus(jobId: string): Promise<BulkGroupImportJobStatus> {
  const client = getClient();
  return client.get<BulkGroupImportJobStatus>(
    `/api/integrations/repos/bulk-group-import/${jobId}/status`,
    undefined,
    ACCEPT_BULK_GROUP_IMPORT_STATUS,
  );
}

export interface GetAllGroupImportStatusesParams {
  filter?: string;
}

export function getAllGroupImportStatuses(
  params?: GetAllGroupImportStatusesParams,
): Promise<BulkGroupImportJobStatus[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  return client.getAllOffset<BulkGroupImportJobStatus>(
    "/api/integrations/repos/bulk-group-import/status",
    queryParams,
    ACCEPT_BULK_GROUP_IMPORT_STATUS,
  );
}

// --- Groups Settings ---

export interface RepositorySubSettings {
  importNewRepositories?: boolean;
  syncReposAndBranches?: boolean;
  automaticallyTestCodeChanges?: boolean;
}

export interface BranchSubSettings {
  importNewBranches?: boolean;
  branchNameExpressions?: string[];
}

export interface UpdateGroupSettingsParams {
  applicationId: string;
  settings?: {
    repository?: RepositorySubSettings;
    branch?: BranchSubSettings;
  };
}

export function updateGroupSettings(params: UpdateGroupSettingsParams): Promise<void> {
  const client = getClient();
  const body: Record<string, unknown> = {
    applicationId: params.applicationId,
  };
  if (params.settings) body.settings = params.settings;
  return client.fetch<void>("/api/integrations/repos/groups-settings", {
    method: "PATCH",
    body,
    contentType: ACCEPT_GROUPS_SETTINGS_UPDATE,
  });
}

export interface GetGroupSettingsParams {
  filter?: string;
}

export function getGroupSettings(params?: GetGroupSettingsParams): Promise<GroupsSettings[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  return client.getAllOffset<GroupsSettings>(
    "/api/integrations/repos/groups-settings",
    queryParams,
    ACCEPT_GROUPS_SETTINGS,
  );
}

export interface TestGroupConnectionParams {
  repositoryUrl: string;
  scmProvider: string;
  scmPat: string;
  email?: string;
}

export function testGroupConnection(params: TestGroupConnectionParams): Promise<void> {
  const client = getClient();
  const headers: Record<string, string> = {
    "X-Polaris-SCM-PAT": params.scmPat,
  };
  const body: Record<string, unknown> = {
    repositoryUrl: params.repositoryUrl,
    scmProvider: params.scmProvider,
  };
  if (params.email) body.email = params.email;
  return client.fetch<void>("/api/integrations/repos/groups-settings/connection", {
    method: "POST",
    body,
    contentType: ACCEPT_GROUP_CONNECTION_REQUEST,
    headers,
  });
}

export interface GetGroupMappingStatusParams {
  applicationId: string;
  projectId?: string;
}

export function getGroupMappingStatus(
  params: GetGroupMappingStatusParams,
): Promise<GroupMappingStatus[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {
    applicationId: params.applicationId,
  };
  if (params.projectId) queryParams.projectId = params.projectId;
  return client.getAllOffset<GroupMappingStatus>(
    "/api/integrations/repos/group-mapping-status",
    queryParams,
    ACCEPT_GROUP_MAPPING_STATUS,
  );
}

// --- Test Settings ---

export interface CreateTestSettingsParams {
  scope: "organization" | "application" | "project" | "branch";
  scopeId: string;
  testSyncSettings?: {
    branch?: {
      default?: {
        pullRequestMerged?: boolean;
        assessmentTypes?: string[];
      };
      nonDefault?: {
        pullRequestMerged?: boolean;
        assessmentTypes?: string[];
      };
    };
  };
}

export function createTestSettings(params: CreateTestSettingsParams): Promise<void> {
  const client = getClient();
  const body: Record<string, unknown> = {
    scope: params.scope,
    scopeId: params.scopeId,
  };
  if (params.testSyncSettings) body.testSyncSettings = params.testSyncSettings;
  return client.fetch<void>("/api/integrations/repos/test-settings", {
    method: "POST",
    body,
    contentType: ACCEPT_TEST_SETTINGS_CREATE,
  });
}

export interface GetTestSettingsParams {
  scopeId: string;
  scope: string;
}

export function getTestSettings(params: GetTestSettingsParams): Promise<TestSettingsResponse> {
  const client = getClient();
  return client.get<TestSettingsResponse>(
    `/api/integrations/repos/test-settings/${params.scopeId}`,
    { scope: params.scope },
    ACCEPT_TEST_SETTINGS,
  );
}

export interface DeleteTestSettingsParams {
  scopeId: string;
  scope: string;
}

export function deleteTestSettings(params: DeleteTestSettingsParams): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/integrations/repos/test-settings/${params.scopeId}`,
    {
      method: "DELETE",
      params: { scope: params.scope },
    },
  );
}
