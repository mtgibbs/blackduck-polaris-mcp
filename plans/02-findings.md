# Findings API - Comprehensive Implementation Plan

## Section 1: API Spec Summary

### 1.1 Overview

- **OpenAPI Version:** 3.1.0
- **Title:** Findings
- **Authentication:** ApiKeyAuth (header: `Api-token`)
- **Base path:** `https://polaris.blackduck.com/api/findings`
- **Pagination:** Cursor-based (`_cursor` / `_first` / `_last`)
- **Filtering:** RSQL syntax via `_filter` query parameter
- **Sorting:** `{field}|{asc|desc}` via `_sort` query parameter
- **Default page size:** 100 items when `_first`/`_last` are not specified

### 1.2 Media Types

| Media Type                                                                 | Usage                                                    |
| -------------------------------------------------------------------------- | -------------------------------------------------------- |
| `application/vnd.polaris.findings.issues-1+json`                           | Issues endpoints (list, get by ID)                       |
| `application/vnd.polaris.findings.occurrences-1+json`                      | Occurrences endpoints (list, get by ID, snippet, assist) |
| `application/vnd.polaris.findings.component-versions-1+json`               | Component version resources                              |
| `application/vnd.polaris-one.issue-management.issue-1+json`                | Legacy issue endpoints (deprecated)                      |
| `application/vnd.polaris-one.issue-management.issue-paginated-list-1+json` | Legacy issue list (deprecated)                           |
| `application/vnd.polaris-one.issue-management.snippet-1+json`              | Legacy snippet endpoint (deprecated)                     |
| `text/plain`                                                               | Artifact retrieval (base64-encoded)                      |
| `application/problem+json`                                                 | Error responses                                          |

### 1.3 Endpoints

#### Current Endpoints (under `/api/findings/`)

| Method | Path                                                    | OperationId                                      | Summary                                             |
| ------ | ------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| GET    | `/api/findings/issues`                                  | `updatedTaxonomyGetIssues`                       | Get issues (paginated list)                         |
| GET    | `/api/findings/issues/{id}`                             | `updatedTaxonomyGetIssueByID`                    | Get issue by ID                                     |
| GET    | `/api/findings/occurrences`                             | `updatedTaxonomyGetOccurrences`                  | Get occurrences (paginated list)                    |
| GET    | `/api/findings/occurrences/{id}`                        | `updatedTaxonomyGetOccurrenceByID`               | Get occurrence by ID                                |
| GET    | `/api/findings/occurrences/{id}/snippet`                | `updatedTaxonomyGetOccurrenceSnippet`            | Get occurrence code snippet                         |
| GET    | `/api/findings/occurrences/{id}/assist`                 | `updatedTaxonomyGetOccurrenceAssist`             | Generate SAST remediation guidance (Polaris Assist) |
| PATCH  | `/api/findings/occurrences/{id}/assist/{assistId}`      | `updatedTaxonomyProvideOccurrenceAssistFeedback` | Provide feedback on remediation guidance            |
| GET    | `/api/findings/occurrences/{id}/artifacts/{artifactId}` | `updatedTaxonomyGetArtifactById`                 | Get artifact by ID (base64 encoded)                 |

#### Deprecated Legacy Endpoints (under `/api/specialization-layer-service/`)

| Method | Path                                                                   | OperationId                  | Summary                        |
| ------ | ---------------------------------------------------------------------- | ---------------------------- | ------------------------------ |
| GET    | `/api/specialization-layer-service/issues/_actions/list`               | `getIssues`                  | Get issues (deprecated)        |
| GET    | `/api/specialization-layer-service/issues/{id}`                        | `getIssueByID`               | Get issue by ID (deprecated)   |
| GET    | `/api/specialization-layer-service/issues/{id}/snippet`                | `getIssueSnippet`            | Get issue snippet (deprecated) |
| GET    | `/api/specialization-layer-service/issues/{id}/assist`                 | `getIssueAssist`             | Get assist (deprecated)        |
| PATCH  | `/api/specialization-layer-service/issues/{id}/assist/{assistId}`      | `provideIssueAssistFeedback` | Provide feedback (deprecated)  |
| GET    | `/api/specialization-layer-service/issues/{id}/artifacts/{artifactId}` | `getArtifactById`            | Get artifact (deprecated)      |

> **Note:** Our implementation should use ONLY the current `/api/findings/` endpoints, not the
> deprecated legacy ones.

---

### 1.4 Query Parameters by Endpoint

#### GET `/api/findings/issues` (List Issues)

| Name                           | In     | Type    | Required | Default | Description                             |
| ------------------------------ | ------ | ------- | -------- | ------- | --------------------------------------- |
| `Accept-Language`              | header | string  | no       | -       | Language preference per RFC 7231        |
| `applicationId`                | query  | string  | no       | -       | Scope to specific application           |
| `projectId`                    | query  | string  | no       | -       | Scope to specific project               |
| `branchId`                     | query  | string  | no       | -       | Scope to specific branch                |
| `testId`                       | query  | string  | no       | -       | Test ID or "latest" keyword             |
| `_filter`                      | query  | string  | no       | -       | RSQL filter expression                  |
| `_sort`                        | query  | string  | no       | -       | Sort expression: `{field}\|{asc\|desc}` |
| `_cursor`                      | query  | string  | no       | -       | Cursor for pagination                   |
| `_first`                       | query  | integer | no       | 100     | Forward pagination limit (1-500)        |
| `_last`                        | query  | integer | no       | -       | Backward pagination limit (1-500)       |
| `_includeType`                 | query  | boolean | no       | false   | Include issue type information          |
| `_includeOccurrenceProperties` | query  | boolean | no       | false   | Include sample occurrence properties    |
| `_includeTriageProperties`     | query  | boolean | no       | false   | Include triage state properties         |
| `_includeFirstDetectedOn`      | query  | boolean | no       | false   | Include first detection timestamp       |
| `_includeContext`              | query  | boolean | no       | false   | Include tool context information        |

> **Note:** `_first` and `_last` are mutually exclusive.

#### GET `/api/findings/issues/{id}` (Get Issue by ID)

| Name                 | In    | Type    | Required | Default | Description                   |
| -------------------- | ----- | ------- | -------- | ------- | ----------------------------- |
| `id`                 | path  | string  | yes      | -       | Issue ID                      |
| `applicationId`      | query | string  | no       | -       | Scope to specific application |
| `projectId`          | query | string  | no       | -       | Scope to specific project     |
| `branchId`           | query | string  | no       | -       | Scope to specific branch      |
| `testId`             | query | string  | no       | -       | Test ID or "latest"           |
| `_includeAttributes` | query | boolean | no       | false   | Include issue attributes      |

#### GET `/api/findings/occurrences` (List Occurrences)

| Name                 | In     | Type    | Required | Default | Description                             |
| -------------------- | ------ | ------- | -------- | ------- | --------------------------------------- |
| `Accept-Language`    | header | string  | no       | -       | Language preference per RFC 7231        |
| `applicationId`      | query  | string  | no       | -       | Scope to specific application           |
| `projectId`          | query  | string  | no       | -       | Scope to specific project               |
| `branchId`           | query  | string  | no       | -       | Scope to specific branch                |
| `testId`             | query  | string  | no       | -       | Test ID or "latest" keyword             |
| `_filter`            | query  | string  | no       | -       | RSQL filter expression                  |
| `_sort`              | query  | string  | no       | -       | Sort expression: `{field}\|{asc\|desc}` |
| `_cursor`            | query  | string  | no       | -       | Cursor for pagination                   |
| `_first`             | query  | integer | no       | 100     | Forward pagination limit (1-500)        |
| `_last`              | query  | integer | no       | -       | Backward pagination limit (1-500)       |
| `_includeProperties` | query  | boolean | no       | false   | Include occurrence attributes           |
| `_includeType`       | query  | boolean | no       | false   | Include occurrence type information     |

#### GET `/api/findings/occurrences/{id}` (Get Occurrence by ID)

