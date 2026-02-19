import * as portfolioApi from "../api/portfolio.ts";
import type {
  Application,
  Branch,
  CreateProjectRequest,
  Portfolio,
  Project,
  UpdateProjectRequest,
} from "../types/polaris.ts";

export function getPortfolios(): Promise<Portfolio[]> {
  return portfolioApi.getPortfolios();
}

export interface GetApplicationsOptions {
  portfolioId: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getApplications(
  options: GetApplicationsOptions,
): Promise<Application[]> {
  return portfolioApi.getApplications(options);
}

export function getApplication(
  portfolioId: string,
  applicationId: string,
): Promise<Application> {
  return portfolioApi.getApplication(portfolioId, applicationId);
}

export interface GetProjectsOptions {
  portfolioId: string;
  applicationId?: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getProjects(
  options: GetProjectsOptions,
): Promise<Project[]> {
  return portfolioApi.getProjects(options);
}

export interface GetProjectOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
}

export function getProject(options: GetProjectOptions): Promise<Project> {
  return portfolioApi.getProject(options);
}

export interface CreateProjectOptions {
  portfolioId: string;
  applicationId: string;
  name: string;
  description?: string;
}

export function createProject(options: CreateProjectOptions): Promise<Project> {
  const body: CreateProjectRequest = { name: options.name };
  if (options.description !== undefined) body.description = options.description;
  return portfolioApi.createProject({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    body,
  });
}

export interface UpdateProjectOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  name?: string;
  description?: string;
  inTrash?: boolean;
  autoDeleteSetting?: boolean;
  branchRetentionPeriodSetting?: number;
}

export function updateProject(options: UpdateProjectOptions): Promise<Project> {
  const body: UpdateProjectRequest = {};
  if (options.name !== undefined) body.name = options.name;
  if (options.description !== undefined) body.description = options.description;
  if (options.inTrash !== undefined) body.inTrash = options.inTrash;
  if (options.autoDeleteSetting !== undefined) body.autoDeleteSetting = options.autoDeleteSetting;
  if (options.branchRetentionPeriodSetting !== undefined) {
    body.branchRetentionPeriodSetting = options.branchRetentionPeriodSetting;
  }
  return portfolioApi.updateProject({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    projectId: options.projectId,
    body,
  });
}

export interface DeleteProjectOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
}

export function deleteProject(options: DeleteProjectOptions): Promise<void> {
  return portfolioApi.deleteProject({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    projectId: options.projectId,
  });
}

export interface GetBranchesOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getBranches(
  options: GetBranchesOptions,
): Promise<Branch[]> {
  return portfolioApi.getBranches(options);
}
