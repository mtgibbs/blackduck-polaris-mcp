import * as portfolioApi from "../api/portfolio.ts";
import type {
  Application,
  ApplicationEntitlementsResponse,
  Branch,
  CreateApplicationRequest,
  CreateBranchRequest,
  CreateLabelRequest,
  CreateProfileArtifactRequest,
  CreateProjectRequest,
  DashboardItem,
  EntitlementQuantityUpdateRequest,
  EntitlementQuantityUpdateResponse,
  Label,
  MergeLabelRequest,
  OrganizationSettings,
  Portfolio,
  PortfolioEntitlement,
  Profile,
  ProfileArtifact,
  Project,
  ProjectSubResource,
  ProjectSubResourceCountItem,
  RiskFactor,
  RiskScoringSettings,
  UpdateApplicationRequest,
  UpdateBranchRequest,
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

export interface GetApplicationOptions {
  portfolioId: string;
  applicationId: string;
}

export function getApplication(options: GetApplicationOptions): Promise<Application> {
  return portfolioApi.getApplication(options);
}

export interface CreateApplicationOptions {
  portfolioId: string;
  name: string;
  description?: string;
}

export function createApplication(options: CreateApplicationOptions): Promise<Application> {
  const body: CreateApplicationRequest = { name: options.name };
  if (options.description !== undefined) body.description = options.description;
  return portfolioApi.createApplication({ portfolioId: options.portfolioId, body });
}

export interface UpdateApplicationOptions {
  portfolioId: string;
  applicationId: string;
  name?: string;
  description?: string;
  inTrash?: boolean;
  autoDeleteSetting?: boolean;
  branchRetentionPeriodSetting?: number;
}

export function updateApplication(options: UpdateApplicationOptions): Promise<Application> {
  const body: UpdateApplicationRequest = {};
  if (options.name !== undefined) body.name = options.name;
  if (options.description !== undefined) body.description = options.description;
  if (options.inTrash !== undefined) body.inTrash = options.inTrash;
  if (options.autoDeleteSetting !== undefined) body.autoDeleteSetting = options.autoDeleteSetting;
  if (options.branchRetentionPeriodSetting !== undefined) {
    body.branchRetentionPeriodSetting = options.branchRetentionPeriodSetting;
  }
  return portfolioApi.updateApplication({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    body,
  });
}

export interface DeleteApplicationOptions {
  portfolioId: string;
  applicationId: string;
}

export function deleteApplication(options: DeleteApplicationOptions): Promise<void> {
  return portfolioApi.deleteApplication({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
  });
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

export interface GetBranchOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  branchId: string;
}

export function getBranch(options: GetBranchOptions): Promise<Branch> {
  return portfolioApi.getBranch(options);
}

export interface CreateBranchOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  name: string;
}

export function createBranch(options: CreateBranchOptions): Promise<Branch> {
  const body: CreateBranchRequest = { name: options.name };
  return portfolioApi.createBranch({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    projectId: options.projectId,
    body,
  });
}

export interface UpdateBranchOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  branchId: string;
  name?: string;
  isDefault?: boolean;
}

export function updateBranch(options: UpdateBranchOptions): Promise<Branch> {
  const body: UpdateBranchRequest = {};
  if (options.name !== undefined) body.name = options.name;
  if (options.isDefault !== undefined) body.isDefault = options.isDefault;
  return portfolioApi.updateBranch({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    projectId: options.projectId,
    branchId: options.branchId,
    body,
  });
}

export interface DeleteBranchOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  branchId: string;
}

export function deleteBranch(options: DeleteBranchOptions): Promise<void> {
  return portfolioApi.deleteBranch({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    projectId: options.projectId,
    branchId: options.branchId,
  });
}

export interface GetPortfolioBranchesOptions {
  portfolioId: string;
  filter?: string;
  sort?: string;
}

export function getPortfolioBranches(
  options: GetPortfolioBranchesOptions,
): Promise<Branch[]> {
  return portfolioApi.getPortfolioBranches(options);
}

export interface GetProjectSubResourcesOptions {
  portfolioId: string;
  filter?: string;
  sort?: string;
  considerInheritedLabels?: boolean;
}

export function getProjectSubResources(
  options: GetProjectSubResourcesOptions,
): Promise<ProjectSubResource[]> {
  return portfolioApi.getProjectSubResources(options);
}

export interface GetProjectSubResourceCountOptions {
  portfolioId: string;
  filter?: string;
  sort?: string;
  group?: string;
}

export function getProjectSubResourceCount(
  options: GetProjectSubResourceCountOptions,
): Promise<ProjectSubResourceCountItem[]> {
  return portfolioApi.getProjectSubResourceCount(options);
}

export interface GetProfileOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  profileId: string;
}

export function getProfile(options: GetProfileOptions): Promise<Profile> {
  return portfolioApi.getProfile(options);
}

export interface UpdateProfileOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  profileId: string;
  body: Record<string, unknown>;
}

export function updateProfile(options: UpdateProfileOptions): Promise<Profile> {
  return portfolioApi.updateProfile(options);
}

// --- Labels ---

export interface CreateLabelOptions {
  name: string;
  description?: string;
}