| Name            | In    | Type   | Required | Default | Description                   |
| --------------- | ----- | ------ | -------- | ------- | ----------------------------- |
| `id`            | path  | string | yes      | -       | Occurrence ID                 |
| `applicationId` | query | string | no       | -       | Scope to specific application |
| `projectId`     | query | string | no       | -       | Scope to specific project     |
| `branchId`      | query | string | no       | -       | Scope to specific branch      |
| `testId`        | query | string | no       | -       | Test ID or "latest"           |

#### GET `/api/findings/occurrences/{id}/snippet` (Get Code Snippet)

| Name            | In    | Type   | Required | Default | Description                   |
| --------------- | ----- | ------ | -------- | ------- | ----------------------------- |
| `id`            | path  | string | yes      | -       | Occurrence ID                 |
| `applicationId` | query | string | no       | -       | Scope to specific application |
| `projectId`     | query | string | no       | -       | Scope to specific project     |
| `branchId`      | query | string | no       | -       | Scope to specific branch      |
| `testId`        | query | string | no       | -       | Test ID or "latest"           |

#### GET `/api/findings/occurrences/{id}/assist` (Get Remediation Assist)

| Name            | In    | Type   | Required | Default | Description                   |
| --------------- | ----- | ------ | -------- | ------- | ----------------------------- |
| `id`            | path  | string | yes      | -       | Occurrence ID                 |
| `applicationId` | query | string | no       | -       | Scope to specific application |
| `projectId`     | query | string | no       | -       | Scope to specific project     |
| `branchId`      | query | string | no       | -       | Scope to specific branch      |
| `testId`        | query | string | no       | -       | Test ID or "latest"           |

#### PATCH `/api/findings/occurrences/{id}/assist/{assistId}` (Provide Assist Feedback)

| Name       | In   | Type   | Required | Default | Description        |
| ---------- | ---- | ------ | -------- | ------- | ------------------ |
| `id`       | path | string | yes      | -       | Occurrence ID      |
| `assistId` | path | string | yes      | -       | Assist response ID |

**Request Body:** JSON Patch array:

```json
[
  {
    "op": "add",
    "path": "/feedbackResponses/-",
    "value": {
      "disposition": true,
      "comment": "optional feedback text"
    }
  }
]
```

#### GET `/api/findings/occurrences/{id}/artifacts/{artifactId}` (Get Artifact)

| Name         | In   | Type   | Required | Default | Description   |
| ------------ | ---- | ------ | -------- | ------- | ------------- |
| `id`         | path | string | yes      | -       | Occurrence ID |
| `artifactId` | path | string | yes      | -       | Artifact ID   |

**Response:** `text/plain` - Base64-encoded artifact content.

---

### 1.5 Pagination

The Findings API uses **cursor-based pagination** (NOT offset-based).

**Query parameters:**

- `_cursor` (string) - Positions pointer before/after specified record
- `_first` (integer, 1-500) - Forward pagination limit (returns first N items)
- `_last` (integer, 1-500) - Backward pagination limit (returns last N items)
- `_first` and `_last` are **mutually exclusive**
- Default page size is **100** when neither is specified

**Response wrapper structure:**

```json
{
  "_type": "occurrences",
  "_items": [ ... ],
  "_links": [
    { "href": "...", "rel": "self", "method": "GET" },
    { "href": "...", "rel": "first", "method": "GET" },
    { "href": "...", "rel": "next", "method": "GET" },
    { "href": "...", "rel": "last", "method": "GET" }
  ],
  "_collection": {
    "itemCount": 42,
    "pageCount": 1,
    "currentPage": 1
  }
}
```

**Navigation:** The `next` link in `_links` contains the `_cursor` parameter for the next page.
Extract `_cursor` from the `next` link URL to paginate forward.

---

### 1.6 RSQL Filter Fields

#### For Issues (`/api/findings/issues`)

**Occurrence property fields:**

- `occurrence:id`
- `occurrence:issue-id`
- `occurrence:language`
- `occurrence:severity`
- `occurrence:cwe`
- `occurrence:filename`
- `occurrence:line-number`
- `occurrence:location`
- `occurrence:local-effect`
- `occurrence:base-risk-score`
- `occurrence:solution`
- `occurrence:workaround`
- `occurrence:title`
- `occurrence:description`
- `occurrence:is-rapid`
- `occurrence:checker`
- `occurrence:coverity-events`
- `occurrence:technical-description`
- `occurrence:overall-score`
- `occurrence:version`
- `occurrence:component-id`
- `occurrence:component-version-id`
- `occurrence:component-origin-id`
- `occurrence:vulnerability-source`
- `occurrence:vulnerability-id`
- `occurrence:linked-vulnerability-id`
- `occurrence:component-name`
- `occurrence:component-version-name`
- `occurrence:component-origin-external-namespace`
- `occurrence:component-origin-external-id`
- `occurrence:published-date`
- `occurrence:vendor-fix-date`
- `occurrence:last-modified-date`
- `occurrence:disclosure-date`
- `occurrence:minor-version-upgrade-guidance-version-name`
- `occurrence:minor-version-upgrade-guidance-external-id`
- `occurrence:minor-version-upgrade-guidance-critical-count`
- `occurrence:minor-version-upgrade-guidance-high-count`
- `occurrence:minor-version-upgrade-guidance-medium-count`
- `occurrence:minor-version-upgrade-guidance-low-count`
- `occurrence:minor-version-upgrade-guidance-unscored-count`
- `occurrence:major-version-upgrade-guidance-version-name`
- `occurrence:major-version-upgrade-guidance-external-id`
- `occurrence:major-version-upgrade-guidance-critical-count`
- `occurrence:major-version-upgrade-guidance-high-count`
- `occurrence:major-version-upgrade-guidance-medium-count`
- `occurrence:major-version-upgrade-guidance-low-count`
- `occurrence:major-version-upgrade-guidance-unscored-count`

**Context fields:**

- `context:tool-type` (values: `dast`, `sast`, `sca`)
- `context:tool-id`

**Type/taxonomy fields:**

- `type:id`
- `type:name`
- `type:localized-name`
- `type:in-taxon`
- `type:children-of-taxon`

**Triage fields:**

- `triage:dismissal-reason`
- `triage:ignored`
- `triage:(property-key)` (generic for any triage property key)

**Derived fields:**

- `derived:fix-by-status` (values: `overdue`, `due-soon`, `on-track`, `not-set`)

**Special fields (issues only):**

- `special:delta` (values: `new`, `common`, `resolved`, `new-in-test`, `new-post-test`)
- `special:absent-in-branch`
- `special:present-in-branch`

**Component/license fields:**

- `component-version:id`
- `component-version:name`
- `component-version:match-type`
- `component-version:match-score`
- `component:name`
- `component-origin:id`
- `license:id`
- `license:family-name`
- `license:name`

#### For Occurrences (`/api/findings/occurrences`)

Same fields as Issues **except** the `special:` and `derived:` prefixed fields, which are
issue-list-only features.

---

### 1.7 Schema / Model Definitions

#### Issue

Returned from the issues endpoints. The API returns a flat object with conditionally-included
sections controlled by `_include*` query parameters.

| Field                  | Type                 | Required | Included By                    | Description                                   |
| ---------------------- | -------------------- | -------- | ------------------------------ | --------------------------------------------- |
| `id`                   | string               | yes      | always                         | Unique issue identifier                       |
| `tenantId`             | string               | yes      | always                         | Tenant identifier                             |
| `weaknessId`           | string               | no       | always                         | Associated weakness ID                        |
| `excluded`             | boolean              | no       | always                         | Whether file/folder is excluded               |
| `updatedAt`            | string (datetime)    | no       | always                         | Last status change timestamp                  |
| `firstDetectedOn`      | string (datetime)    | no       | `_includeFirstDetectedOn`      | Initial detection date                        |
| `type`                 | IssueType            | no       | `_includeType`                 | Issue type with localized details             |
| `context`              | IssueContext         | no       | `_includeContext`              | Tool context (tool type, version, etc.)       |
| `occurrenceProperties` | OccurrenceProperty[] | no       | `_includeOccurrenceProperties` | Sample occurrence key-value properties        |
| `triageProperties`     | TriageProperty[]     | no       | `_includeTriageProperties`     | Latest triage state                           |
| `componentLocations`   | ComponentLocation[]  | no       | always (if present)            | Third-party component file paths/line numbers |
| `_links`               | LinkEntry[]          | yes      | always                         | HATEOAS navigation/relation links             |

