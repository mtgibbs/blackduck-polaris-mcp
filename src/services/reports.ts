import * as reportsApi from "../api/reports.ts";
import type {
  ConfigurationPayload,
  DashboardFilter,
  Report,
  ReportConfiguration,
  ReportScheduler,
  ReportType,
  RunReportPayload,
  SchedulerPayload,
} from "../types/polaris.ts";

// --- Reports ---

export interface GetReportsOptions {
  filter?: string;
  sort?: string;
  offset?: number;
  limit?: number;
}

export function getReports(options?: GetReportsOptions): Promise<Report[]> {
  return reportsApi.getReports(options);
}

export interface GetReportOptions {
  reportId: string;
}

export function getReport(options: GetReportOptions): Promise<Report> {
  return reportsApi.getReport(options.reportId);
}

export interface RunReportOptions {
  reportType: string;
  payload: RunReportPayload;
}

export function runReport(options: RunReportOptions): Promise<Report> {
  return reportsApi.runReport(options.reportType, options.payload);
}

export interface DeleteReportOptions {
  reportId: string;
}

export function deleteReport(options: DeleteReportOptions): Promise<void> {
  return reportsApi.deleteReport(options.reportId);
}

export interface DownloadReportOptions {
  reportId: string;
}

export function getReportDownloadUrl(options: DownloadReportOptions): string {
  return reportsApi.getDownloadUrl(options.reportId);
}

export function getReportTypes(): Promise<ReportType[]> {
  return reportsApi.getReportTypes();
}

// --- Configurations ---

export interface GetReportConfigurationsOptions {
  filter?: string;
  sort?: string;
  offset?: number;
  limit?: number;
}

export function getReportConfigurations(
  options?: GetReportConfigurationsOptions,
): Promise<ReportConfiguration[]> {
  return reportsApi.getConfigurations(options);
}

export interface GetReportConfigurationOptions {
  configurationId: string;
}

export function getReportConfiguration(
  options: GetReportConfigurationOptions,
): Promise<ReportConfiguration> {
  return reportsApi.getConfiguration(options.configurationId);
}

export interface CreateReportConfigurationOptions {
  payload: ConfigurationPayload;
}

export function createReportConfiguration(
  options: CreateReportConfigurationOptions,
): Promise<ReportConfiguration> {
  return reportsApi.createConfiguration(options.payload);
}

export interface UpdateReportConfigurationOptions {
  configurationId: string;
  payload: Partial<ConfigurationPayload>;
}

export function updateReportConfiguration(
  options: UpdateReportConfigurationOptions,
): Promise<ReportConfiguration> {
  return reportsApi.updateConfiguration(options.configurationId, options.payload);
}

export interface DeleteReportConfigurationOptions {
  configurationId: string;
}

export function deleteReportConfiguration(
  options: DeleteReportConfigurationOptions,
): Promise<void> {
  return reportsApi.deleteConfiguration(options.configurationId);
}

export interface RunReportConfigurationOptions {
  configurationId: string;
}

export function runReportConfiguration(
  options: RunReportConfigurationOptions,
): Promise<Report> {
  return reportsApi.runConfiguration(options.configurationId);
}

// --- Schedulers ---

export interface CreateReportSchedulerOptions {
  configurationId: string;
  payload: SchedulerPayload;
}

export function createReportScheduler(
  options: CreateReportSchedulerOptions,
): Promise<ReportScheduler> {
  return reportsApi.createScheduler(options.configurationId, options.payload);
}

export interface GetReportSchedulerOptions {
  configurationId: string;
  schedulerId: string;
}

export function getReportScheduler(
  options: GetReportSchedulerOptions,
): Promise<ReportScheduler> {
  return reportsApi.getScheduler(options.configurationId, options.schedulerId);
}

export interface UpdateReportSchedulerOptions {
  configurationId: string;
  schedulerId: string;
  payload: Partial<SchedulerPayload>;
}

export function updateReportScheduler(
  options: UpdateReportSchedulerOptions,
): Promise<ReportScheduler> {
  return reportsApi.updateScheduler(
    options.configurationId,
    options.schedulerId,
    options.payload,
  );
}

// --- Dashboard Filters ---

export interface GetDashboardFiltersOptions {
  dashboardId: string;
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getDashboardFilters(
  options: GetDashboardFiltersOptions,
): Promise<DashboardFilter[]> {
  return reportsApi.getDashboardFilters(options.dashboardId, {
    filter: options.filter,
    offset: options.offset,
    limit: options.limit,
  });
}

export interface CreateDashboardFilterOptions {
  dashboardId: string;
  payload: Record<string, unknown>;
}

export function createDashboardFilter(
  options: CreateDashboardFilterOptions,
): Promise<DashboardFilter> {
  return reportsApi.createDashboardFilter(options.dashboardId, options.payload);
}

export interface UpdateDashboardFilterOptions {
  dashboardId: string;
  filterId: string;
  payload: Record<string, unknown>;
}

export function updateDashboardFilter(
  options: UpdateDashboardFilterOptions,
): Promise<DashboardFilter> {
  return reportsApi.updateDashboardFilter(
    options.dashboardId,
    options.filterId,
    options.payload,
  );
}

export interface DeleteDashboardFilterOptions {
  dashboardId: string;
  filterId: string;
}

export function deleteDashboardFilter(
  options: DeleteDashboardFilterOptions,
): Promise<void> {
  return reportsApi.deleteDashboardFilter(options.dashboardId, options.filterId);
}

// --- Timezones ---

export function getReportTimezones(): Promise<string[]> {
  return reportsApi.getTimezones();
}
