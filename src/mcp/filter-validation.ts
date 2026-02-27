/**
 * Filter validation utilities for RSQL filter expressions.
 *
 * Provides a registry of valid filter keys per resource type and validation functions
 * to help agents use correct filter syntax when querying Polaris APIs.
 */

/**
 * Registry of valid RSQL filter keys per resource type.
 *
 * Portfolio tools use bare keys (name, description, etc.).
 * Findings tools use namespaced keys (occurrence:, context:, special:, triage:, type:).
 * Tests and Bug Tracking use bare keys.
 */
export const FILTER_KEYS: Record<string, string[]> = {
  // Portfolio service resources
  "portfolio.applications": [
    "id",
    "name",
    "labelId",
    "description",
    "subscriptionType",
    "inTrash",
  ],
  "portfolio.projects": [
    "id",
    "name",
    "description",
    "applicationId",
    "createdAt",
    "updatedAt",
    "projectType",
    "labelId",
    "subItemType",
    "inTrash",
  ],
  "portfolio.branches": [
    "id",
    "name",
    "source",
    "labelId",
    "isDefault",
  ],
  "portfolio.branches.org-wide": [
    "id",
    "name",
    "source",
    "labelId",
    "isDefault",
    "projectId",
    "applicationId",
  ],
  "portfolio.labels": [
    "id",
    "name",
  ],

  // Findings service resources
  "findings.issues": [
    // Occurrence namespace
    "occurrence:severity",
    "occurrence:cwe",
    "occurrence:filename",
    "occurrence:occurrence-id",
    // Context namespace
    "context:tool-type",
    // Type namespace
    "type:name",
    // Triage namespace
    "triage:status",
    // Special namespace
    "special:delta",
    // Derived namespace
    "derived:fix-by-status",
  ],
  "findings.occurrences": [
    // Occurrence namespace
    "occurrence:issue-id",
    "occurrence:severity",
    "occurrence:cwe",
    "occurrence:filename",
    "occurrence:occurrence-id",
    "occurrence:finding-key::filePath",
    // Context namespace
    "context:tool-type",
    // Type namespace
    "type:name",
  ],
  "findings.component_versions": [
    "componentVersion:name",
    "componentVersion:version",
    "componentVersion:license",
    "component-version:security-risk",
  ],
  "findings.component_origins": [
    "componentOrigin:name",
    "componentOrigin:type",
    "component-origin:external-namespace",
    "component-origin:external-id",
  ],
  "findings.taxonomies": [
    "taxonomy:name",
    "taxonomy:standard",
  ],

  // Tests service resources
  "tests": [
    "id",
    "projectId",
    "branchId",
    "status",
    "assessmentType",
    "scanMode",
    "testMode",
  ],

  // Bug Tracking service resources
  "bugtracking.configurations": [
    "id",
    "type",
    "url",
    "enabled",
  ],
  "bugtracking.external_projects": [
    "key",
    "name",
  ],
  "bugtracking.project_mappings": [
    "configurationId",
    "projectId",
    "btsProjectKey",
  ],
};

/**
 * Extract filter keys from an RSQL filter expression.
 *
 * Uses a simple regex to extract left-hand side keys from RSQL operators.
 * Does NOT implement a full RSQL parser.
 *
 * @param filter - RSQL filter expression
 * @returns Array of extracted keys (may contain duplicates)
 *
 * @example
 * extractFilterKeys("name=='test';severity==high")
 * // => ["name", "severity"]
 *
 * @example
 * extractFilterKeys("occurrence:severity=in=('critical','high')")
 * // => ["occurrence:severity"]
 */
export function extractFilterKeys(filter: string): string[] {
  const keyPattern = /([a-zA-Z0-9:._-]+)\s*(?:==|!=|=in=|=out=)/g;
  const keys: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = keyPattern.exec(filter)) !== null) {
    keys.push(match[1]);
  }

  return keys;
}

/**
 * Validate an RSQL filter expression against known valid keys for a resource type.
 *
 * Returns null if the filter is valid or the resource type is unknown (no validation available).
 * Returns an error message with valid keys if the filter contains invalid keys.
 *
 * Note: Validation is advisory. If a key is unknown, we warn but do not block,
 * since the Polaris API may add new filter keys over time.
 *
 * @param filter - RSQL filter expression to validate
 * @param resourceType - Resource type key from FILTER_KEYS registry
 * @returns null if valid, error message if invalid
 *
 * @example
 * validateFilter("name=='test'", "portfolio.projects")
 * // => null (valid)
 *
 * @example
 * validateFilter("invalid_key=='test'", "portfolio.projects")
 * // => "Invalid filter key 'invalid_key' for resource type 'portfolio.projects'. Valid keys: ..."
 */
export function validateFilter(
  filter: string,
  resourceType: string,
): string | null {
  // No validation available for unknown resource types
  const validKeys = FILTER_KEYS[resourceType];
  if (!validKeys) {
    return null;
  }

  // Extract keys from the filter
  const filterKeys = extractFilterKeys(filter);
  if (filterKeys.length === 0) {
    return null; // Empty filter or no keys extracted
  }

  // Check each key against the valid keys list
  const invalidKeys = filterKeys.filter((key) => !validKeys.includes(key));

  if (invalidKeys.length > 0) {
    const uniqueInvalidKeys = [...new Set(invalidKeys)];
    return `Invalid filter key(s) for resource type '${resourceType}': ${
      uniqueInvalidKeys.map((k) => `'${k}'`).join(", ")
    }. Valid keys: ${validKeys.join(", ")}`;
  }

  return null;
}