#### IssueType (the `type` object on Issue)

| Field        | Type              | Required | Description                |
| ------------ | ----------------- | -------- | -------------------------- |
| `id`         | string            | yes      | Type identifier            |
| `altName`    | string            | no       | Alternative name           |
| `_localized` | LocalizedTypeInfo | no       | Localized name and details |

#### LocalizedTypeInfo

| Field          | Type              | Required | Description                                                                          |
| -------------- | ----------------- | -------- | ------------------------------------------------------------------------------------ |
| `name`         | string            | no       | Localized type name                                                                  |
| `otherDetails` | LocalizedDetail[] | no       | Additional localized key-value details (description, remediation, subcategory, etc.) |

#### LocalizedDetail

| Field   | Type   | Required | Description     |
| ------- | ------ | -------- | --------------- |
| `key`   | string | yes      | Detail key name |
| `value` | string | yes      | Detail value    |

#### IssueContext (the `context` object on Issue)

| Field         | Type              | Required | Description                         |
| ------------- | ----------------- | -------- | ----------------------------------- |
| `toolType`    | ToolType          | no       | Detection tool type (dast/sast/sca) |
| `toolId`      | string            | no       | Tool identifier                     |
| `scanMode`    | string            | no       | Scan mode type                      |
| `toolVersion` | string            | no       | Tool version number                 |
| `date`        | string (datetime) | no       | Last detection timestamp            |

#### OccurrenceProperty (items in `occurrenceProperties` and `properties` arrays)

| Field   | Type                                      | Required | Description                                                             |
| ------- | ----------------------------------------- | -------- | ----------------------------------------------------------------------- |
| `key`   | string                                    | yes      | Property key (e.g., "severity", "cwe", "filename", "line-number", etc.) |
| `value` | string \| boolean \| number \| Evidence[] | yes      | Property value (type depends on key)                                    |

Common property keys include: `severity`, `cwe`, `filename`, `line-number`, `language`, `location`,
`local-effect`, `base-risk-score`, `checker`, `vulnerability-id`, `component-name`,
`component-version-name`, `published-date`, `overall-score`, etc.

#### TriageProperty (items in `triageProperties` array)

| Field       | Type                      | Required | Description                |
| ----------- | ------------------------- | -------- | -------------------------- |
| `key`       | string                    | yes      | Triage property key        |
| `value`     | string \| boolean \| null | yes      | Triage property value      |
| `author`    | TriageAuthor              | no       | User who made the change   |
| `timestamp` | string (datetime)         | no       | Change timestamp           |
| `_links`    | LinkEntry[]               | no       | Links for the triage entry |

Triage property keys and their values:

- `status`: `"dismissed"` or `"not-dismissed"`
- `dismissal-reason`: `"unset"`, `"false-positive"`, `"other"`
- `is-dismissed`: boolean
- `bts-export-status`: string
- `comment`: string

#### TriageAuthor

| Field  | Type   | Required | Description       |
| ------ | ------ | -------- | ----------------- |
| `id`   | string | no       | User identifier   |
| `name` | string | no       | User display name |

#### ComponentLocation (items in `componentLocations` array)

| Field           | Type           | Required | Description                            |
| --------------- | -------------- | -------- | -------------------------------------- |
| `filePath`      | string         | no       | File path where the component was used |
| `lineLocations` | LineLocation[] | no       | Line number and column information     |

#### LineLocation

| Field             | Type             | Required | Description                |
| ----------------- | ---------------- | -------- | -------------------------- |
| `lineNumber`      | integer          | no       | Line number                |
| `columnLocations` | ColumnLocation[] | no       | Column start/end positions |

#### ColumnLocation

| Field         | Type    | Required | Description     |
| ------------- | ------- | -------- | --------------- |
| `columnStart` | integer | no       | Starting column |
| `columnEnd`   | integer | no       | Ending column   |

---

#### Occurrence

Returned from the occurrences endpoints.

| Field        | Type                 | Required | Included By          | Description                         |
| ------------ | -------------------- | -------- | -------------------- | ----------------------------------- |
| `id`         | string               | yes      | always               | Unique occurrence identifier        |
| `tenantId`   | string               | yes      | always               | Tenant identifier                   |
| `properties` | OccurrenceProperty[] | no       | `_includeProperties` | Key-value occurrence attributes     |
| `type`       | OccurrenceType       | no       | `_includeType`       | Occurrence type with localized info |
| `_links`     | LinkEntry[]          | yes      | always               | HATEOAS navigation links            |
| `_type`      | string               | no       | always               | Resource type (= `"occurrences"`)   |

#### OccurrenceType (the `type` object on Occurrence)

| Field        | Type              | Required | Description                |
| ------------ | ----------------- | -------- | -------------------------- |
| `id`         | string            | yes      | Type identifier            |
| `altName`    | string            | no       | Alternative name           |
| `_localized` | LocalizedTypeInfo | no       | Localized name and details |

> **Note:** `OccurrenceType` has the same structure as `IssueType`. They can share the same
> TypeScript interface.

---

#### CodeSnippet (Snippet Response)

Returned from the snippet endpoints.

| Field                    | Type           | Required | Description                   |
| ------------------------ | -------------- | -------- | ----------------------------- |
| `main-event-file-path`   | string         | no       | File path of the main event   |
| `main-event-line-number` | integer        | no       | Line number of the main event |
| `language`               | string         | no       | Programming language          |
| `events`                 | SnippetEvent[] | no       | Ordered sequence of events    |
| `example-events-groups`  | EventGroup[]   | no       | Events grouped by set number  |

#### SnippetEvent

| Field               | Type           | Required | Description                          |
| ------------------- | -------------- | -------- | ------------------------------------ |
| `event-description` | string         | no       | Human-readable event description     |
| `event-number`      | integer        | no       | Event sequence number                |
| `event-set`         | integer        | no       | Event group set number               |
| `event-tag`         | string         | no       | Event tag identifier                 |
| `event-type`        | EventType      | no       | Event classification                 |
| `line-number`       | integer        | no       | Line number in the source file       |
| `file-path`         | string         | no       | File path for this event             |
| `source-before`     | SourceContext  | no       | Source code context before the event |
| `source-after`      | SourceContext  | no       | Source code context after the event  |
| `evidence-events`   | SnippetEvent[] | no       | Nested array of evidence events      |

#### SourceContext

| Field         | Type    | Required | Description          |
| ------------- | ------- | -------- | -------------------- |
| `start-line`  | integer | no       | Starting line number |
| `end-line`    | integer | no       | Ending line number   |
| `source-code` | string  | no       | Source code content  |

#### EventGroup

| Field    | Type           | Required | Description          |
| -------- | -------------- | -------- | -------------------- |
| `events` | SnippetEvent[] | no       | Events in this group |

---

#### AssistResponse (Remediation Guidance)

Returned from the assist endpoint.

| Field               | Type             | Required | Description                                        |
| ------------------- | ---------------- | -------- | -------------------------------------------------- |
| `id`                | string           | yes      | Unique ID for this response payload                |
| `summary`           | string           | no       | Short generic description of the occurrence type   |
| `codeAnalysis`      | string           | no       | Line-by-line summary of the code snippet           |
| `analysis`          | string           | no       | Short specific description of the occurrence       |
| `suggestedFix`      | string \| null   | no       | Code revision that may fix the occurrence, or null |
| `feedbackResponses` | AssistFeedback[] | no       | Array of feedback submitted against this response  |

#### AssistFeedback

