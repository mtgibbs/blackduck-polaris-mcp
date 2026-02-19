import { getClient } from "./client.ts";
import type {
  Application,
  Branch,
  CreateApplicationRequest,
  CreateProjectRequest,
  Portfolio,
  Project,
  UpdateApplicationRequest,
  UpdateProjectRequest,
} from "../types/polaris.ts";

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

export interface GetApplicationParams {
  portfolioId: string;
  applicationId: string;
}

export function getApplication(params: GetApplicationParams): Promise<Application> {
  const client = getClient();
  return client.get<Application>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}`,
    undefined,
    ACCEPT_APPS,
  );
}

export function createApplication(params: {
  portfolioId: string;
  body: CreateApplicationRequest;
}): Promise<Application> {
  const client = getClient();
  return client.fetch<Application>(
    `/api/portfolios/${params.portfolioId}/applications`,
    { method: "POST", body: params.body, accept: ACCEPT_APPS, contentType: ACCEPT_APPS },
  );
}

export function updateApplication(params: {
  portfolioId: string;
  applicationId: string;
  body: UpdateApplicationRequest;
}): Promise<Application> {
  const client = getClient();
  return client.fetch<Application>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}`,
    { method: "PATCH", body: params.body, accept: ACCEPT_APPS, contentType: ACCEPT_APPS },
  );
}

export function deleteApplication(params: {
  portfolioId: string;
  applicationId: string;
}): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}`,
    { method: "DELETE", accept: ACCEPT_APPS },
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

  const path = params.applicationId
    ? `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects`
    : `/api/portfolios/${params.portfolioId}/projects`;

  // _includeLabelIds is only supported on the app-scoped projects path
  if (params.applicationId && params.includeLabelIds) {
    queryParams._includeLabelIds = params.includeLabelIds;
  }

  return client.getAllOffset<Project>(path, queryParams, ACCEPT_PROJECTS);
}

export function getProject(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
}): Promise<Project> {
  const client = getClient();
  return client.get<Project>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}`,
    undefined,
    ACCEPT_PROJECTS,
  );
}

export function createProject(params: {
  portfolioId: string;
  applicationId: string;
  body: CreateProjectRequest;
}): Promise<Project> {
  const client = getClient();
  return client.fetch<Project>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects`,
    { method: "POST", body: params.body, accept: ACCEPT_PROJECTS, contentType: ACCEPT_PROJECTS },
  );
}

export function updateProject(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  body: UpdateProjectRequest;
}): Promise<Project> {
  const client = getClient();
  return client.fetch<Project>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}`,
    { method: "PATCH", body: params.body, accept: ACCEPT_PROJECTS, contentType: ACCEPT_PROJECTS },
  );
}

export function deleteProject(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
}): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}`,
    { method: "DELETE", accept: ACCEPT_PROJECTS },
  );
}

// --- Branches ---

export interface GetBranchesParams {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getBranches(
  params: GetBranchesParams,
): Promise<Branch[]> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeLabelIds) queryParams._includeLabelIds = params.includeLabelIds;
  return client.getAllOffset<Branch>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/branches`,
    queryParams,
    ACCEPT_BRANCHES,
  );
}
