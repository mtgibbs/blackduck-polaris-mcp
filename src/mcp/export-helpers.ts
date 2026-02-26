import { getConfigProjectMappings } from "../services/index.ts";

/**
 * Auto-resolves project_mapping_id and bts_issue_type_id for export operations.
 *
 * @param configId - Bug tracking configuration ID
 * @param projectId - Polaris project ID to find mapping for
 * @param btsIssueTypeId - Optional explicit BTS issue type ID (skips auto-resolution if provided)
 * @returns {projectMappingId, issueTypeId} on success, or {error: string} on failure
 */
export async function resolveExportParams(
  configId: string,
  projectId: string,
  btsIssueTypeId?: string,
): Promise<
  | { projectMappingId: string; issueTypeId: string }
  | { error: string }
> {
  // Fetch all project mappings for this configuration
  const mappings = await getConfigProjectMappings({ configurationId: configId });

  // Find the mapping that matches the provided projectId
  const mapping = mappings.find((m) => m.projectId === projectId);

  if (!mapping) {
    return {
      error: `No project mapping found for projectId '${projectId}' under config '${configId}'. ` +
        `Use get_config_project_mappings to list available mappings, or create_config_project_mapping to create one.`,
    };
  }

  // Determine the issue type ID to use
  let issueTypeId: string;

  if (btsIssueTypeId) {
    // User explicitly provided an issue type ID - use it
    issueTypeId = btsIssueTypeId;
  } else if (mapping.btsIssueType) {
    // Use the default issue type from the mapping
    issueTypeId = mapping.btsIssueType;
  } else {
    // No default issue type and none provided
    return {
      error:
        `Project mapping '${mapping.id}' has no default issue type, and bts_issue_type_id was not provided. ` +
        `Use get_external_issue_types to list available issue types for the external project.`,
    };
  }

  return {
    projectMappingId: mapping.id,
    issueTypeId,
  };
}
