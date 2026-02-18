// --- Portfolio ---

export type SubscriptionType = "PARALLEL" | "CONCURRENT";

export type SubItemType = "PROJECT" | "DAST";

export type BranchSource = "USER";

export interface Portfolio {
  id: string;
  name: string;
  organizationId?: string;
  description?: string;
  _links: LinkEntry[];
}

export interface Entitlements {
  entitlementIds?: string[];
  quantity?: number;
}

export interface Application {
  id: string;
  name: string;
  description?: string;
  subscriptionTypeUsed?: SubscriptionType;
  portfolioId?: string;
  labelIds?: string[];
  entitlements?: Entitlements;
  riskFactorMapping?: Record<string, string>;
  inTrash?: boolean;
  createdAt?: string;
  updatedAt?: string;
  autoDeleteSetting?: boolean;
  branchRetentionPeriodSetting?: number;
  _links: LinkEntry[];
}

export interface DefaultBranch {
  id: string;
  name: string;
  description?: string;
  source?: BranchSource;
  isDefault?: boolean;
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
  _links: LinkEntry[];
}

export interface Branch {
  id: string;
  name: string;
  description?: string;
  source?: BranchSource;
  isDefault?: boolean;
  _links: LinkEntry[];
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
  tenantId?: string;
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
  name?: string;
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
  tenantId?: string;
  properties?: OccurrenceProperty[];
  type?: FindingsType;
  _type?: string;
  _links: LinkEntry[];
}

// --- Code Snippet ---

export interface CodeSnippet {
  "main-event-file-path"?: string;
  "main-event-line-number"?: number;
  language?: string;
  events?: SnippetEvent[];
  "example-events-groups"?: EventGroup[];
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
  events?: SnippetEvent[];
}

// --- Remediation Assist ---

export interface AssistResponse {
  id: string;
  summary?: string;
  codeAnalysis?: string;
  analysis?: string;
  suggestedFix?: string | null;
  feedbackResponses?: AssistFeedback[];
}

export interface AssistFeedback {
  disposition: boolean;
  comment?: string;
}

// --- DAST Evidence ---

export interface Evidence {
  label?: string;
  attack?: Attack;
  _links?: LinkEntry[];
}

export interface Attack {
  scope?: AttackScope;
  segment?: AttackSegment;
  payload?: string;
  target?: string;
}

// --- Assist Feedback Request ---

export interface AssistFeedbackPatch {
  op: "add";
  path: "/feedbackResponses/-";
  value: AssistFeedback;
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

// --- Bug Tracking ---

export type BugTrackingSystemType = "JIRA" | "AZURE";

export type JiraDeploymentType = "CLOUD" | "SERVER";

export interface BugTrackingConfiguration {
  id: string;
  name: string;
  bugTrackingSystemType: BugTrackingSystemType;
  jiraDeploymentType?: JiraDeploymentType;
  url?: string;
  _links: LinkEntry[];
}

export interface ExternalProject {
  key: string;
  name: string;
}

export interface ExternalIssueType {
  id: string;
  name: string;
}

export interface ProjectMapping {
  id: string;
  configurationId: string;
  projectId: string;
  branchId?: string;
  externalProjectKey: string;
  externalIssueTypeId: string;
  _links: LinkEntry[];
}

export interface IssueExportResult {
  issueId: string;
  externalTicketId?: string;
  externalTicketUrl?: string;
  status: string;
  error?: string;
}

// --- Common ---

export interface LinkEntry {
  href: string;
  rel: string;
  method?: string;
}