| Field         | Type    | Required | Description                               |
| ------------- | ------- | -------- | ----------------------------------------- |
| `disposition` | boolean | yes      | Whether the guidance was helpful          |
| `comment`     | string  | no       | User's qualifying comment on the feedback |

---

#### Evidence (in DAST occurrence property values)

| Field    | Type        | Required | Description                                                |
| -------- | ----------- | -------- | ---------------------------------------------------------- |
| `label`  | string      | no       | Identifies the evidence object's role                      |
| `attack` | Attack      | no       | Attack details                                             |
| `_links` | LinkEntry[] | no       | References to artifacts (screenshots, requests, responses) |

#### Attack

| Field     | Type          | Required | Description               |
| --------- | ------------- | -------- | ------------------------- |
| `scope`   | AttackScope   | no       | Application/Endpoint/Data |
| `segment` | AttackSegment | no       | Attack segment type       |
| `payload` | string        | no       | Attack payload            |
| `target`  | string        | no       | Attack target             |

---

### 1.8 Enums

| Enum Name         | Values                                                                                                                                                | Used In                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `ToolType`        | `dast`, `sast`, `sca`                                                                                                                                 | IssueContext.toolType, filter    |
| `EventType`       | `MAIN`, `PATH`, `EVIDENCE`, `EXAMPLE`, `SUPPORTING`                                                                                                   | SnippetEvent.event-type          |
| `AttackScope`     | `Application`, `Endpoint`, `Data`                                                                                                                     | Attack.scope                     |
| `AttackSegment`   | `Undefined`, `Body`, `ContentType`, `Cookie`, `Header`, `HTMLHiddenField`, `HTMLMetaTag`, `Location`, `QueryString`, `Path`, `StatusCode`, `Fragment` | Attack.segment                   |
| `Delta`           | `new`, `common`, `resolved`, `new-in-test`, `new-post-test`                                                                                           | special:delta filter             |
| `FixByStatus`     | `overdue`, `due-soon`, `on-track`, `not-set`                                                                                                          | derived:fix-by-status filter     |
| `TriageStatus`    | `dismissed`, `not-dismissed`                                                                                                                          | triage status property           |
| `DismissalReason` | `unset`, `false-positive`, `other`                                                                                                                    | triage dismissal-reason property |
| `FeedbackOp`      | `add`                                                                                                                                                 | Assist feedback PATCH op         |
| `FeedbackPath`    | `/feedbackResponses/-`                                                                                                                                | Assist feedback PATCH path       |

---

### 1.9 Link Rel Values

The `_links` array on Issue and Occurrence resources can contain these `rel` values:

- `self` - Link to the resource itself
- `first` - First page (pagination)
- `next` - Next page (pagination)
- `last` - Last page (pagination)
- `triage-history` - Link to triage history
- `detection-history` - Link to detection history
- `occurrence` - Link to related occurrence
- `snippet` - Link to code snippet
- `assist` - Link to remediation assist
- `application` - Link to parent application
- `project` - Link to parent project
- `branch` - Link to parent branch
- `other-branches` - Link to other branches where issue appears
- `test` - Link to the test/scan
- `issue-list` - Link back to issue list
- `secure-code-warrior` - Link to Secure Code Warrior training

---

### 1.10 Error Responses

| Status | Description    |
| ------ | -------------- |
| 400    | Bad request    |
| 401    | Unauthorized   |
| 403    | Forbidden      |
| 404    | Not found      |
| 406    | Not acceptable |

Errors return `application/problem+json` with the standard `ProblemDetail` structure already defined
in the client.

---

## Section 2: Current Implementation Analysis

### 2.1 What We Have Now

#### Types (`src/types/polaris.ts`, lines 73-131)

```typescript
// Current Findings types:
interface Issue {
  id: string;
  issueKey?: string; // NOT in the API
  issueType?: IssueType; // Wrong field name (should be `type`)
  occurrenceProperties?: OccurrenceProperties; // Wrong type (should be array of key-value pairs)
  firstDetectedOn?: string;
  triageState?: TriageState; // Wrong type (should be `triageProperties: TriageProperty[]`)
  _links: LinkEntry[];
}

interface IssueType {
  id: string;
  name: string; // Should be altName + _localized
  localizedName?: string; // Doesn't exist at top level
  description?: string; // Should be in _localized.otherDetails
  remediation?: string; // Should be in _localized.otherDetails
}

interface OccurrenceProperties {
  severity?: string;
  cwe?: string;
  filename?: string;
  lineNumber?: number;
  language?: string;
}

interface TriageState {
  dismissalReason?: string;
  comment?: string;
}

interface Occurrence {
  id: string;
  issueId: string; // NOT a direct field (it's in properties or filter)
  severity?: string; // Should be in properties array
  cwe?: string; // Should be in properties array
  filename?: string; // Should be in properties array
  lineNumber?: number; // Should be in properties array
  language?: string; // Should be in properties array
  _links: LinkEntry[];
}

interface CodeSnippet {
  lines: SnippetLine[]; // Completely wrong structure
}

interface SnippetLine {
  lineNumber: number;
  content: string;
  highlighted?: boolean;
}

interface AssistResponse {
  id: string;
  explanation?: string; // Wrong field (should be `summary`, `codeAnalysis`, `analysis`)
  remediation?: string; // Wrong field (should be `suggestedFix`)
}
```

#### API Layer (`src/api/findings.ts`)

- `getIssues(params)` - Lists issues with `projectId`, `branchId?`, `testId?`, `filter?`,
  `includeType?`, `includeOccurrenceProperties?`, `includeFirstDetectedOn?`, `first?`
- `getIssue(issueId)` - Gets single issue by ID (missing scoping params)
- `getOccurrences(params)` - Lists occurrences with `projectId`, `branchId?`, `testId?`, `issueId?`,
  `filter?`, `first?`
- `getOccurrenceSnippet(occurrenceId)` - Gets snippet (missing scoping params)
- `getOccurrenceAssist(occurrenceId)` - Gets assist (missing scoping params)

#### Service Layer (`src/services/findings.ts`)

- `getIssues(options)` - Builds RSQL filters for severity, toolType, delta; calls API
- `getIssue(issueId)` - Passthrough to API
- `getOccurrences(projectId, issueId?, branchId?)` - Calls API with issue ID filter
- `getCodeSnippet(occurrenceId)` - Passthrough to API
- `getRemediationAssist(occurrenceId)` - Passthrough to API

#### MCP Tools

- `get_issues` - Parameters: project_id, branch_id?, test_id?, severity?, tool_type?, delta?,
  max_results?
- `get_occurrences` - Parameters: project_id, issue_id?, branch_id?
- `get_code_snippet` - Parameters: occurrence_id
- `get_remediation_assist` - Parameters: occurrence_id

### 2.2 What's Correct

1. **Endpoint paths** - All paths (`/api/findings/issues`, `/api/findings/occurrences`, etc.) are
   correct.
2. **Media types** - `ACCEPT_ISSUES` and `ACCEPT_OCCURRENCES` constants are correct.
3. **Cursor pagination** - Uses `getAllCursor` which correctly handles `_first` and `_cursor`
   parameters.
4. **RSQL filter building** - The service layer correctly builds RSQL expressions for severity, tool
   type, and delta filters.
5. **RSQL filter joining** - Uses `;` (AND) to join multiple filter clauses.
6. **Default test ID** - Correctly defaults to `"latest"`.
7. **Include parameters** - `_includeType`, `_includeOccurrenceProperties`,
   `_includeFirstDetectedOn` are correctly sent for issues.

### 2.3 What's Wrong or Missing

#### Type Definitions - SIGNIFICANTLY WRONG

1. **`Issue` type** is wrong in multiple ways:
   - Has `issueKey` which does not exist in the API response
   - Has `issueType` but the field is actually `type` (an object with `id`, `altName`, `_localized`)
   - Has `occurrenceProperties` typed as a flat `OccurrenceProperties` object, but the API returns
     an **array of key-value pairs** (`{ key: string, value: any }[]`)
   - Has `triageState` typed as `TriageState`, but the API returns `triageProperties` as an **array
     of key-value pairs** with author and timestamp
   - Missing `tenantId`, `weaknessId`, `excluded`, `updatedAt`, `context`, `componentLocations`

