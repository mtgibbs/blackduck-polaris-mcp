import { getClient } from "./client.ts";
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

const BASE_PATH = "/api/insights";
const ACCEPT = "application/json";
const CONTENT_TYPE = "application/json";

// --- Reports ---

export interface GetReportsParams {
  filter?: string;
  sort?: string;
  offset?: number;
  limit?: number;
}

export function getReports(params?: GetReportsParams): Promise<Report[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  if (params?.sort) queryParams._sort = params.sort;
  if (params?.offset !== undefined) queryParams._offset = params.offset;
  if (params?.limit !== undefined) queryParams._limit = params.limit;
  return client.getAllOffset<Report>(
    `${BASE_PATH}/reports`,
    queryParams,
    ACCEPT,
  );
}

export function getReport(reportId: string): Promise<Report> {
  const client = getClient();
  return client.get<Report>(
    `${BASE_PATH}/reports/${reportId}`,
    undefined,
    ACCEPT,
  );
}

export function runReport(
  reportType: string,
  payload: RunReportPayload,
): Promise<Report> {
  const client = getClient();
  return client.fetch<Report>(
    `${BASE_PATH}/reports/${reportType}/_actions/run`,
    {
      method: "POST",
      body: payload,
      accept: ACCEPT,
      contentType: CONTENT_TYPE,
    },
  );
}

export function deleteReport(reportId: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `${BASE_PATH}/reports/${reportId}`,
    {
      method: "DELETE",
      accept: ACCEPT,
    },
  );
}

export function downloadReport(reportId: string): Promise<Response> {
  const client = getClient();
  return client.fetch<Response>(
    `${BASE_PATH}/reports/${reportId}/_actions/download`,
    {
      method: "GET",
      accept: ACCEPT,
    },
  );
}

export function getReportTypes(): Promise<ReportType[]> {
  const client = getClient();
  return client.getAllOffset<ReportType>(
    `${BASE_PATH}/reports/report-types`,
    undefined,
    ACCEPT,
  );
}

// --- Configurations ---

export interface GetConfigurationsParams {
  filter?: string;
  sort?: string;
  offset?: number;
  limit?: number;
}

export function getConfigurations(
  params?: GetConfigurationsParams,
): Promise<ReportConfiguration[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  if (params?.sort) queryParams._sort = params.sort;
  if (params?.offset !== undefined) queryParams._offset = params.offset;
  if (params?.limit !== undefined) queryParams._limit = params.limit;
  return client.getAllOffset<ReportConfiguration>(
    `${BASE_PATH}/configurations`,
    queryParams,
    ACCEPT,
  );
}

export function getConfiguration(id: string): Promise<ReportConfiguration> {
  const client = getClient();
  return client.get<ReportConfiguration>(
    `${BASE_PATH}/configurations/${id}`,
    undefined,
    ACCEPT,
  );
}

export function createConfiguration(
  payload: ConfigurationPayload,
): Promise<ReportConfiguration> {
  const client = getClient();
  return client.fetch<ReportConfiguration>(
    `${BASE_PATH}/configurations`,
    {
      method: "POST",
      body: payload,
      accept: ACCEPT,
      contentType: CONTENT_TYPE,
    },
  );
}

export function updateConfiguration(
  id: string,
  payload: Partial<ConfigurationPayload>,
): Promise<ReportConfiguration> {
  const client = getClient();
  return client.fetch<ReportConfiguration>(
    `${BASE_PATH}/configurations/${id}`,
    {
      method: "PATCH",
      body: payload,
      accept: ACCEPT,
      contentType: CONTENT_TYPE,
    },
  );
}

export function deleteConfiguration(id: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `${BASE_PATH}/configurations/${id}`,
    {
      method: "DELETE",
      accept: ACCEPT,
    },
  );
}

export function runConfiguration(id: string): Promise<Report> {
  const client = getClient();
  return client.fetch<Report>(
    `${BASE_PATH}/configurations/${id}/_actions/run`,
    {
      method: "POST",
      body: {},
      accept: ACCEPT,
      contentType: CONTENT_TYPE,
    },
  );
}

// --- Schedulers ---

export function createScheduler(
  configurationId: string,
  payload: SchedulerPayload,
): Promise<ReportScheduler> {
  const client = getClient();
  return client.fetch<ReportScheduler>(
    `${BASE_PATH}/configurations/${configurationId}/schedulers`,
    {
      method: "POST",
      body: payload,
      accept: ACCEPT,
      contentType: CONTENT_TYPE,
    },
  );
}

export function getScheduler(
  configurationId: string,
  schedulerId: string,
): Promise<ReportScheduler> {
  const client = getClient();
  return client.get<ReportScheduler>(
    `${BASE_PATH}/configurations/${configurationId}/schedulers/${schedulerId}`,
    undefined,
    ACCEPT,
  );
}

export function updateScheduler(
  configurationId: string,
  schedulerId: string,
  payload: Partial<SchedulerPayload>,
): Promise<ReportScheduler> {
  const client = getClient();
  return client.fetch<ReportScheduler>(
    `${BASE_PATH}/configurations/${configurationId}/schedulers/${schedulerId}`,
    {
      method: "PATCH",
      body: payload,
      accept: ACCEPT,
      contentType: CONTENT_TYPE,
    },
  );
}

// --- Dashboard Filters ---

export interface GetDashboardFiltersParams {
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getDashboardFilters(
  dashboardId: string,
  params?: GetDashboardFiltersParams,
): Promise<DashboardFilter[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  if (params?.offset !== undefined) queryParams._offset = params.offset;
  if (params?.limit !== undefined) queryParams._limit = params.limit;
  return client.getAllOffset<DashboardFilter>(
    `${BASE_PATH}/dashboards/${dashboardId}/filters`,
    queryParams,
    ACCEPT,
  );
}

export function createDashboardFilter(
  dashboardId: string,
  payload: Record<string, unknown>,
): Promise<DashboardFilter> {
  const client = getClient();
  return client.fetch<DashboardFilter>(
    `${BASE_PATH}/dashboards/${dashboardId}/filters`,
    {
      method: "POST",
      body: payload,
      accept: ACCEPT,
      contentType: CONTENT_TYPE,
    },
  );
}

export function updateDashboardFilter(
  dashboardId: string,
  filterId: string,
  payload: Record<string, unknown>,
): Promise<DashboardFilter> {
  const client = getClient();
  return client.fetch<DashboardFilter>(
    `${BASE_PATH}/dashboards/${dashboardId}/filters/${filterId}`,
    {
      method: "PATCH",
      body: payload,
      accept: ACCEPT,
      contentType: CONTENT_TYPE,
    },
  );
}

export function deleteDashboardFilter(
  dashboardId: string,
  filterId: string,
): Promise<void> {
  const client = getClient();
  return client.fetch<void>(
    `${BASE_PATH}/dashboards/${dashboardId}/filters/${filterId}`,
    {
      method: "DELETE",
      accept: ACCEPT,
    },
  );
}

// --- Timezones ---

export async function getTimezones(): Promise<string[]> {
  const client = getClient();
  return client.get<string[]>(
    `${BASE_PATH}/timezones`,
    undefined,
    ACCEPT,
  );
}
