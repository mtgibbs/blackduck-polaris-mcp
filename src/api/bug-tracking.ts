import { getClient } from "./client.ts";
import type {
  BugTrackingConfiguration,
  CreateBugTrackingConfigRequest,
  CreateProjectMappingRequest,
  ExportCommentRequest,
  ExternalIssueType,
  ExternalProject,
  LinkedIssue,
  ProjectMapping,
  TestConnectionResult,
  UpdateBugTrackingConfigRequest,
  UpdateProjectMappingRequest,
} from "../types/polaris.ts";

const ACCEPT = "application/vnd.polaris.bugtracking.configuration-1+json";

// --- Configurations ---

export interface GetConfigurationsParams {
  filter?: string;
}

export function getConfigurations(
  params?: GetConfigurationsParams,
): Promise<BugTrackingConfiguration[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  return client.getAllOffset<BugTrackingConfiguration>(
    "/api/integrations/bugtracking/configurations",
    queryParams,
    ACCEPT,
  );
}

export function getConfiguration(id: string): Promise<BugTrackingConfiguration> {
  const client = getClient();
  return client.get<BugTrackingConfiguration>(
    `/api/integrations/bugtracking/configurations/${id}`,
    undefined,
    ACCEPT,
  );
}

export function createConfiguration(
  system: string,
  body: CreateBugTrackingConfigRequest,
): Promise<BugTrackingConfiguration> {
  const client = getClient();
  return client.fetch<BugTrackingConfiguration>(
    "/api/integrations/bugtracking/configurations",
    {
      method: "POST",
      params: { system },
      body,
      accept: ACCEPT,
      contentType: ACCEPT,
    },
  );
}

export function updateConfiguration(
  id: string,
  body: UpdateBugTrackingConfigRequest,
): Promise<BugTrackingConfiguration> {
  const client = getClient();
  return client.fetch<BugTrackingConfiguration>(
    `/api/integrations/bugtracking/configurations/${id}`,
    {
      method: "PATCH",
      body,
      accept: ACCEPT,
      contentType: ACCEPT,
    },
  );
}

export function deleteConfiguration(id: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/integrations/bugtracking/configurations/${id}`,
    {
      method: "DELETE",
      accept: ACCEPT,
    },
  );
}

export function testConnection(id: string): Promise<TestConnectionResult> {
  const client = getClient();
  return client.fetch<TestConnectionResult>(
    `/api/integrations/bugtracking/configurations/${id}/connection`,
    {
      method: "POST",
      accept: ACCEPT,
      contentType: ACCEPT,
    },
  );
}

// --- External Projects ---

export interface GetExternalProjectsParams {
  configurationId: string;
  filter?: string;
}

export function getExternalProjects(
  params: GetExternalProjectsParams,
): Promise<ExternalProject[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  return client.getAllOffset<ExternalProject>(
    `/api/integrations/bugtracking/configurations/${params.configurationId}/projects`,
    queryParams,
    ACCEPT,
  );
}

export function getExternalProjectByKey(
  configurationId: string,
  projectKey: string,
): Promise<ExternalProject> {
  const client = getClient();
  return client.get<ExternalProject>(
    `/api/integrations/bugtracking/configurations/${configurationId}/projects/${projectKey}`,
    undefined,
    ACCEPT,
  );
}

// --- External Issue Types ---

export interface GetExternalIssueTypesParams {
  configurationId: string;
  projectKey: string;
}

export function getExternalIssueTypes(
  params: GetExternalIssueTypesParams,
): Promise<ExternalIssueType[]> {
  const client = getClient();
  return client.getAllOffset<ExternalIssueType>(
    `/api/integrations/bugtracking/configurations/${params.configurationId}/projects/${params.projectKey}/types`,
    undefined,
    ACCEPT,
  );
}

// --- Project Mappings ---

export interface GetProjectMappingsParams {
  filter?: string;
}

export function getProjectMappings(
  params?: GetProjectMappingsParams,
): Promise<ProjectMapping[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  return client.getAllOffset<ProjectMapping>(
    "/api/integrations/bugtracking/project-mappings",
    queryParams,
    ACCEPT,
  );
}

// --- Export / Linked Issues ---

export interface ExportIssueParams {
  configurationId: string;
  projectMappingId: string;
  issueFamilyId: string;
  btsIssueTypeId?: string;
  btsKey?: string;
  branchId?: string;
}

export function exportIssue(
  params: ExportIssueParams,
): Promise<LinkedIssue> {
  const client = getClient();

  const body: Record<string, unknown> = {
    projectMappingId: params.projectMappingId,
    issueFamilyId: params.issueFamilyId,
  };

  if (params.btsIssueTypeId) body.btsIssueTypeId = params.btsIssueTypeId;
  if (params.btsKey) body.btsKey = params.btsKey;
  if (params.branchId) body.branchId = params.branchId;

  return client.fetch<LinkedIssue>(
    `/api/integrations/bugtracking/configurations/${params.configurationId}/issues-export`,
    {
      method: "POST",
      body,
      accept: ACCEPT,
      contentType: ACCEPT,
    },
  );
}

export function getLinkedIssues(
  configurationId: string,
): Promise<LinkedIssue[]> {
  const client = getClient();
  return client.getAllOffset<LinkedIssue>(
    `/api/integrations/bugtracking/configurations/${configurationId}/issues-export`,
    undefined,
    ACCEPT,
  );
}

export function getLinkedIssue(
  configurationId: string,
  issueId: string,
): Promise<LinkedIssue> {
  const client = getClient();
  return client.get<LinkedIssue>(
    `/api/integrations/bugtracking/configurations/${configurationId}/issues-export/${issueId}`,
    undefined,
    ACCEPT,
  );
}

export function deleteIssueExport(configurationId: string, issueId: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/integrations/bugtracking/configurations/${configurationId}/issues-export/${issueId}`,
    {
      method: "DELETE",
      accept: ACCEPT,
    },
  );
}