2. **`IssueType` type** is wrong:
   - Has `name`, `localizedName`, `description`, `remediation` as flat fields
   - The actual structure is `{ id, altName, _localized: { name, otherDetails[] } }` where
     `otherDetails` is an array of `{ key, value }` pairs containing description, remediation,
     subcategory, etc.

3. **`OccurrenceProperties` type** should not exist as a flat interface. The API returns
   `occurrenceProperties` as an array:
   `{ key: string, value: string | boolean | number | Evidence[] }[]`

4. **`TriageState` type** should not exist. The API returns `triageProperties` as an array:
   `{ key, value, author?, timestamp?, _links? }[]`

5. **`Occurrence` type** is mostly fabricated:
   - Has `issueId`, `severity`, `cwe`, `filename`, `lineNumber`, `language` as flat fields
   - The actual Occurrence only has `id`, `tenantId`, `properties[]` (key-value array), `type`,
     `_links`
   - None of those flat fields exist on the Occurrence directly; they are in the `properties` array

6. **`CodeSnippet` type** is completely wrong:
   - Has `lines: SnippetLine[]` with `lineNumber`, `content`, `highlighted`
   - The actual response has `main-event-file-path`, `main-event-line-number`, `language`,
     `events[]` (with event-description, event-type, source-before, source-after, etc.)

7. **`AssistResponse` type** is significantly incomplete:
   - Has only `explanation` and `remediation`
   - The actual response has `summary`, `codeAnalysis`, `analysis`, `suggestedFix`,
     `feedbackResponses[]`

#### API Layer - MISSING FEATURES

1. **`getIssue`** - Does not pass scoping parameters (`applicationId`, `projectId`, `branchId`,
   `testId`) or `_includeAttributes`. While scoping may not be strictly required for get-by-ID, it
   is part of the spec.

2. **`getIssues`** - Missing `_includeContext` and `_includeTriageProperties` include parameters.
   Missing `applicationId` parameter. Missing `_sort` parameter.

3. **`getOccurrences`** - Missing `_includeProperties` and `_includeType` include parameters.
   Missing `applicationId` parameter. Missing `_sort` parameter.

4. **`getOccurrenceSnippet`** - Does not pass any scoping parameters. Should accept `projectId`,
   `branchId`, `testId` at minimum.

5. **`getOccurrenceAssist`** - Does not pass any scoping parameters.

6. **No `getOccurrence` function** - Missing single occurrence by ID endpoint.

7. **No `provideAssistFeedback` function** - The PATCH endpoint for assist feedback is not
   implemented.

8. **No `getArtifact` function** - The artifact endpoint is not implemented.

#### Service Layer - MISSING FEATURES

1. **`getOccurrences`** - Uses positional arguments instead of options object. Missing include
   parameters.
2. **`getIssues`** - Does not pass `_includeContext` or `_includeTriageProperties`.
3. **No `getOccurrence` single-item function**.
4. **No `provideAssistFeedback` function**.

#### MCP Tools - MISSING FEATURES

1. **`get_issues`** - Missing `application_id` parameter. Missing sort parameter.
2. **`get_occurrences`** - Missing `test_id` parameter. Missing sort and max_results parameters.
   Missing include options.
3. **`get_code_snippet`** - No scoping parameters; should at minimum work.
4. **`get_remediation_assist`** - No scoping parameters; should at minimum work.
5. **No `get_issue` tool** - For getting a single issue by ID.
6. **No `get_occurrence` tool** - For getting a single occurrence by ID.
7. **No `provide_assist_feedback` tool** - For submitting feedback on remediation guidance.

---

## Section 3: Implementation Plan

### 3.1 Changes to `src/types/polaris.ts` (Findings Section)

Replace the entire Findings section (lines 73-131) with the following:

