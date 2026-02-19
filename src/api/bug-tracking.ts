import { getClient } from "./client.ts";
import type {
  BugTrackingConfiguration,
  ExternalIssueType,
  ExternalProject,
  LinkedIssue,
  ProjectMapping,
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
