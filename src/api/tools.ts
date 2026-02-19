import { getClient } from "./client.ts";
import type {
  CreateToolVersionSettingRequest,
  DownloadDescriptor,
  PolarisTool,
  ToolVersionMapping,
  ToolVersionMatrix,
  ToolVersionSetting,
} from "../types/polaris.ts";

export const ACCEPT_TOOL_LIST = "application/vnd.polaris.tools.tool-list-1+json";
export const ACCEPT_TOOL = "application/vnd.polaris.tools.tool-1+json";
export const ACCEPT_DOWNLOAD_DESCRIPTOR =
  "application/vnd.polaris.tools.download-descriptor-1+json";
export const ACCEPT_VERSION_MAPPING = "application/vnd.polaris.tools.version-mapping-list-1+json";
export const ACCEPT_VERSION_MATRIX = "application/vnd.polaris.tools.version-matrix-1+json";
export const ACCEPT_VERSION_SETTINGS = "application/vnd.polaris.tools.version-settings-1+json";
export const ACCEPT_TOOL_CONFIG_LIST = "application/vnd.polaris.tools.tool-config-list-1+json";
export const CONTENT_TYPE_VERSION_SETTINGS_REQUEST =
  "application/vnd.polaris.tools.version-settings-request-1+json";

export interface ToolQueryParams {
  filter?: string;
}

export function getTools(params: ToolQueryParams = {}): Promise<PolarisTool[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  return client.getAllOffset<PolarisTool>("/api/tools", queryParams, ACCEPT_TOOL_LIST);
}

export function getTool(id: string): Promise<PolarisTool> {
  const client = getClient();
  return client.get<PolarisTool>(`/api/tools/${id}`, undefined, ACCEPT_TOOL);
}

export function getDownloadDescriptor(id: string): Promise<DownloadDescriptor> {
  const client = getClient();
  return client.get<DownloadDescriptor>(
    `/api/tools/download-descriptors/${id}`,
    undefined,
    ACCEPT_DOWNLOAD_DESCRIPTOR,
  );
}

export function getToolLicense(toolName: string): Promise<string> {
  const client = getClient();
  return client.get<string>(`/api/tools/${toolName}/license`, undefined, undefined);
}

export function getVersionMapping(params: ToolQueryParams = {}): Promise<ToolVersionMapping[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  return client.getAllOffset<ToolVersionMapping>(
    "/api/tools/version-mapping",
    queryParams,
    ACCEPT_VERSION_MAPPING,
  );
}

export function getVersionMatrix(id: string): Promise<ToolVersionMatrix> {
  const client = getClient();
  return client.get<ToolVersionMatrix>(
    `/api/tools/${id}/version-matrix`,
    undefined,
    ACCEPT_VERSION_MATRIX,
  );
}

export function createVersionSetting(
  body: CreateToolVersionSettingRequest,
): Promise<ToolVersionSetting> {
  const client = getClient();
  return client.fetch<ToolVersionSetting>("/api/tools/version-settings", {
    method: "POST",
    body,
    accept: ACCEPT_VERSION_SETTINGS,
    contentType: CONTENT_TYPE_VERSION_SETTINGS_REQUEST,
  });
}

export function getVersionSettings(params: ToolQueryParams = {}): Promise<ToolVersionSetting[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  return client.getAllOffset<ToolVersionSetting>(
    "/api/tools/version-settings",
    queryParams,
    ACCEPT_TOOL_CONFIG_LIST,
  );
}

export function getVersionSettingsByContext(
  context: string,
  entityId?: string,
): Promise<ToolVersionSetting[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (entityId) queryParams.entityId = entityId;
  return client.getAllOffset<ToolVersionSetting>(
    `/api/tools/version-settings/context/${context}`,
    queryParams,
    ACCEPT_TOOL_CONFIG_LIST,
  );
}

export function updateVersionSetting(
  id: string,
  body: CreateToolVersionSettingRequest,
): Promise<ToolVersionSetting> {
  const client = getClient();
  return client.fetch<ToolVersionSetting>(`/api/tools/version-settings/${id}`, {
    method: "PUT",
    body,
    accept: ACCEPT_VERSION_SETTINGS,
    contentType: CONTENT_TYPE_VERSION_SETTINGS_REQUEST,
  });
}

export function deleteVersionSetting(id: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(`/api/tools/version-settings/${id}`, {
    method: "DELETE",
  });
}
