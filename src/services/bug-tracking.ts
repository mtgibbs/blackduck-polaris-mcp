import * as bugTrackingApi from "../api/bug-tracking.ts";
import type {
  BugTrackingConfiguration,
  ExternalIssueType,
  ExternalProject,
  IssueExportResult,
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
  externalProjectKey: string;
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

// --- Export Issues ---

export interface ExportIssuesOptions {
  configurationId: string;
  projectId: string;
  issueIds: string[];
  branchId?: string;
  externalProjectKey?: string;
  externalIssueTypeId?: string;
  externalTicketId?: string;
}

export function exportIssues(
  options: ExportIssuesOptions,
): Promise<IssueExportResult[]> {
  return bugTrackingApi.exportIssues(options);
}
