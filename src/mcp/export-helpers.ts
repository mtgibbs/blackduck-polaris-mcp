import { getConfigProjectMappings } from "../services/index.ts";

/**
 * Resolves project_mapping_id and bts_issue_type_id for issue export operations.
 *
 * @param configId - Bug tracking configuration ID
 * @param projectId - Polaris project ID
 * @param btsIssueTypeId - Optional explicit issue type ID (overrides mapping default)
 * @returns Success: {projectMappingId, issueTypeId} | Error: {error: string}
 */
export async function resolveExportParams(
  configId: string,
  projectId: string,
  btsIssueTypeId?: string,
): Promise<{ projectMappingId: string; issueTypeId: string } | { error: string }> {
  const mappings = await getConfigProjectMappings({ configurationId: configId });
  const mapping = mappings.find((m) => m.projectId === projectId);

  if (!mapping) {
    return {
      error:
        `No project mapping for project ${projectId} in config ${configId}. Use get_config_project_mappings to see available mappings.`,
    };
  }

  const typeId = btsIssueTypeId ?? mapping.btsIssueType;
  if (!typeId) {
    return {
      error:
        `No default issue type on mapping. Use get_external_issue_types to find valid types.`,
    };
  }

  return { projectMappingId: mapping.id, issueTypeId: typeId };
}
