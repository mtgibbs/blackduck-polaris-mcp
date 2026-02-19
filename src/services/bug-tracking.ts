import * as bugTrackingApi from "../api/bug-tracking.ts";
import type {
  BugTrackingConfiguration,
  ExternalIssueType,
  ExternalProject,
  LinkedIssue,
  ProjectMapping,
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