```typescript
// --- Findings ---

/**
 * Tool type used for detection.
 */
export type ToolType = "dast" | "sast" | "sca";

/**
 * Event type classifications in code snippets.
 */
export type EventType = "MAIN" | "PATH" | "EVIDENCE" | "EXAMPLE" | "SUPPORTING";

/**
 * Delta filter values for comparing issues between tests.
 */
export type Delta = "new" | "common" | "resolved" | "new-in-test" | "new-post-test";

/**
 * Fix-by status derived filter values.
 */
export type FixByStatus = "overdue" | "due-soon" | "on-track" | "not-set";

/**
 * Attack scope for DAST evidence.
 */
export type AttackScope = "Application" | "Endpoint" | "Data";

/**
 * Attack segment for DAST evidence.
 */
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

/**
 * Issue - aggregated finding across occurrences.
 * Returned from GET /api/findings/issues and GET /api/findings/issues/{id}
 */
export interface Issue {
  /** Unique issue identifier */
  id: string;
  /** Tenant identifier */
  tenantId?: string;
  /** Associated weakness ID */
  weaknessId?: string;
  /** Whether the file/folder is excluded */
  excluded?: boolean;
  /** Last status change timestamp (ISO 8601) */
  updatedAt?: string;
  /** Initial detection date (ISO 8601). Included when _includeFirstDetectedOn=true */
  firstDetectedOn?: string;
  /** Issue type information. Included when _includeType=true */
  type?: FindingsType;
  /** Tool context. Included when _includeContext=true */
  context?: IssueContext;
  /** Sample occurrence properties (key-value). Included when _includeOccurrenceProperties=true */
  occurrenceProperties?: OccurrenceProperty[];
  /** Triage state properties (key-value). Included when _includeTriageProperties=true */
  triageProperties?: TriageProperty[];
  /** Third-party component file locations */
  componentLocations?: ComponentLocation[];
  /** HATEOAS links (self, triage-history, detection-history, occurrence, snippet, assist, etc.) */
  _links: LinkEntry[];
}

/**
 * Shared type structure used by both Issue.type and Occurrence.type.
 * Contains an ID, alt name, and localized details.
 */
export interface FindingsType {
  /** Type identifier */
  id: string;
  /** Alternative name (e.g., CWE identifier) */
  altName?: string;
  /** Localized type information */
  _localized?: LocalizedTypeInfo;
}

/**
 * Localized information for a findings type.
 */
export interface LocalizedTypeInfo {
  /** Localized type name */
  name?: string;
  /** Additional localized details (description, remediation, subcategory, etc.) */
  otherDetails?: LocalizedDetail[];
}

/**
 * A key-value pair in the localized otherDetails array.
 */
export interface LocalizedDetail {
  /** Detail key (e.g., "description", "remediation", "subcategory") */
  key: string;
  /** Detail value */
  value: string;
}

/**
 * Tool context information for an issue.
 */
export interface IssueContext {
  /** Detection tool type */
  toolType?: ToolType;
  /** Tool identifier */
  toolId?: string;
  /** Scan mode */
  scanMode?: string;
  /** Tool version number */
  toolVersion?: string;
  /** Last detection timestamp (ISO 8601) */
  date?: string;
}

/**
 * A key-value property from occurrences or issues.
 * Used in Issue.occurrenceProperties and Occurrence.properties arrays.
 *
 * Common keys: severity, cwe, filename, line-number, language, location,
 * vulnerability-id, component-name, component-version-name, etc.
 */
export interface OccurrenceProperty {
  /** Property key name */
  key: string;
  /** Property value - type varies by key */
  value: string | boolean | number | Evidence[];
}

/**
 * A triage property with author/timestamp metadata.
 * Used in Issue.triageProperties array.
 *
 * Known keys:
 * - "status": "dismissed" | "not-dismissed"
 * - "dismissal-reason": "unset" | "false-positive" | "other"
 * - "is-dismissed": boolean
 * - "bts-export-status": string
 * - "comment": string
 */
export interface TriageProperty {
  /** Triage property key */
  key: string;
  /** Triage property value */
  value: string | boolean | null;
  /** User who made the triage change */
  author?: TriageAuthor;
  /** When the triage change was made (ISO 8601) */
  timestamp?: string;
  /** Links for this triage entry */
  _links?: LinkEntry[];
}

/**
 * Author of a triage change.
 */
export interface TriageAuthor {
  /** User identifier */
  id?: string;
  /** User display name */
  name?: string;
}

/**
 * File location for a third-party component.
 */
export interface ComponentLocation {
  /** File path where the component was found */
  filePath?: string;
  /** Line number locations within the file */
  lineLocations?: LineLocation[];
}

/**
 * Line location within a component location.
 */
export interface LineLocation {
  /** Line number */
  lineNumber?: number;
  /** Column start/end positions */
  columnLocations?: ColumnLocation[];
}

/**
 * Column range within a line location.
 */
export interface ColumnLocation {
  /** Starting column */
  columnStart?: number;
  /** Ending column */
  columnEnd?: number;
}

// --- Occurrence ---

/**
 * Occurrence - individual instance of a finding at a specific location.
 * Returned from GET /api/findings/occurrences
 */
export interface Occurrence {
  /** Unique occurrence identifier */
  id: string;
  /** Tenant identifier */
  tenantId?: string;
  /** Occurrence properties (key-value). Included when _includeProperties=true */
  properties?: OccurrenceProperty[];
  /** Occurrence type information. Included when _includeType=true */
  type?: FindingsType;
  /** Resource type identifier (= "occurrences") */
  _type?: string;
  /** HATEOAS links */
  _links: LinkEntry[];
}

// --- Code Snippet ---

/**
 * Code snippet response from the snippet endpoint.
 * Uses hyphenated JSON keys matching the API response.
 */
export interface CodeSnippet {
  /** File path of the main event */
  "main-event-file-path"?: string;
  /** Line number of the main event */
  "main-event-line-number"?: number;
  /** Programming language */
  language?: string;
  /** Ordered sequence of events in the data flow */
  events?: SnippetEvent[];
  /** Events grouped by set number */
  "example-events-groups"?: EventGroup[];
}

/**
 * A single event in a code snippet data flow.
 */
export interface SnippetEvent {
  /** Human-readable event description */
  "event-description"?: string;
  /** Event sequence number */
  "event-number"?: number;
  /** Event group set number */
  "event-set"?: number;
  /** Event tag identifier */
  "event-tag"?: string;
  /** Event classification */
  "event-type"?: EventType;
  /** Line number in the source file */
  "line-number"?: number;
  /** File path for this event */
  "file-path"?: string;
  /** Source code context before the event */
  "source-before"?: SourceContext;
  /** Source code context after the event */
  "source-after"?: SourceContext;
  /** Nested evidence events */
  "evidence-events"?: SnippetEvent[];
}

/**
 * Source code context surrounding an event.
 */
export interface SourceContext {
  /** Starting line number of the source code */
  "start-line"?: number;
  /** Ending line number of the source code */
  "end-line"?: number;
  /** The actual source code content */
  "source-code"?: string;
}

/**
 * A group of related events in a snippet, organized by set number.
 */
export interface EventGroup {
  /** Events in this group */
  events?: SnippetEvent[];
}

// --- Remediation Assist ---

/**
 * AI-generated remediation guidance from Polaris Assist.
 * Returned from GET /api/findings/occurrences/{id}/assist
 */
export interface AssistResponse {
  /** Unique ID that identifies this response payload */
  id: string;
  /** Short generic description of the occurrence type */
  summary?: string;
  /** Line-by-line summary of the code snippet */
  codeAnalysis?: string;
  /** Short specific description of the occurrence */
  analysis?: string;
  /** Code revision that may fix the occurrence, or null if a fix cannot be determined */
  suggestedFix?: string | null;
  /** Array of feedback submitted against this response */
  feedbackResponses?: AssistFeedback[];
}

/**
 * Feedback on a remediation assist response.
 */
export interface AssistFeedback {
  /** Whether the guidance was helpful */
  disposition: boolean;
  /** User's qualifying comment */
  comment?: string;
}

// --- DAST Evidence (for occurrence property values) ---

/**
 * Evidence object found in DAST occurrence property values.
 */
export interface Evidence {
  /** Identifies the evidence object's role */
  label?: string;
  /** Attack details */
  attack?: Attack;
  /** References to artifacts (screenshots, requests, responses) */
  _links?: LinkEntry[];
}

/**
 * Attack details within a DAST evidence object.
 */
export interface Attack {
  /** Attack scope */
  scope?: AttackScope;
  /** Attack segment type */
  segment?: AttackSegment;
  /** Attack payload */
  payload?: string;
  /** Attack target */
  target?: string;
}

// --- Assist Feedback Request ---

/**
 * JSON Patch operation for submitting assist feedback.
 * Used in PATCH /api/findings/occurrences/{id}/assist/{assistId}
 */
export interface AssistFeedbackPatch {
  /** Operation type - only "add" is supported */
  op: "add";
  /** JSON Pointer path - only "/feedbackResponses/-" is supported */
  path: "/feedbackResponses/-";
  /** Feedback value */
  value: AssistFeedback;
}
```

### 3.2 Changes to `src/api/findings.ts`

Replace the entire file with:

```typescript
import { getClient } from "./client.ts";
import type {
  AssistFeedbackPatch,
  AssistResponse,
  CodeSnippet,
  Issue,
  Occurrence,
} from "../types/polaris.ts";

const ACCEPT_ISSUES = "application/vnd.polaris.findings.issues-1+json";
const ACCEPT_OCCURRENCES = "application/vnd.polaris.findings.occurrences-1+json";

// --- Issues ---

export interface IssueQueryParams {
  applicationId?: string;
  projectId: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  sort?: string;
  includeType?: boolean;
  includeOccurrenceProperties?: boolean;
  includeTriageProperties?: boolean;
  includeFirstDetectedOn?: boolean;
  includeContext?: boolean;
  first?: number;
}

export function getIssues(params: IssueQueryParams): Promise<Issue[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | boolean | undefined> = {
    projectId: params.projectId,
    testId: params.testId ?? "latest",
    _first: params.first ?? 100,
  };

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeType) queryParams._includeType = true;
  if (params.includeOccurrenceProperties) queryParams._includeOccurrenceProperties = true;
  if (params.includeTriageProperties) queryParams._includeTriageProperties = true;
  if (params.includeFirstDetectedOn) queryParams._includeFirstDetectedOn = true;
  if (params.includeContext) queryParams._includeContext = true;

  return client.getAllCursor<Issue>("/api/findings/issues", queryParams, ACCEPT_ISSUES);
}

export interface GetIssueParams {
  issueId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
  includeAttributes?: boolean;
}

export function getIssue(params: GetIssueParams): Promise<Issue> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;
  if (params.includeAttributes) queryParams._includeAttributes = true;

  return client.get<Issue>(
    `/api/findings/issues/${params.issueId}`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_ISSUES,
  );
}

// --- Occurrences ---

export interface OccurrenceQueryParams {
  applicationId?: string;
  projectId: string;
  branchId?: string;
  testId?: string;
  filter?: string;
  sort?: string;
  includeProperties?: boolean;
  includeType?: boolean;
  first?: number;
}

export function getOccurrences(params: OccurrenceQueryParams): Promise<Occurrence[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | boolean | undefined> = {
    projectId: params.projectId,
    testId: params.testId ?? "latest",
    _first: params.first ?? 100,
  };

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeProperties) queryParams._includeProperties = true;
  if (params.includeType) queryParams._includeType = true;

  return client.getAllCursor<Occurrence>(
    "/api/findings/occurrences",
    queryParams,
    ACCEPT_OCCURRENCES,
  );
}

export interface GetOccurrenceParams {
  occurrenceId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getOccurrence(params: GetOccurrenceParams): Promise<Occurrence> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

  return client.get<Occurrence>(
    `/api/findings/occurrences/${params.occurrenceId}`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_OCCURRENCES,
  );
}

// --- Snippet ---

export interface GetSnippetParams {
  occurrenceId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getOccurrenceSnippet(params: GetSnippetParams): Promise<CodeSnippet> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

  return client.get<CodeSnippet>(
    `/api/findings/occurrences/${params.occurrenceId}/snippet`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_OCCURRENCES,
  );
}

// --- Remediation Assist ---

export interface GetAssistParams {
  occurrenceId: string;
  applicationId?: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getOccurrenceAssist(params: GetAssistParams): Promise<AssistResponse> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};

  if (params.applicationId) queryParams.applicationId = params.applicationId;
  if (params.projectId) queryParams.projectId = params.projectId;
  if (params.branchId) queryParams.branchId = params.branchId;
  if (params.testId) queryParams.testId = params.testId;

  return client.get<AssistResponse>(
    `/api/findings/occurrences/${params.occurrenceId}/assist`,
    Object.keys(queryParams).length > 0 ? queryParams : undefined,
    ACCEPT_OCCURRENCES,
  );
}

// --- Assist Feedback ---

export interface ProvideAssistFeedbackParams {
  occurrenceId: string;
  assistId: string;
  disposition: boolean;
  comment?: string;
}

export function provideAssistFeedback(
  params: ProvideAssistFeedbackParams,
): Promise<AssistResponse> {
  const client = getClient();
  const body: AssistFeedbackPatch[] = [
    {
      op: "add",
      path: "/feedbackResponses/-",
      value: {
        disposition: params.disposition,
        ...(params.comment !== undefined ? { comment: params.comment } : {}),
      },
    },
  ];

  return client.fetch<AssistResponse>(
    `/api/findings/occurrences/${params.occurrenceId}/assist/${params.assistId}`,
    {
      method: "PATCH",
      body,
      accept: ACCEPT_OCCURRENCES,
      contentType: "application/json-patch+json",
    },
  );
}

// --- Artifacts ---

export function getArtifact(occurrenceId: string, artifactId: string): Promise<string> {
  const client = getClient();
  return client.fetch<string>(
    `/api/findings/occurrences/${occurrenceId}/artifacts/${artifactId}`,
    { accept: "text/plain" },
  );
}
```

