import * as bugTrackingApi from "../api/bug-tracking.ts";
import type {
  BugTrackingConfiguration,
  BugTrackingSystemType,
  CreateProjectMappingRequest,
  ExternalIssueType,
  ExternalProject,
  LinkedIssue,
  ProjectMapping,
  TestConnectionResult,
  UpdateProjectMappingRequest,
} from "../types/polaris.ts";

// --- Configurations ---

export interface GetBugTrackingConfigurationsOptions {
  filter?: string;
}

export function getBugTrackingConfigurations(
  options?: GetBugTrackingConfigurationsOptions,
): Promise<BugTrackingConfiguration[]> {
  return bugTrackingApi.getConfigurations(options);
}

export function getBugTrackingConfiguration(
  id: string,
): Promise<BugTrackingConfiguration> {
  return bugTrackingApi.getConfiguration(id);
}

export interface CreateBugTrackingConfigurationOptions {
  system: string;
  url: string;
  type: BugTrackingSystemType;
  enabled: boolean;
  details: {
    deploymentType?: string;
    accessToken?: string;
  };
}

export function createBugTrackingConfiguration(
  options: CreateBugTrackingConfigurationOptions,
): Promise<BugTrackingConfiguration> {
  return bugTrackingApi.createConfiguration(options.system, {
    url: options.url,
    type: options.type,
    enabled: options.enabled,
    details: options.details,
  });
}

export interface UpdateBugTrackingConfigurationOptions {
  id: string;
  url?: string;
  type?: BugTrackingSystemType;
  enabled?: boolean;
  details?: {
    deploymentType?: string;
    accessToken?: string;
  };
}

export function updateBugTrackingConfiguration(
  options: UpdateBugTrackingConfigurationOptions,
): Promise<BugTrackingConfiguration> {
  return bugTrackingApi.updateConfiguration(options.id, {
    url: options.url,
    type: options.type,
    enabled: options.enabled,
    details: options.details,
  });
}

export interface DeleteBugTrackingConfigurationOptions {
  id: string;
}

export function deleteBugTrackingConfiguration(
  options: DeleteBugTrackingConfigurationOptions,
): Promise<void> {
  return bugTrackingApi.deleteConfiguration(options.id);
}

export interface TestBugTrackingConnectionOptions {
  id: string;
}

export function testBugTrackingConnection(
  options: TestBugTrackingConnectionOptions,
): Promise<TestConnectionResult> {
  return bugTrackingApi.testConnection(options.id);
}

// --- External Projects ---

export interface GetExternalProjectsOptions {
  configurationId: string;
  filter?: string;
}

export function getExternalProjects(
  options: GetExternalProjectsOptions,
): Promise<ExternalProject[]> {
  return bugTrackingApi.getExternalProjects(options);
}

export interface GetExternalProjectByKeyOptions {
  configurationId: string;
  projectKey: string;
}

export function getExternalProjectByKey(
  options: GetExternalProjectByKeyOptions,
): Promise<ExternalProject> {
  return bugTrackingApi.getExternalProjectByKey(options.configurationId, options.projectKey);
}

// --- External Issue Types ---

export interface GetExternalIssueTypesOptions {
  configurationId: string;
  projectKey: string;
}

export function getExternalIssueTypes(
  options: GetExternalIssueTypesOptions,
): Promise<ExternalIssueType[]> {
  return bugTrackingApi.getExternalIssueTypes(options);
}

// --- Project Mappings ---

export interface GetProjectMappingsOptions {
  filter?: string;
}

export function getProjectMappings(
  options?: GetProjectMappingsOptions,
): Promise<ProjectMapping[]> {
  return bugTrackingApi.getProjectMappings(options);
}

// --- Export / Linked Issues ---

export interface ExportIssueOptions {
  configurationId: string;
  projectMappingId: string;
  issueFamilyId: string;
  btsIssueTypeId?: string;
  btsKey?: string;
  branchId?: string;
}

export function exportIssue(
  options: ExportIssueOptions,
): Promise<LinkedIssue> {
  return bugTrackingApi.exportIssue(options);
}

export interface GetLinkedIssuesOptions {
  configurationId: string;
}

export function getLinkedIssues(
  options: GetLinkedIssuesOptions,
): Promise<LinkedIssue[]> {
  return bugTrackingApi.getLinkedIssues(options.configurationId);
}

export interface GetLinkedIssueOptions {
  configurationId: string;
  issueId: string;
}

export function getLinkedIssue(
  options: GetLinkedIssueOptions,
): Promise<LinkedIssue> {
  return bugTrackingApi.getLinkedIssue(options.configurationId, options.issueId);
}

export interface DeleteIssueExportOptions {
  configurationId: string;
  issueId: string;
}

export function deleteIssueExport(options: DeleteIssueExportOptions): Promise<void> {
  return bugTrackingApi.deleteIssueExport(options.configurationId, options.issueId);
}

export interface AddIssueExportCommentOptions {
  configurationId: string;
  issueId: string;
  comment: string;
}

export function addIssueExportComment(options: AddIssueExportCommentOptions): Promise<void> {
  return bugTrackingApi.addIssueExportComment(options.configurationId, options.issueId, {
    comment: options.comment,
  });
}

// --- Config-scoped Project Mappings ---

export interface CreateConfigProjectMappingOptions {
  configurationId: string;
  projectId: string;
  btsProjectKey: string;
  btsProjectId?: string;
  btsIssueType: string;
}

export function createConfigProjectMapping(
  options: CreateConfigProjectMappingOptions,
): Promise<ProjectMapping> {
  const body: CreateProjectMappingRequest = {
    projectId: options.projectId,
    btsProjectKey: options.btsProjectKey,
    btsIssueType: options.btsIssueType,
  };
  if (options.btsProjectId !== undefined) body.btsProjectId = options.btsProjectId;
  return bugTrackingApi.createConfigProjectMapping(options.configurationId, body);
}

export interface GetConfigProjectMappingsOptions {
  configurationId: string;
}

export function getConfigProjectMappings(
  options: GetConfigProjectMappingsOptions,
): Promise<ProjectMapping[]> {
  return bugTrackingApi.getConfigProjectMappings(options.configurationId);
}

export interface GetConfigProjectMappingOptions {
  configurationId: string;
  projectMappingId: string;
}

export function getConfigProjectMapping(
  options: GetConfigProjectMappingOptions,
): Promise<ProjectMapping> {
  return bugTrackingApi.getConfigProjectMapping(options.configurationId, options.projectMappingId);
}

export interface UpdateConfigProjectMappingOptions {
  configurationId: string;
  projectMappingId: string;
  btsProjectKey?: string;
  btsProjectId?: string;
  btsIssueType?: string;
}

export function updateConfigProjectMapping(
  options: UpdateConfigProjectMappingOptions,
): Promise<ProjectMapping> {
  const body: UpdateProjectMappingRequest = {};
  if (options.btsProjectKey !== undefined) body.btsProjectKey = options.btsProjectKey;
  if (options.btsProjectId !== undefined) body.btsProjectId = options.btsProjectId;
  if (options.btsIssueType !== undefined) body.btsIssueType = options.btsIssueType;
  return bugTrackingApi.updateConfigProjectMapping(
    options.configurationId,
    options.projectMappingId,
    body,
  );
}

export interface DeleteConfigProjectMappingOptions {
  configurationId: string;
  projectMappingId: string;
}

export function deleteConfigProjectMapping(
  options: DeleteConfigProjectMappingOptions,
): Promise<void> {
  return bugTrackingApi.deleteConfigProjectMapping(
    options.configurationId,
    options.projectMappingId,
  );
}