export function createLabel(options: CreateLabelOptions): Promise<Label> {
  const body: CreateLabelRequest = { name: options.name };
  if (options.description !== undefined) body.description = options.description;
  return portfolioApi.createLabel({ body });
}

export interface GetLabelsOptions {
  filter?: string;
  sort?: string;
}

export function getLabels(options: GetLabelsOptions): Promise<Label[]> {
  return portfolioApi.getLabels(options);
}

export interface GetLabelOptions {
  labelId: string;
  includeUsageStats?: boolean;
}

export function getLabel(options: GetLabelOptions): Promise<Label> {
  return portfolioApi.getLabel(options);
}

export interface UpdateLabelOptions {
  labelId: string;
  name?: string;
  description?: string;
}

export function updateLabel(options: UpdateLabelOptions): Promise<Label> {
  const body: CreateLabelRequest = { name: options.name ?? "" };
  if (options.name !== undefined) body.name = options.name;
  if (options.description !== undefined) body.description = options.description;
  return portfolioApi.updateLabel({ labelId: options.labelId, body });
}

export interface DeleteLabelOptions {
  labelId: string;
}

export function deleteLabel(options: DeleteLabelOptions): Promise<void> {
  return portfolioApi.deleteLabel({ labelId: options.labelId });
}

export interface MergeLabelsOptions {
  labelsToMerge: string[];
  targetName: string;
  targetDescription?: string;
}

export function mergeLabels(options: MergeLabelsOptions): Promise<Label> {
  const body: MergeLabelRequest = {
    labelsToMerge: options.labelsToMerge,
    targetLabel: { name: options.targetName },
  };
  if (options.targetDescription !== undefined) {
    body.targetLabel.description = options.targetDescription;
  }
  return portfolioApi.mergeLabels({ body });
}

// --- Organization Settings ---

export function getOrganizationSettings(): Promise<OrganizationSettings> {
  return portfolioApi.getOrganizationSettings();
}

export interface UpdateOrganizationSettingsOptions {
  allowLabelCreationForApplicationRoleUser?: boolean;
}

export function updateOrganizationSettings(
  options: UpdateOrganizationSettingsOptions,
): Promise<OrganizationSettings> {
  const body: Partial<OrganizationSettings> = {};
  if (options.allowLabelCreationForApplicationRoleUser !== undefined) {
    body.allowLabelCreationForApplicationRoleUser =
      options.allowLabelCreationForApplicationRoleUser;
  }
  return portfolioApi.updateOrganizationSettings({ body });
}

// --- Risk Scoring Settings ---

export function getRiskScoringSettings(): Promise<RiskScoringSettings> {
  return portfolioApi.getRiskScoringSettings();
}

export interface UpdateRiskScoringSettingsOptions {
  isEnabled: boolean;
  riskFactors: RiskFactor[];
}

export function updateRiskScoringSettings(
  options: UpdateRiskScoringSettingsOptions,
): Promise<RiskScoringSettings> {
  return portfolioApi.updateRiskScoringSettings({
    body: { isEnabled: options.isEnabled, riskFactors: options.riskFactors },
  });
}

// --- Artifacts ---

export interface CreateArtifactOptions {
  portfolioId: string;
  applicationId: string;
  fileName: string;
  fileHash: string;
  fileSize: string;
  artifactType: string;
}

export function createArtifact(options: CreateArtifactOptions): Promise<ProfileArtifact> {
  const body: CreateProfileArtifactRequest = {
    fileName: options.fileName,
    fileHash: options.fileHash,
    fileSize: options.fileSize,
    artifactType: options.artifactType,
  };
  return portfolioApi.createArtifact({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    body,
  });
}

export interface GetArtifactOptions {
  portfolioId: string;
  applicationId: string;
  artifactId: string;
}

export function getArtifact(options: GetArtifactOptions): Promise<ProfileArtifact> {
  return portfolioApi.getArtifact(options);
}

// --- Entitlements ---

export interface GetApplicationEntitlementsOptions {
  portfolioId: string;
  applicationId: string;
}

export function getApplicationEntitlements(
  options: GetApplicationEntitlementsOptions,
): Promise<ApplicationEntitlementsResponse> {
  return portfolioApi.getApplicationEntitlements(options);
}

export interface UpdateEntitlementQuantityOptions {
  portfolioId: string;
  applicationId: string;
  entitlementIds: string[];
  quantity: number;
}

export function updateEntitlementQuantity(
  options: UpdateEntitlementQuantityOptions,
): Promise<EntitlementQuantityUpdateResponse> {
  const body: EntitlementQuantityUpdateRequest = {
    entitlementIds: options.entitlementIds,
    quantity: options.quantity,
  };
  return portfolioApi.updateEntitlementQuantity({
    portfolioId: options.portfolioId,
    applicationId: options.applicationId,
    body,
  });
}

export interface GetPortfolioEntitlementsOptions {
  portfolioId: string;
}

export function getPortfolioEntitlements(
  options: GetPortfolioEntitlementsOptions,
): Promise<PortfolioEntitlement> {
  return portfolioApi.getPortfolioEntitlements(options);
}

// --- Dashboard ---

export interface GetDashboardOptions {
  portfolioId: string;
  filter?: string;
  sort?: string;
}

export function getDashboard(options: GetDashboardOptions): Promise<DashboardItem[]> {
  return portfolioApi.getDashboard(options);
}