### 3.3 Changes to `src/services/findings.ts`

Replace the entire file with:

```typescript
import * as findingsApi from "../api/findings.ts";
import type { AssistResponse, CodeSnippet, Issue, Occurrence } from "../types/polaris.ts";

// --- Issues ---

export interface GetIssuesOptions {
  projectId: string;
  applicationId?: string;
  branchId?: string;
  testId?: string;
  severity?: string[];
  toolType?: string[];
  delta?: string;
  sort?: string;
  first?: number;
}

export function getIssues(options: GetIssuesOptions): Promise<Issue[]> {
  const filters: string[] = [];

  if (options.severity?.length) {
    const values = options.severity.map((s) => `'${s}'`).join(",");
    filters.push(`occurrence:severity=in=(${values})`);
  }
  if (options.toolType?.length) {
    const values = options.toolType.map((t) => `'${t}'`).join(",");
    filters.push(`context:tool-type=in=(${values})`);
  }
  if (options.delta) {
    filters.push(`special:delta==${options.delta}`);
  }

  return findingsApi.getIssues({
    projectId: options.projectId,
    applicationId: options.applicationId,
    branchId: options.branchId,
    testId: options.testId,
    filter: filters.length > 0 ? filters.join(";") : undefined,
    sort: options.sort,
    includeType: true,
    includeOccurrenceProperties: true,
    includeTriageProperties: true,
    includeFirstDetectedOn: true,
    includeContext: true,
    first: options.first,
  });
}

export interface GetIssueOptions {
  issueId: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getIssue(options: GetIssueOptions): Promise<Issue> {
  return findingsApi.getIssue({
    issueId: options.issueId,
    projectId: options.projectId,
    branchId: options.branchId,
    testId: options.testId,
  });
}

// --- Occurrences ---

export interface GetOccurrencesOptions {
  projectId: string;
  applicationId?: string;
  branchId?: string;
  testId?: string;
  issueId?: string;
  filter?: string;
  sort?: string;
  first?: number;
}

export function getOccurrences(options: GetOccurrencesOptions): Promise<Occurrence[]> {
  const filters: string[] = [];

  if (options.issueId) {
    filters.push(`occurrence:issue-id==${options.issueId}`);
  }
  if (options.filter) {
    filters.push(options.filter);
  }

  return findingsApi.getOccurrences({
    projectId: options.projectId,
    applicationId: options.applicationId,
    branchId: options.branchId,
    testId: options.testId,
    filter: filters.length > 0 ? filters.join(";") : undefined,
    sort: options.sort,
    includeProperties: true,
    includeType: true,
    first: options.first,
  });
}

export interface GetOccurrenceOptions {
  occurrenceId: string;
  projectId?: string;
  branchId?: string;
  testId?: string;
}

export function getOccurrence(options: GetOccurrenceOptions): Promise<Occurrence> {
  return findingsApi.getOccurrence({
    occurrenceId: options.occurrenceId,
    projectId: options.projectId,
    branchId: options.branchId,
    testId: options.testId,
  });
}

// --- Snippet ---

export function getCodeSnippet(occurrenceId: string): Promise<CodeSnippet> {
  return findingsApi.getOccurrenceSnippet({ occurrenceId });
}

// --- Remediation Assist ---

export function getRemediationAssist(occurrenceId: string): Promise<AssistResponse> {
  return findingsApi.getOccurrenceAssist({ occurrenceId });
}

export interface ProvideAssistFeedbackOptions {
  occurrenceId: string;
  assistId: string;
  disposition: boolean;
  comment?: string;
}

export function provideAssistFeedback(
  options: ProvideAssistFeedbackOptions,
): Promise<AssistResponse> {
  return findingsApi.provideAssistFeedback(options);
}
```

### 3.4 Changes to MCP Tools

#### `src/mcp/tools/get-issues.ts` - UPDATE

```typescript
import { z } from "zod";
import { getIssues } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().describe("Project ID to query issues for"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  severity: z
    .string()
    .optional()
    .describe("Comma-separated severity filter: critical,high,medium,low"),
  tool_type: z
    .string()
    .optional()
    .describe("Comma-separated tool type filter: sast,sca,dast"),
  delta: z
    .string()
    .optional()
    .describe("Delta filter: new, common, resolved, new-in-test, new-post-test"),
  sort: z
    .string()
    .optional()
    .describe("Sort expression. Format: field|direction. Example: occurrence:severity|desc"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of issues to return (default: 100, max: 500)"),
};

export const getIssuesTool: ToolDefinition<typeof schema> = {
  name: "get_issues",
  description:
    "Get security issues for a project from the latest scan. Returns vulnerability details including type, severity, CWE, file path, triage state, and tool context. Use severity and tool_type filters to focus on critical findings. Use delta filter to see new/resolved issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async (
    { project_id, branch_id, test_id, severity, tool_type, delta, sort, max_results },
  ) => {
    const issues = await getIssues({
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      severity: severity?.split(",").map((s) => s.trim()),
      toolType: tool_type?.split(",").map((t) => t.trim()),
      delta,
      sort,
      first: max_results,
    });
    return jsonResponse(issues);
  },
};
```

**Changes:** Add `sort` parameter. Update description to mention triage state and tool context
(since we now include them). Pass `sort` through to service.

---

#### `src/mcp/tools/get-occurrences.ts` - UPDATE

