// --- Portfolio ---

export type SubscriptionType = "PARALLEL" | "CONCURRENT";

export type SubItemType = "PROJECT" | "DAST";

export type BranchSource = "USER" | "SCM" | "CI";

// Note: The OpenAPI spec only defines `id` for Portfolio. The additional fields
// (name, organizationId, description, _links) are not in the spec but may be returned by the API.
export interface Portfolio {
  id: string;
  name?: string;
  organizationId?: string;
  description?: string;
  _links?: LinkEntry[];
}

export interface Entitlements {
  entitlementIds?: string[];
  quantity?: number;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  subscriptionTypeUsed: SubscriptionType;
  portfolioId: string;
  labelIds?: string[];
  entitlements?: Entitlements;
  riskFactorMapping?: Record<string, string>;
  inTrash: boolean;
  createdAt: string;
  updatedAt: string;
  autoDeleteSetting: boolean;
  branchRetentionPeriodSetting: number;
  // Note: _links is not in the OpenAPI spec for applications but may be returned by the API.
  _links?: LinkEntry[];
}

export interface DefaultBranch {
  id: string;
  name: string;
  description?: string;
  source?: BranchSource;
  isDefault?: boolean;
  autoDeleteSetting?: boolean;
  branchRetentionPeriodSetting?: number;
  autoDeleteSettingsCustomized?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  subItemType?: SubItemType;
  portfolioItemId?: string;
  defaultBranch?: DefaultBranch;
  labelIds?: string[];
  inTrash?: boolean;
  createdAt?: string;
  updatedAt?: string;
  autoDeleteSetting?: boolean;
  branchRetentionPeriodSetting?: number;
  autoDeleteSettingsCustomized?: boolean;
  // Present in org-wide projects response (PortfolioCatalogProjectDetails)
  applicationId?: string;
  branches?: CatalogBranch[];
  // _links is present in app-scoped response but not in org-wide response
  _links?: LinkEntry[];
}

// Branch details returned in the org-wide projects response (PortfolioCatalogBranchDetails)
export interface CatalogBranch {
  id: string;
  name: string;
  description?: string;
  source?: BranchSource;
  isDefault?: boolean;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
  autoDeleteSetting?: boolean;
  autoDeleteSettingsCustomized?: boolean;
  branchRetentionPeriodSetting?: number;
}

export interface Branch {
  id: string;
  name: string;
  description?: string;
  source?: BranchSource;
  isDefault?: boolean;
  labelIds?: string[];
  autoDeleteSetting?: boolean;
  autoDeleteSettingsCustomized?: boolean;
  branchRetentionPeriodSetting?: number;
  // _links present in single-branch response but not in GET-all list items per spec
  _links?: LinkEntry[];
}

// --- Findings ---

export type ToolType = "dast" | "sast" | "sca";

export type EventType = "MAIN" | "PATH" | "EVIDENCE" | "EXAMPLE" | "SUPPORTING";

export type Delta = "new" | "common" | "resolved" | "new-in-test" | "new-post-test";

export type FixByStatus = "overdue" | "due-soon" | "on-track" | "not-set";

export type AttackScope = "Application" | "Endpoint" | "Data";

export type AttackSegment =
  | "Undefined"
  | "Body"
  | "ContentType"
  | "Cookie"
  | "Header"
  | "HTMLHiddenField"
  | "HTMLMetaTag"
  | "Location"
  | "QueryString"
  | "Path"
  | "StatusCode"
  | "Fragment";

// --- Issue ---

export interface Issue {
  id: string;
  _type: string;
  weaknessId?: string;
  excluded?: boolean;
  updatedAt?: string;
  firstDetectedOn?: string;
  type?: FindingsType;
  context?: IssueContext;
  occurrenceProperties?: OccurrenceProperty[];
  triageProperties?: TriageProperty[];
  componentLocations?: ComponentLocation[];
  _links: LinkEntry[];
}

export interface FindingsType {
  id: string;
  altName?: string;
  _localized?: LocalizedTypeInfo;
}

export interface LocalizedTypeInfo {
  name?: string;
  otherDetails?: LocalizedDetail[];
}

export interface LocalizedDetail {
  key: string;
  value: string;
}

