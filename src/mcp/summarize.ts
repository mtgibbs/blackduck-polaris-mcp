// Summary response wrapper and per-resource summarizer functions

import type {
  Application,
  Branch,
  BugTrackingConfiguration,
  ComponentOrigin,
  ComponentVersion,
  ExternalProject,
  Issue,
  Label,
  LinkedIssue,
  Occurrence,
  PolarisTool,
  Portfolio,
  Project,
  ProjectMapping,
  ProjectSubResource,
  ScmRepository,
  Taxonomy,
  Test,
} from "../types/polaris.ts";

/**
 * Wraps a list of summarized items with total count and note.
 */
export function summarizeResponse<T, S>(
  items: T[],
  summarizer: (item: T) => S,
  note?: string,
) {
  return {
    total: items.length,
    items: items.map(summarizer),
    note: note ??
      "Showing summarized results. Use summary=false for full API response.",
  };
}

/**
 * Summarizes a Portfolio, keeping only essential fields.
 * Strips: _links, _type, tenantId, _collection
 */
export function summarizePortfolio(portfolio: Portfolio) {
  return {
    id: portfolio.id,
    name: portfolio.name,
    organizationId: portfolio.organizationId,
  };
}

/**
 * Summarizes an Application, keeping only essential fields.
 * Strips: _links, _type, tenantId, _collection, and other metadata
 */
export function summarizeApplication(app: Application) {
  return {
    id: app.id,
    name: app.name,
    description: app.description,
  };
}

/**
 * Summarizes a Project, keeping only essential fields including default branch.
 * Strips: _links, _type, tenantId, _collection, and other metadata
 */
export function summarizeProject(project: Project) {
  return {
    id: project.id,
    name: project.name,
    defaultBranch: project.defaultBranch
      ? {
        id: project.defaultBranch.id,
        name: project.defaultBranch.name,
      }
      : undefined,
  };
}

/**
 * Summarizes a Branch, keeping only essential fields.
 * Strips: _links, _type, tenantId, _collection
 */
export function summarizeBranch(branch: Branch) {
  return {
    id: branch.id,
    name: branch.name,
    isDefault: branch.isDefault,
  };
}

/**
 * Summarizes an Issue, extracting key fields from nested arrays.
 * - name comes from type._localized.name
 * - severity, cwe, file, line, toolType come from occurrenceProperties
 * - status comes from triageProperties
 * Strips: _links, _type, tenantId, _collection
 */
export function summarizeIssue(issue: Issue) {
  // Extract name from type._localized.name
  const name = issue.type?._localized?.name;

  // Extract fields from occurrenceProperties
  const severity = issue.occurrenceProperties?.find((p) => p.key === "severity")
    ?.value as string | undefined;
  const cwe = issue.occurrenceProperties?.find((p) => p.key === "cwe")?.value as
    | string
    | undefined;
  const file = issue.occurrenceProperties?.find((p) => p.key === "file")
    ?.value as string | undefined;
  const line = issue.occurrenceProperties?.find((p) => p.key === "line")
    ?.value as number | undefined;
  const toolTypeFromOccurrence = issue.occurrenceProperties?.find((p) => p.key === "tool-type")
    ?.value as string | undefined;

  // toolType might also be in context
  const toolType = toolTypeFromOccurrence ?? issue.context?.toolType;

  // Extract status from triageProperties
  const status = issue.triageProperties?.find((p) => p.key === "status")
    ?.value as string | undefined;

  return {
    id: issue.id,
    name,
    severity,
    cwe,
    file,
    line,
    toolType,
    status,
    firstDetectedOn: issue.firstDetectedOn,
  };
}

/**
 * Summarizes an Occurrence, extracting key fields from properties array.
 * - issueId, severity, file, line, toolType come from properties
 * Strips: _links, _type, tenantId, _collection
 */
export function summarizeOccurrence(occurrence: Occurrence) {
  // Extract fields from properties
  const issueId = occurrence.properties?.find((p) => p.key === "issue-id")
    ?.value as string | undefined;
  const severity = occurrence.properties?.find((p) => p.key === "severity")
    ?.value as string | undefined;
  const file = occurrence.properties?.find((p) => p.key === "file")?.value as
    | string
    | undefined;
  const line = occurrence.properties?.find((p) => p.key === "line")?.value as
    | number
    | undefined;
  const toolType = occurrence.properties?.find((p) => p.key === "tool-type")
    ?.value as string | undefined;

  return {
    id: occurrence.id,
    issueId,
    severity,
    file,
    line,
    toolType,
  };
}