```typescript
import { z } from "zod";
import { getOccurrences } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  project_id: z.string().describe("Project ID"),
  issue_id: z.string().optional().describe("Issue ID to get occurrences for"),
  branch_id: z.string().optional().describe("Branch ID (defaults to default branch)"),
  test_id: z.string().optional().describe("Test ID or 'latest' (default: 'latest')"),
  filter: z
    .string()
    .optional()
    .describe(
      "RSQL filter expression. Example fields: occurrence:severity, occurrence:cwe, occurrence:filename, context:tool-type, type:name",
    ),
  sort: z
    .string()
    .optional()
    .describe("Sort expression. Format: field|direction"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of occurrences to return (default: 100, max: 500)"),
};

export const getOccurrencesTool: ToolDefinition<typeof schema> = {
  name: "get_occurrences",
  description:
    "Get individual occurrences (specific instances) of security issues. Each occurrence represents a finding at a specific location. Properties include file path, line number, severity, CWE, and more. Filter by issue_id to see all locations of a specific issue.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ project_id, issue_id, branch_id, test_id, filter, sort, max_results }) => {
    const occurrences = await getOccurrences({
      projectId: project_id,
      issueId: issue_id,
      branchId: branch_id,
      testId: test_id,
      filter,
      sort,
      first: max_results,
    });
    return jsonResponse(occurrences);
  },
};
```

**Changes:** Add `test_id`, `filter`, `sort`, `max_results` parameters. Update description. Pass all
new parameters through to service.

---

#### `src/mcp/tools/get-code-snippet.ts` - NO CHANGES NEEDED

The current implementation is functionally correct. The snippet endpoint works with just an
occurrence ID. The scoping parameters are optional and typically not needed when fetching by ID.

---

#### `src/mcp/tools/get-remediation-assist.ts` - NO CHANGES NEEDED

Same rationale as snippet. The assist endpoint works with just an occurrence ID.

---

### 3.5 New Tools to Add

#### `src/mcp/tools/get-issue.ts` - NEW

Get a single issue by ID with full details.

```typescript
import { z } from "zod";
import { getIssue } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  issue_id: z.string().describe("Issue ID to retrieve"),
  project_id: z.string().optional().describe("Project ID for scoping"),
  branch_id: z.string().optional().describe("Branch ID for scoping"),
  test_id: z.string().optional().describe("Test ID or 'latest' for scoping"),
};

export const getIssueTool: ToolDefinition<typeof schema> = {
  name: "get_issue",
  description:
    "Get a single security issue by ID. Returns the issue with its type, context, occurrence properties, triage state, and component locations.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ issue_id, project_id, branch_id, test_id }) => {
    const issue = await getIssue({
      issueId: issue_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
    });
    return jsonResponse(issue);
  },
};
```

#### `src/mcp/tools/provide-assist-feedback.ts` - NEW

Submit feedback on AI remediation guidance.

```typescript
import { z } from "zod";
import { provideAssistFeedback } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  occurrence_id: z.string().describe("Occurrence ID the assist was generated for"),
  assist_id: z.string().describe("Assist response ID (from get_remediation_assist result)"),
  disposition: z
    .boolean()
    .describe("Whether the remediation guidance was helpful (true = helpful, false = not helpful)"),
  comment: z.string().optional().describe("Optional qualifying comment on the feedback"),
};

export const provideAssistFeedbackTool: ToolDefinition<typeof schema> = {
  name: "provide_assist_feedback",
  description:
    "Provide feedback on AI-generated remediation guidance from Polaris Assist. Use this after reviewing remediation suggestions to indicate whether they were helpful.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ occurrence_id, assist_id, disposition, comment }) => {
    const result = await provideAssistFeedback({
      occurrenceId: occurrence_id,
      assistId: assist_id,
      disposition,
      comment,
    });
    return jsonResponse(result);
  },
};
```

### 3.6 Changes to `src/mcp/tools/index.ts`

Update to register the new tools:

```typescript
import type { AnyToolDefinition } from "../types.ts";
import { getPortfoliosTool } from "./get-portfolios.ts";
import { getApplicationsTool } from "./get-applications.ts";
import { getProjectsTool } from "./get-projects.ts";
import { getBranchesTool } from "./get-branches.ts";
import { getIssuesTool } from "./get-issues.ts";
import { getIssueTool } from "./get-issue.ts";
import { getOccurrencesTool } from "./get-occurrences.ts";
import { getCodeSnippetTool } from "./get-code-snippet.ts";
import { getRemediationAssistTool } from "./get-remediation-assist.ts";
import { provideAssistFeedbackTool } from "./provide-assist-feedback.ts";
import { getTestsTool } from "./get-tests.ts";
import { getTestMetricsTool } from "./get-test-metrics.ts";

export const tools: AnyToolDefinition[] = [
  getPortfoliosTool,
  getApplicationsTool,
  getProjectsTool,
  getBranchesTool,
  getIssuesTool,
  getIssueTool,
  getOccurrencesTool,
  getCodeSnippetTool,
  getRemediationAssistTool,
  provideAssistFeedbackTool,
  getTestsTool,
  getTestMetricsTool,
];
```

### 3.7 Changes to `src/services/index.ts`

No changes required. The file already re-exports everything from `./findings.ts`, so the new
functions (`getIssue`, `getOccurrence`, `provideAssistFeedback`) and updated signatures will be
automatically exported.

### 3.8 Impact on Callers

The following signature changes will break existing callers:

1. **`findingsApi.getIssue(issueId)` -> `findingsApi.getIssue({ issueId })`** - The service layer is
   the only caller and is updated in this plan.

2. **`findingsService.getIssue(issueId)` -> `findingsService.getIssue({ issueId })`** - Callers need
   to pass an options object. The only direct caller is the MCP tool `get_issue` (new).

3. **`findingsService.getOccurrences(projectId, issueId?, branchId?)` ->
   `findingsService.getOccurrences({ projectId, issueId?, branchId?, ... })`** - The MCP tool
   `get_occurrences` is the only caller and is updated in this plan.

4. **`findingsApi.getOccurrenceSnippet(occurrenceId)` ->
   `findingsApi.getOccurrenceSnippet({ occurrenceId })`** - The service layer is the only caller and
   is updated.

5. **`findingsApi.getOccurrenceAssist(occurrenceId)` ->
   `findingsApi.getOccurrenceAssist({ occurrenceId })`** - The service layer is the only caller and
   is updated.

No external callers exist outside the src directory, so all changes are self-contained.

### 3.9 Implementation Order

1. **Update `src/types/polaris.ts`** - Replace the Findings section (lines 73-131) with the new type
   definitions. This is the foundation that everything else depends on.

2. **Update `src/api/findings.ts`** - Replace the entire file. This adds the new parameters, new
   functions (`getOccurrence`, `provideAssistFeedback`, `getArtifact`), and changes function
   signatures to use params objects.

3. **Update `src/services/findings.ts`** - Replace the entire file. This adds `getOccurrence`,
   `provideAssistFeedback`, updates `getIssue` to use options object, updates `getOccurrences` to
   use options object, and always includes all `_include*` parameters.

4. **Update `src/mcp/tools/get-issues.ts`** - Add `sort` parameter.

5. **Update `src/mcp/tools/get-occurrences.ts`** - Add `test_id`, `filter`, `sort`, `max_results`
   parameters.

6. **Create `src/mcp/tools/get-issue.ts`** - New tool for single issue by ID.

7. **Create `src/mcp/tools/provide-assist-feedback.ts`** - New tool for assist feedback.

8. **Update `src/mcp/tools/index.ts`** - Register the two new tools.

9. **Verify TypeScript compilation** - Run `tsc --noEmit` to catch type errors.

10. **Test** - Verify all tools work correctly against the live API.

### 3.10 Endpoints NOT Implemented (and Why)

1. **GET `/api/findings/occurrences/{id}/artifacts/{artifactId}`** - Implemented at the API layer
   (`getArtifact`) but no MCP tool or service wrapper is added. This returns base64-encoded artifact
   content (screenshots, request/response captures for DAST). A tool could be added later if needed,
   but artifact rendering is a poor fit for an MCP text interface.

2. **All deprecated `/api/specialization-layer-service/` endpoints** - Not implemented. These are
   deprecated legacy endpoints that will be sunsetted. The current `/api/findings/` endpoints
   provide equivalent functionality.

3. **GET `/api/findings/occurrences/{id}` (single occurrence)** - Implemented at the API layer
   (`getOccurrence`) and service layer but no dedicated MCP tool is added. The `get_occurrences`
   tool with a filter can achieve the same result. A dedicated tool could be added if the use case
   arises frequently.