export interface IssueContext {
  toolType?: ToolType;
  toolId?: string;
  scanMode?: string;
  toolVersion?: string;
  date?: string;
  tenantId?: string;
  _links?: LinkEntry[];
}

export interface OccurrenceProperty {
  key: string;
  value: string | boolean | number | Evidence[];
}

export interface TriageProperty {
  key: string;
  value: string | boolean | null;
  author?: TriageAuthor;
  timestamp?: string;
  _links?: LinkEntry[];
}

export interface TriageAuthor {
  id?: string;
  _links?: LinkEntry[];
}

export interface ComponentLocation {
  filePath?: string;
  lineLocations?: LineLocation[];
}

export interface LineLocation {
  lineNumber?: number;
  columnLocations?: ColumnLocation[];
}

export interface ColumnLocation {
  columnStart?: number;
  columnEnd?: number;
}

// --- Occurrence ---

export interface Occurrence {
  id: string;
  tenantId: string;
  properties?: OccurrenceProperty[];
  type?: FindingsType;
  _type: string;
  _links: LinkEntry[];
}

// --- Code Snippet ---

export interface CodeSnippet {
  "main-event-file-path"?: string;
  "main-event-line-number"?: number;
  language?: string;
  events?: SnippetEvent[];
  "example-events-groups"?: EventGroup[];
  "example-events-caption"?: string;
}

export interface SnippetEvent {
  "event-description"?: string;
  "event-number"?: number;
  "event-set"?: number;
  "event-tag"?: string;
  "event-type"?: EventType;
  "line-number"?: number;
  "file-path"?: string;
  "source-before"?: SourceContext;
  "source-after"?: SourceContext;
  "evidence-events"?: SnippetEvent[];
}

export interface SourceContext {
  "start-line"?: number;
  "end-line"?: number;
  "source-code"?: string;
}

export interface EventGroup {
  "event-set"?: number;
  events?: SnippetEvent[];
}

// --- Remediation Assist ---

export interface AssistResponse {
  id: string;
  summary?: string;
  codeAnalysis?: string;
  analysis?: string;
  suggestedFix?: string | null;
  feedbackResponses: AssistFeedback[];
}

export interface AssistFeedback {
  disposition: boolean;
  comment?: string;
}

// --- DAST Evidence ---

export interface Evidence {
  label: string;
  attack?: Attack;
  _links?: LinkEntry[];
}

export interface Attack {
  scope?: AttackScope;
  segment?: AttackSegment;
  payload?: string;
  target?: string;
}

// --- Detection History ---

export type DetectionEventType = "FIRST_DETECTED" | "ABSENT" | "DETECTED_AGAIN";

export interface DetectionHistoryEvent {
  eventType: DetectionEventType;
  date: string;
}

export interface DetectionHistory {
  history: DetectionHistoryEvent[];
}

// --- Assist Feedback Request ---

export interface AssistFeedbackPatch {
  op: "add";
  path: "/feedbackResponses/-";
  value: AssistFeedback;
}

// --- Triage ---

export type TriageKey =
  | "comment"
  | "status"
  | "dismissal-reason"
  | "is-dismissed"
  | "owner"
  | "fix-by";

export interface TriagePropertyInput {
  key: TriageKey;
  value: string | boolean | null;
}

export interface TriageRequest {
  filter?: string;
  triageProperties: TriagePropertyInput[];
}

export interface TriageResult {
  count: number;
  _type?: string;
}

// --- Issue Count ---

export interface IssueCountGroup {
  key: string;
  value?: string;
  childTaxaGroup?: string;
  valueId?: string;
}

export interface IssueCountItem {
  group: IssueCountGroup[];
  count: number;
  averageAgeInDays?: number | null;
  _type?: string;
}

// --- Issue Export ---

export interface IssueExportItem {
  type: string;
  severity: string;
  location: string;
  fileName?: string;
  toolType: string;
  triageStatus?: string;
  fixByDate?: string;
  cwe?: string;
  cve?: string;
  bdsa?: string;
  application?: string;
  project?: string;
  branch?: string;
  link: string;
}

// --- Issue Count Over Time ---

export interface IssueCountOverTimeEntry {
  detectedCount?: number;
  absentCount?: number;
  date?: string;
  toolType?: string;
  toolId?: string;
}

