import * as toolsApi from "../api/tools.ts";
import type {
  CreateToolVersionSettingRequest,
  DownloadDescriptor,
  PolarisTool,
  ToolVersionMapping,
  ToolVersionMatrix,
  ToolVersionSetting,
} from "../types/polaris.ts";

export function getTools(options?: { filter?: string }): Promise<PolarisTool[]> {
  return toolsApi.getTools({ filter: options?.filter });
}

export function getTool(options: { id: string }): Promise<PolarisTool> {
  return toolsApi.getTool(options.id);
}

export function getDownloadDescriptor(options: { id: string }): Promise<DownloadDescriptor> {
  return toolsApi.getDownloadDescriptor(options.id);
}

export function getToolLicense(options: { toolName: string }): Promise<string> {
  return toolsApi.getToolLicense(options.toolName);
}

export function getVersionMapping(options?: { filter?: string }): Promise<ToolVersionMapping[]> {
  return toolsApi.getVersionMapping({ filter: options?.filter });
}

export function getVersionMatrix(options: { id: string }): Promise<ToolVersionMatrix> {
  return toolsApi.getVersionMatrix(options.id);
}

export interface CreateVersionSettingOptions {
  toolType: string;
  version: string;
  context: string;
  entityId: string;
  settingType: string;
}

export function createVersionSetting(
  options: CreateVersionSettingOptions,
): Promise<ToolVersionSetting> {
  const body: CreateToolVersionSettingRequest = {
    toolType: options.toolType,
    version: options.version,
    context: options.context,
    entityId: options.entityId,
    settingType: options.settingType,
  };
  return toolsApi.createVersionSetting(body);
}

export function getVersionSettings(options?: { filter?: string }): Promise<ToolVersionSetting[]> {
  return toolsApi.getVersionSettings({ filter: options?.filter });
}

export function getVersionSettingsByContext(options: {
  context: string;
  entityId?: string;
}): Promise<ToolVersionSetting[]> {
  return toolsApi.getVersionSettingsByContext(options.context, options.entityId);
}

export interface UpdateVersionSettingOptions {
  id: string;
  toolType: string;
  version: string;
  context: string;
  entityId: string;
  settingType: string;
}

export function updateVersionSetting(
  options: UpdateVersionSettingOptions,
): Promise<ToolVersionSetting> {
  const body: CreateToolVersionSettingRequest = {
    toolType: options.toolType,
    version: options.version,
    context: options.context,
    entityId: options.entityId,
    settingType: options.settingType,
  };
  return toolsApi.updateVersionSetting(options.id, body);
}

export function deleteVersionSetting(options: { id: string }): Promise<void> {
  return toolsApi.deleteVersionSetting(options.id);
}
