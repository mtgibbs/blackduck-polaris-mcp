// Summary response wrapper and per-resource summarizer functions

import type {
  Application,
  Branch,
  BugTrackingConfiguration,
  ExternalProject,
  Issue,
  LinkedIssue,
  Occurrence,
  Portfolio,
  Project,
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
  const toolTypeFromOccurrence = issue.occurrenceProperties?.find((p) =>
    p.key === "tool-type"
  )?.value as string | undefined;

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