export interface IssueCountOverTimeResponse {
  issuesOverTime: IssueCountOverTimeEntry[];
  _links?: LinkEntry[];
  _type?: string;
}

// --- Pending Approval ---

export type PendingApprovalAction = "approved" | "rejected";

export interface PendingApprovalRequest {
  ids: string[];
  action: PendingApprovalAction;
  comment?: string;
}

// --- Tests ---

export interface Test {
  id: string;
  projectId: string;
  branchId?: string;
  status: string;
  assessmentType?: string;
  testMode?: string;
  scanMode?: string;
  startedAt?: string;
  completedAt?: string;
  _links: LinkEntry[];
}

export interface TestMetrics {
  totalIssues?: number;
  criticalIssues?: number;
  highIssues?: number;
  mediumIssues?: number;
  lowIssues?: number;
}

export interface CreateTestRequest {
  projectId: string;
  branchId?: string;
  assessmentTypes: string[];
  testMode?: string;
  scanMode?: string;
  artifacts?: string[];
  notes?: string;
  triage?: string;
  profileDetails?: {
    id?: string;
    content?: string;
  };
}

export type TestAction = "RESUME" | "CANCEL" | "FAILED";

export interface UpdateTestRequest {
  action: TestAction;
  artifacts?: string[];
  toolId?: string;
  notes?: string;
}

export interface TestComment {
  id: string;
  testId: string;
  text: string;
  createdAt: string;
  author?: string;
  _links?: LinkEntry[];
}

export interface TestArtifactMetadata {
  id: string;
  type: string;
  filename?: string;
  status?: string;
  signedUrl?: string;
  _links?: LinkEntry[];
}

export interface TestProfile {
  id: string;
  name: string;
  url?: string;
  configuration?: Record<string, unknown>;
  _links?: LinkEntry[];
}

export interface SubscriptionMetrics {
  subscriptionId: string;
  metrics: Record<string, unknown>;
  _links?: LinkEntry[];
}

export interface CreateArtifactResponse {
  artifactId: string;
  signedUrl: string;
  createdAt: string;
  _links?: LinkEntry[];
}

export interface CreateTestResponse {
  _items: Array<{
    status: number;
    headers: Record<string, string>;
    body: Test;
  }>;
  _links?: LinkEntry[];
}

// --- Bug Tracking ---

export type BugTrackingSystemType = "JIRA" | "AZURE";

export interface BugTrackingConfiguration {
  id: string;
  type: BugTrackingSystemType;
  url?: string;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  details?: { deploymentType?: string };
  _links?: LinkEntry[];
}

export interface ExternalProject {
  id: string;
  key: string;
  name: string;
}

export interface ExternalIssueType {
  id: string;
  name: string;
}

export interface ProjectMapping {
  id: string;
  projectId: string;
  configurationId: string;
  btsProjectKey: string;
  btsProjectId?: string;
  btsIssueType: string;
  _links?: LinkEntry[];
}

export interface LinkedIssue {
  id: string;
  tenantId?: string;
  issueId: string;
  branchId?: string;
  status: string;
  issueKey?: string;
  issueLink?: string;
  createdAt?: string;
  _links?: LinkEntry[];
}

// --- Taxonomy ---

export interface TaxonLocalizedOtherDetail {
  key: string;
  value: string;
}

export interface TaxonLocalized {
  name?: string;
  issueTypeNames?: string[];
  otherDetails: TaxonLocalizedOtherDetail[];
}

export interface Taxon {
  id: string;
  subtaxa: string[];
  isRoot: boolean;
  _localized: TaxonLocalized;
}

export interface Taxonomy {
  id: string;
  subtaxa: string[];
  _localized: TaxonLocalized;
}

export interface TaxonIssueTypeLocalized {
  name?: string;
  otherDetails: TaxonLocalizedOtherDetail[];
}

export interface TaxonIssueType {
  id: string;
  _localized: TaxonIssueTypeLocalized;
}

// --- Component Versions ---

export type SecurityRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type MatchType =
  | "FILE_DEPENDENCY_DIRECT"
  | "FILE_DEPENDENCY_TRANSITIVE"
  | "FILE_EXACT"
  | "FILE_EXACT_FILE_MATCH"
  | "FILE_FILES_ADDED_DELETED_AND_MODIFIED"
  | "FILE_SOME_FILES_MODIFIED";

