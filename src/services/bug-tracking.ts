import * as bugTrackingApi from "../api/bug-tracking.ts";
import type {
  BugTrackingConfiguration,
  BugTrackingSystemType,
  ExternalIssueType,
  ExternalProject,
  LinkedIssue,
  ProjectMapping,
  TestConnectionResult,
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

export function getLinkedIssues(
  configurationId: string,
): Promise<LinkedIssue[]> {
  return bugTrackingApi.getLinkedIssues(configurationId);
}

export function getLinkedIssue(
  configurationId: string,
  issueId: string,
): Promise<LinkedIssue> {
  return bugTrackingApi.getLinkedIssue(configurationId, issueId);
}
