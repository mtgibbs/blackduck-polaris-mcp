import * as portfolioApi from "../api/portfolio.ts";
import type { Application, Branch, Portfolio, Project } from "../types/polaris.ts";

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

export function getProject(
  portfolioId: string,
  applicationId: string,
  projectId: string,
): Promise<Project> {
  return portfolioApi.getProject(portfolioId, applicationId, projectId);
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