export function addIssueExportComment(
  configurationId: string,
  issueId: string,
  body: ExportCommentRequest,
): Promise<unknown> {
  const client = getClient();
  return client.fetch<unknown>(
    `/api/integrations/bugtracking/configurations/${configurationId}/issues-export/${issueId}/comments`,
    {
      method: "POST",
      body,
      accept: ACCEPT,
      contentType: ACCEPT,
    },
  );
}

// --- Config-scoped Project Mappings ---

export function createConfigProjectMapping(
  configurationId: string,
  body: CreateProjectMappingRequest,
): Promise<ProjectMapping> {
  const client = getClient();
  return client.fetch<ProjectMapping>(
    `/api/integrations/bugtracking/configurations/${configurationId}/project-mappings`,
    {
      method: "POST",
      body,
      accept: ACCEPT,
      contentType: ACCEPT,
    },
  );
}

export function getConfigProjectMappings(configurationId: string): Promise<ProjectMapping[]> {
  const client = getClient();
  return client.getAllOffset<ProjectMapping>(
    `/api/integrations/bugtracking/configurations/${configurationId}/project-mappings`,
    undefined,
    ACCEPT,
  );
}

export function getConfigProjectMapping(
  configurationId: string,
  projectMappingId: string,
): Promise<ProjectMapping> {
  const client = getClient();
  return client.get<ProjectMapping>(
    `/api/integrations/bugtracking/configurations/${configurationId}/project-mappings/${projectMappingId}`,
    undefined,
    ACCEPT,
  );
}

export function updateConfigProjectMapping(
  configurationId: string,
  projectMappingId: string,
  body: UpdateProjectMappingRequest,
): Promise<ProjectMapping> {
  const client = getClient();
  return client.fetch<ProjectMapping>(
    `/api/integrations/bugtracking/configurations/${configurationId}/project-mappings/${projectMappingId}`,
    {
      method: "PATCH",
      body,
      accept: ACCEPT,
      contentType: ACCEPT,
    },
  );
}

export function deleteConfigProjectMapping(
  configurationId: string,
  projectMappingId: string,
): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/integrations/bugtracking/configurations/${configurationId}/project-mappings/${projectMappingId}`,
    {
      method: "DELETE",
      accept: ACCEPT,
    },
  );
}