export interface ComponentInfo {
  id: string;
  name: string;
  description?: string;
  homePage?: string;
  openHubPage?: string;
}

export interface LicenseEntry {
  id?: string;
  _links?: LinkEntry[];
}

export interface LicenseDefinition {
  type?: "CONJUNCTIVE" | "DISJUNCTIVE";
  licenses?: LicenseEntry[];
  license?: LicenseEntry[];
}

export interface ComponentVersionTriageProperty {
  key: string;
  value: string | boolean;
}

export interface ComponentVersion {
  id: string;
  version: string;
  releaseDate?: string;
  securityRisk?: SecurityRisk;
  matchTypes: MatchType[];
  matchScore: number;
  usages: string[];
  component?: ComponentInfo;
  licenseDefinition?: LicenseDefinition;
  originalLicenseDefinition?: LicenseDefinition;
  triageProperties?: ComponentVersionTriageProperty[];
  _links?: LinkEntry[];
  _type?: string;
}

export interface ComponentVersionCountGroup {
  key: string;
  value: string;
}

export interface ComponentVersionCountItem {
  group: ComponentVersionCountGroup[];
  count: number;
  _cursor?: string;
  _type?: string;
}

export interface ComponentVersionModifyRequest {
  componentId?: string;
  componentVersionId?: string;
  componentOriginId?: string;
  comment?: string;
}

export interface ComponentVersionModifyResponse {
  componentVersionId: string;
  operationId: string;
  actionType: string;
  _type?: string;
}

export type OperationStatusType = "PROCESSING" | "COMPLETED" | "ERROR";
export type OperationActionType = "ADD" | "EDIT" | "DELETE";

export interface OperationStatus {
  status: OperationStatusType;
  actionType: OperationActionType;
  timestamp: string;
  _type?: string;
}

// --- Component Version Activity Log, Triage History, License Assignment ---

export interface ActivityLogEntry {
  actionType: string;
  fromComponentId?: string;
  fromComponent?: string;
  fromComponentVersionId?: string;
  fromComponentVersion?: string;
  fromComponentOrigin?: number;
  componentId?: string;
  component?: string;
  componentVersionId?: string;
  componentVersion?: string;
  componentOriginId?: string;
  componentOrigin?: string;
  timestamp: string;
  comment?: string;
  projectId?: string;
  _links?: LinkEntry[];
  _type?: string;
}

export interface LicenseDefinitionResponse {
  licenseDefinition?: LicenseDefinition;
}

export interface TriageHistoryTransaction {
  latestAuthor?: { id: string; _links?: LinkEntry[] } | null;
  latestTimestamp: string;
  triageProperties: TriageProperty[];
  _cursor?: string;
  _type?: string;
  _links?: LinkEntry[];
}

// --- Component Origins ---

export interface SecurityRiskCounts {
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

export interface UpgradeGuidanceTarget {
  componentId?: string;
  componentName?: string;
  componentVersionId?: string;
  componentOriginId?: string;
  externalId?: string;
  versionName?: string;
  securityRisk?: SecurityRiskCounts;
  _links?: LinkEntry[];
}

export interface UpgradeGuidance {
  shortTerm?: UpgradeGuidanceTarget;
  longTerm?: UpgradeGuidanceTarget;
}

export interface TransitiveUpgradeGuidance {
  externalId?: string;
  shortTerm?: UpgradeGuidanceTarget;
  longTerm?: UpgradeGuidanceTarget;
}

export interface ComponentOrigin {
  id: string;
  componentId: string;
  externalNamespace: string;
  externalId: string;
  packageUrl?: string;
  matchesCount?: number;
  securityRisk?: SecurityRiskCounts;
  upgradeGuidance?: UpgradeGuidance;
  transitiveUpgradeGuidance?: TransitiveUpgradeGuidance[];
  _links?: LinkEntry[];
  _type?: string;
}

export interface ComponentOriginMatch {
  id: string;
  matchType: MatchType;
  externalIds?: string[];
  fileUri?: string;
  _cursor?: string;
  _type?: string;
}

// --- Common ---

export interface LinkEntry {
  href: string;
  rel: string;
  method: string;
}
