import { getClient } from "./client.ts";
import type {
  Application,
  Branch,
  CreateApplicationRequest,
  CreateBranchRequest,
  CreateLabelRequest,
  CreateProjectRequest,
  Label,
  MergeLabelRequest,
  OrganizationSettings,
  Portfolio,
  Profile,
  Project,
  ProjectSubResource,
  ProjectSubResourceCountItem,
  RiskScoringSettings,
  UpdateApplicationRequest,
  UpdateBranchRequest,
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

const ACCEPT_SUB_RESOURCES = "application/vnd.polaris.portfolios.project-sub-resources-1+json";
const ACCEPT_PROFILES = "application/vnd.polaris.portfolios.profiles-1+json";

// --- Project Sub-Resources ---

export function getProjectSubResources(params: {
  portfolioId: string;
  filter?: string;
  sort?: string;
  considerInheritedLabels?: boolean;
}): Promise<ProjectSubResource[]> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.considerInheritedLabels !== undefined) {
    queryParams._considerInheritedLabels = params.considerInheritedLabels;
  }
  return client.getAllOffset<ProjectSubResource>(
    `/api/portfolios/${params.portfolioId}/project-sub-resources`,
    queryParams,
    ACCEPT_SUB_RESOURCES,
  );
}

export function getProjectSubResourceCount(params: {
  portfolioId: string;
  filter?: string;
  sort?: string;
  group?: string;
}): Promise<ProjectSubResourceCountItem[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.group) queryParams._group = params.group;
  return client.getAllOffset<ProjectSubResourceCountItem>(
    `/api/portfolios/${params.portfolioId}/project-sub-resources/_actions/count`,
    queryParams,
    ACCEPT_SUB_RESOURCES,
  );
}

export function getProfile(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  profileId: string;
}): Promise<Profile> {
  const client = getClient();
  return client.get<Profile>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/profiles/${params.profileId}`,
    undefined,
    ACCEPT_PROFILES,
  );
}

export function updateProfile(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  profileId: string;
  body: Record<string, unknown>;
}): Promise<Profile> {
  const client = getClient();
  return client.fetch<Profile>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/profiles/${params.profileId}`,
    { method: "PUT", body: params.body, accept: ACCEPT_PROFILES, contentType: ACCEPT_PROFILES },
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

export function getBranch(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  branchId: string;
}): Promise<Branch> {
  const client = getClient();
  return client.get<Branch>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/branches/${params.branchId}`,
    undefined,
    ACCEPT_BRANCHES,
  );
}

export function createBranch(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  body: CreateBranchRequest;
}): Promise<Branch> {
  const client = getClient();
  return client.fetch<Branch>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/branches`,
    { method: "POST", body: params.body, accept: ACCEPT_BRANCHES, contentType: ACCEPT_BRANCHES },
  );
}

export function updateBranch(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  branchId: string;
  body: UpdateBranchRequest;
}): Promise<Branch> {
  const client = getClient();
  return client.fetch<Branch>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/branches/${params.branchId}`,
    { method: "PATCH", body: params.body, accept: ACCEPT_BRANCHES, contentType: ACCEPT_BRANCHES },
  );
}

export function deleteBranch(params: {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  branchId: string;
}): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/branches/${params.branchId}`,
    { method: "DELETE", accept: ACCEPT_BRANCHES },
  );
}

export function getPortfolioBranches(params: {
  portfolioId: string;
  filter?: string;
  sort?: string;
}): Promise<Branch[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  return client.getAllOffset<Branch>(
    `/api/portfolios/${params.portfolioId}/branches`,
    queryParams,
    ACCEPT_BRANCHES,
  );
}

const ACCEPT_LABELS = "application/vnd.polaris.portfolios.labels-1+json";

// --- Labels ---

export function createLabel(params: { body: CreateLabelRequest }): Promise<Label> {
  const client = getClient();
  return client.fetch<Label>("/api/portfolios/labels", {
    method: "POST",
    body: params.body,
    accept: ACCEPT_LABELS,
    contentType: ACCEPT_LABELS,
  });
}

export function getLabels(params: { filter?: string; sort?: string }): Promise<Label[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  return client.getAllOffset<Label>("/api/portfolios/labels", queryParams, ACCEPT_LABELS);
}

export function getLabel(params: {
  labelId: string;
  includeUsageStats?: boolean;
}): Promise<Label> {
  const client = getClient();
  const queryParams: Record<string, boolean | undefined> = {};
  if (params.includeUsageStats !== undefined) {
    queryParams.includeUsageStats = params.includeUsageStats;
  }
  return client.get<Label>(`/api/portfolios/labels/${params.labelId}`, queryParams, ACCEPT_LABELS);
}

export function updateLabel(params: {
  labelId: string;
  body: CreateLabelRequest;
}): Promise<Label> {
  const client = getClient();
  return client.fetch<Label>(`/api/portfolios/labels/${params.labelId}`, {
    method: "PATCH",
    body: params.body,
    accept: ACCEPT_LABELS,
    contentType: ACCEPT_LABELS,
  });
}

export function deleteLabel(params: { labelId: string }): Promise<void> {
  const client = getClient();
  return client.fetch<void>(`/api/portfolios/labels/${params.labelId}`, {
    method: "DELETE",
    accept: ACCEPT_LABELS,
  });
}

export function mergeLabels(params: { body: MergeLabelRequest }): Promise<Label> {
  const client = getClient();
  return client.fetch<Label>("/api/portfolios/labels/merge", {
    method: "POST",
    body: params.body,
    accept: ACCEPT_LABELS,
    contentType: ACCEPT_LABELS,
  });
}

const ACCEPT_SETTINGS = "application/vnd.polaris.portfolios.settings-1+json";
const ACCEPT_RISK_SCORING = "application/vnd.polaris.portfolios.risk-scoring-settings-1+json";

// --- Organization Settings ---

export function getOrganizationSettings(): Promise<OrganizationSettings> {
  const client = getClient();
  return client.get<OrganizationSettings>("/api/portfolios/settings", undefined, ACCEPT_SETTINGS);
}

export function updateOrganizationSettings(params: {
  body: Partial<OrganizationSettings>;
}): Promise<OrganizationSettings> {
  const client = getClient();
  return client.fetch<OrganizationSettings>("/api/portfolios/settings", {
    method: "PATCH",
    body: params.body,
    accept: ACCEPT_SETTINGS,
    contentType: ACCEPT_SETTINGS,
  });
}

// --- Risk Scoring Settings ---

export function getRiskScoringSettings(): Promise<RiskScoringSettings> {
  const client = getClient();
  return client.get<RiskScoringSettings>(
    "/api/portfolios/risk-scoring",
    undefined,
    ACCEPT_RISK_SCORING,
  );
}

export function updateRiskScoringSettings(params: {
  body: RiskScoringSettings;
}): Promise<RiskScoringSettings> {
  const client = getClient();
  return client.fetch<RiskScoringSettings>("/api/portfolios/risk-scoring", {
    method: "PUT",
    body: params.body,
    accept: ACCEPT_RISK_SCORING,
    contentType: ACCEPT_RISK_SCORING,
  });
}