/**
 * Summarizes a Test, keeping only essential fields.
 * Strips: _links, _type, tenantId, _collection
 */
export function summarizeTest(test: Test) {
  return {
    id: test.id,
    status: test.status,
    assessmentType: test.assessmentType,
    scanMode: test.scanMode,
    startedAt: test.startedAt,
    completedAt: test.completedAt,
  };
}

/**
 * Summarizes a Bug Tracking Configuration, keeping only essential fields.
 * Strips: _links, _type, tenantId, _collection
 */
export function summarizeBugTrackingConfig(config: BugTrackingConfiguration) {
  return {
    id: config.id,
    type: config.type,
    url: config.url,
    enabled: config.enabled,
  };
}

/**
 * Summarizes a Linked Issue, keeping only essential fields.
 * Strips: _links, _type, tenantId, _collection
 */
export function summarizeLinkedIssue(linkedIssue: LinkedIssue) {
  return {
    id: linkedIssue.id,
    issueId: linkedIssue.issueId,
    issueKey: linkedIssue.issueKey,
    issueLink: linkedIssue.issueLink,
    status: linkedIssue.status,
  };
}

/**
 * Summarizes an External Project, keeping only essential fields.
 * Strips: _links, _type, tenantId, _collection (ExternalProject is already small)
 */
export function summarizeExternalProject(project: ExternalProject) {
  return {
    id: project.id,
    key: project.key,
    name: project.name,
  };
}

/**
 * Summarizes a Label, keeping only essential fields.
 * Strips: _links, _type, createdAt, updatedAt
 */
export function summarizeLabel(label: Label) {
  return {
    id: label.id,
    name: label.name,
    description: label.description,
  };
}

/**
 * Summarizes a Project Sub Resource (branch or profile), keeping only essential fields.
 * Strips: _type and keeps essential identifying info
 */
export function summarizeProjectSubResource(resource: ProjectSubResource) {
  return {
    id: resource.id,
    name: resource.name,
    projectSubResourceType: resource.projectSubResourceType,
    default: resource.default,
    project: resource.project,
    application: resource.application,
  };
}

/**
 * Summarizes a ComponentVersion, keeping only essential fields.
 * Strips: _links, _type, matchTypes details, triageProperties
 */
export function summarizeComponentVersion(cv: ComponentVersion) {
  const licenseId = cv.licenseDefinition?.licenses?.[0]?.id ??
    cv.licenseDefinition?.license?.[0]?.id;
  return {
    id: cv.id,
    name: cv.component?.name,
    version: cv.version,
    license: licenseId,
  };
}

/**
 * Summarizes a ComponentOrigin, keeping only essential fields.
 * Strips: _links, _type, upgrade guidance details
 */
export function summarizeComponentOrigin(co: ComponentOrigin) {
  return {
    id: co.id,
    name: co.externalId,
    type: co.externalNamespace,
  };
}

/**
 * Summarizes a Taxonomy, keeping only essential fields.
 * Strips: subtaxa array, keeps localized name
 */
export function summarizeTaxonomy(taxonomy: Taxonomy) {
  return {
    id: taxonomy.id,
    name: taxonomy._localized?.name,
    standard: taxonomy._localized?.otherDetails?.find(
      (d) => d.key === "standard",
    )?.value,
  };
}

/**
 * Summarizes a ProjectMapping, keeping only essential fields.
 * Strips: _links
 */
export function summarizeProjectMapping(mapping: ProjectMapping) {
  return {
    id: mapping.id,
    projectId: mapping.projectId,
    btsProjectKey: mapping.btsProjectKey,
    btsIssueType: mapping.btsIssueType,
  };
}

/**
 * Summarizes an SCM Repository, keeping only essential fields.
 * Strips: _links, organizationId, createdBy, updatedBy, timestamps
 */
export function summarizeScmRepository(repo: ScmRepository) {
  return {
    id: repo.id,
    name: repo.repositoryUrl,
    url: repo.repositoryUrl,
    provider: repo.scmProvider,
  };
}

/**
 * Summarizes a Polaris Tool, keeping only essential fields.
 * Strips: _links, _type, beta flag
 */
export function summarizePolarisTool(tool: PolarisTool) {
  return {
    id: tool.id,
    name: tool.name,
    type: tool.type,
    version: tool.version,
    status: tool.status,
  };
}
