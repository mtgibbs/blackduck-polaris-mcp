import { getClient } from "./client.ts";
import type { Application, Branch, Portfolio, Project } from "../types/polaris.ts";

const ACCEPT = "application/vnd.polaris.portfolios-1+json";
const ACCEPT_APPS = "application/vnd.polaris.portfolios.applications-1+json";
const ACCEPT_PROJECTS = "application/vnd.polaris.portfolios.projects-1+json";
const ACCEPT_BRANCHES = "application/vnd.polaris.portfolios.branches-1+json";

// --- Portfolios ---

export function getPortfolios(): Promise<Portfolio[]> {
  const client = getClient();
  return client.getAllOffset<Portfolio>("/api/portfolios/", undefined, ACCEPT);
}

// --- Applications ---

export interface GetApplicationsParams {
  portfolioId: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getApplications(
  params: GetApplicationsParams,
): Promise<Application[]> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeLabelIds) queryParams._includeLabelIds = params.includeLabelIds;
  return client.getAllOffset<Application>(
    `/api/portfolios/${params.portfolioId}/applications`,
    queryParams,
    ACCEPT_APPS,
  );
}

export function getApplication(
  portfolioId: string,
  applicationId: string,
): Promise<Application> {
  const client = getClient();
  return client.get<Application>(
    `/api/portfolios/${portfolioId}/applications/${applicationId}`,
    undefined,
    ACCEPT_APPS,
  );
}

// --- Projects ---

export interface GetProjectsParams {
  portfolioId: string;
  applicationId?: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getProjects(
  params: GetProjectsParams,
): Promise<Project[]> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeLabelIds) queryParams._includeLabelIds = params.includeLabelIds;

  const path = params.applicationId
    ? `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects`
    : `/api/portfolios/${params.portfolioId}/projects`;

  return client.getAllOffset<Project>(path, queryParams, ACCEPT_PROJECTS);
}

export function getProject(
  portfolioId: string,
  applicationId: string,
  projectId: string,
): Promise<Project> {
  const client = getClient();
  return client.get<Project>(
    `/api/portfolios/${portfolioId}/applications/${applicationId}/projects/${projectId}`,
    undefined,
    ACCEPT_PROJECTS,
  );
}

// --- Branches ---

export interface GetBranchesParams {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  filter?: string;
  sort?: string;
}

export function getBranches(
  params: GetBranchesParams,
): Promise<Branch[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  return client.getAllOffset<Branch>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/branches`,
    queryParams,
    ACCEPT_BRANCHES,
  );
}
