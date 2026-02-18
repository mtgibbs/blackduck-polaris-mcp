import { getClient } from "./client.ts";
import type {
  BugTrackingConfiguration,
  ExternalIssueType,
  ExternalProject,
  IssueExportResult,
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
    `/api/integrations/bugtracking/configurations/${params.configurationId}/external-projects`,
    queryParams,
    ACCEPT,
  );
}

// --- External Issue Types ---

export interface GetExternalIssueTypesParams {
  configurationId: string;
  externalProjectKey: string;
}

export function getExternalIssueTypes(
  params: GetExternalIssueTypesParams,
): Promise<ExternalIssueType[]> {
  const client = getClient();
  return client.getAllOffset<ExternalIssueType>(
    `/api/integrations/bugtracking/configurations/${params.configurationId}/external-projects/${params.externalProjectKey}/external-issue-types`,
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

// --- Export Issues ---

export interface ExportIssuesParams {
  configurationId: string;
  projectId: string;
  issueIds: string[];
  branchId?: string;
  externalProjectKey?: string;
  externalIssueTypeId?: string;
  externalTicketId?: string;
}

export function exportIssues(
  params: ExportIssuesParams,
): Promise<IssueExportResult[]> {
  const client = getClient();

  const body: Record<string, unknown> = {
    configurationId: params.configurationId,
    projectId: params.projectId,
    issueIds: params.issueIds,
  };

  if (params.branchId) body.branchId = params.branchId;
  if (params.externalProjectKey) body.externalProjectKey = params.externalProjectKey;
  if (params.externalIssueTypeId) body.externalIssueTypeId = params.externalIssueTypeId;
  if (params.externalTicketId) body.externalTicketId = params.externalTicketId;

  return client.fetch<IssueExportResult[]>(
    "/api/integrations/bugtracking/issue-exports",
    {
      method: "POST",
      body,
      accept: ACCEPT,
      contentType: ACCEPT,
    },
  );
}
