# Reports API (Insights) - Comprehensive Implementation Plan

## Section 1: API Spec Summary

### 1.1 Overview

- **OpenAPI Version:** 3.0.1
- **Title:** Reports (Insights)
- **Authentication:** ApiKeyAuth (header: `Api-token`)
- **Base paths:**
  - `https://polaris.blackduck.com/api/insights` (current)
  - `https://polaris.blackduck.com/api/report-service` (deprecated, sunset Tue 24 Mar 2026 05:00:00
    GMT)
- **Pagination:** Offset-based (`_offset` / `_limit`, default limit 25, max 100)
- **Filtering:** RSQL syntax via `_filter` query parameter
- **Sorting:** `{field}|{asc|desc}` via `_sort` query parameter

### 1.2 Data Latency & Retention

- Report data may be up to **60 minutes** behind real-time for issue data, triage actions, component
  modifications, and setting changes.
- Reports are **automatically deleted after 30 days**.
- Up to **1000 reports** can be saved at a time.
- Only report creators can download; sharing requires exporting the PDF or JSON file.

### 1.3 Supported Report Types

| Report Type Identifier       | Description                                              | Format |
| ---------------------------- | -------------------------------------------------------- | ------ |
| `issues-report`              | Issue Summary - multi-faceted issue breakdown            | PDF    |
| `standard-compliance`        | Issues mapped to regulatory standards                    | PDF    |
| `standard-compliance-detail` | Detailed standard compliance breakdown                   | PDF    |
| `security-audit`             | Threat area assessment and protection analysis           | PDF    |
| `test-summary`               | Testing frequency and assessment coverage                | PDF    |
| `issue-overview`             | High-level application and project counts                | PDF    |
| `developer-detail-static`    | SAST issues with file/line numbers and severity          | PDF    |
| `developer-detail-sca`       | Component-focused vulnerability overview                 | PDF    |
| `dast-detail-report`         | DAST issues organized by type with severity and location | PDF    |
| `executive-summary`          | Portfolio risk posture with trend analysis               | PDF    |
| `spdx`                       | SPDX v2.3 SBOM                                           | JSON   |
| `cyclonedx`                  | CycloneDX v1.4 SBOM                                      | JSON   |
| `cyclonedx-v1.6`             | CycloneDX v1.6 SBOM                                      | JSON   |

---

### 1.4 Endpoints

#### Report Types (Read-Only)

| Method | Path                    | OperationId      | Description                     |
| ------ | ----------------------- | ---------------- | ------------------------------- |
| GET    | `/reports/report-types` | `getReportTypes` | List all supported report types |

**GET `/reports/report-types` Parameters:**

| Name      | In    | Type    | Required | Default | Description         |
| --------- | ----- | ------- | -------- | ------- | ------------------- |
| `_offset` | query | integer | no       | 0       | Pagination offset   |
| `_limit`  | query | integer | no       | 25      | Page size (max 100) |

**Response Schema (`ReportTypeResponse`):**

| Field                  | Type         | Description                  |
| ---------------------- | ------------ | ---------------------------- |
| `_items`               | ReportType[] | Array of report type objects |
| `_items[].reportType`  | string       | Report type identifier       |
| `_items[].description` | string       | Human-readable description   |
| `_links`               | LinkEntry[]  | HATEOAS navigation links     |
| `_collection`          | object       | Pagination metadata          |

---

#### Reports (CRUD + Actions)

| Method | Path                                    | OperationId        | Description                      | Deprecated |
| ------ | --------------------------------------- | ------------------ | -------------------------------- | ---------- |
| POST   | `/reports/{reportType}/_actions/run`    | `runReport`        | Create and run a new report (V3) | No         |
| GET    | `/reports`                              | `getReports`       | List all reports with filtering  | No         |
| GET    | `/reports/{reportId}`                   | `getReportById`    | Get a single report by ID        | No         |
| DELETE | `/reports/{reportId}`                   | `deleteReport`     | Delete a report by ID            | No         |
| GET    | `/reports/{reportId}/_actions/download` | `downloadReport`   | Download report file (current)   | No         |
| POST   | `/reports/{reportType}/generate`        | `generateReport`   | Generate PDF report (V2)         | **Yes**    |
| POST   | `/reports/{reportType}/export`          | `exportReport`     | Export SBOM report as JSON (V2)  | **Yes**    |
| GET    | `/reports/{reportId}/download`          | `downloadReportV1` | Download report file (V1)        | **Yes**    |

---

#### Report Configurations (CRUD + Actions)

| Method | Path                                             | OperationId            | Description                                   |
| ------ | ------------------------------------------------ | ---------------------- | --------------------------------------------- |
| POST   | `/configurations`                                | `createConfiguration`  | Create a new report configuration             |
| GET    | `/configurations`                                | `getConfigurations`    | List all report configurations                |
| GET    | `/configurations/{configurationId}`              | `getConfigurationById` | Get a single configuration by ID              |
| PATCH  | `/configurations/{configurationId}`              | `updateConfiguration`  | Update a report configuration                 |
| DELETE | `/configurations/{configurationId}`              | `deleteConfiguration`  | Delete a report configuration                 |
| POST   | `/configurations/{configurationId}/_actions/run` | `runConfiguration`     | Generate a report using a saved configuration |

---

#### Report Schedulers

| Method | Path                                                         | OperationId        | Description                   |
| ------ | ------------------------------------------------------------ | ------------------ | ----------------------------- |
| POST   | `/configurations/{configurationId}/schedulers`               | `createScheduler`  | Create a new report scheduler |
| GET    | `/configurations/{configurationId}/schedulers/{schedulerId}` | `getSchedulerById` | Get scheduler details         |
| PATCH  | `/configurations/{configurationId}/schedulers/{schedulerId}` | `updateScheduler`  | Update scheduler details      |

---

#### Timezones (Read-Only)

| Method | Path         | OperationId    | Description                                    |
| ------ | ------------ | -------------- | ---------------------------------------------- |
| GET    | `/timezones` | `getTimezones` | List timezone identifiers for scheduler config |

---

#### Dashboard Filters

| Method | Path                                           | OperationId     | Description                   |
| ------ | ---------------------------------------------- | --------------- | ----------------------------- |
| POST   | `/dashboards/{dashboardId}/filters`            | `createFilter`  | Create a new dashboard filter |
| GET    | `/dashboards/{dashboardId}/filters`            | `getFilters`    | List all dashboard filters    |
| GET    | `/dashboards/{dashboardId}/filters/{filterId}` | `getFilterById` | Get a single filter by ID     |
| PATCH  | `/dashboards/{dashboardId}/filters/{filterId}` | `updateFilter`  | Update a dashboard filter     |
| DELETE | `/dashboards/{dashboardId}/filters/{filterId}` | `deleteFilter`  | Delete a dashboard filter     |

---

### 1.5 Pagination

All collection endpoints use **offset-based pagination**.

**Query parameters:**

- `_offset` (integer, default: 0) - Number of items to skip
- `_limit` (integer, default: 25, max: 100) - Max items per page

**Response wrapper structure:**

```json
{
  "_items": [ ... ],
  "_links": [
    { "href": "...", "rel": "first", "method": "GET" },
    { "href": "...", "rel": "next", "method": "GET" },
    { "href": "...", "rel": "prev", "method": "GET" },
    { "href": "...", "rel": "last", "method": "GET" },
    { "href": "...", "rel": "self", "method": "GET" }
  ],
  "_collection": {
    "itemCount": 42,
    "currentPage": 1,
    "pageCount": 1
  }
}
```

### 1.6 RSQL Filter Syntax

The `_filter` parameter uses RSQL syntax on the `GET /reports` endpoint:

- `name=='demo'` - exact match
- `name=like='%partial%'` - partial match (inferred)
- Standard RSQL operators: `==`, `!=`, `=in=()`, `=out=()`

---

## Section 2: Write Operations Detail

### 2.1 Summary of All Write Operations

| Operation                        | Method | Path                                                         | Request Body                     | Response   |
| -------------------------------- | ------ | ------------------------------------------------------------ | -------------------------------- | ---------- |
| Run Report (V3, current)         | POST   | `/reports/{reportType}/_actions/run`                         | `RunReportPayloadV3`             | 200 + body |
| Generate Report (V2, deprecated) | POST   | `/reports/{reportType}/generate`                             | `GenerateReportPayloadV2`        | 200 + body |
| Export SBOM (V2, deprecated)     | POST   | `/reports/{reportType}/export`                               | `GenerateSBOMReportPayloadV2`    | 200 + body |
| Delete Report                    | DELETE | `/reports/{reportId}`                                        | none                             | 204        |
| Create Configuration             | POST   | `/configurations`                                            | `ConfigurationPayloadV4`         | 200 + body |
| Update Configuration             | PATCH  | `/configurations/{configurationId}`                          | `ConfigurationPayloadV4`         | 200 + body |
| Delete Configuration             | DELETE | `/configurations/{configurationId}`                          | none                             | 204        |
| Run Configuration                | POST   | `/configurations/{configurationId}/_actions/run`             | empty body (content-type header) | 200 + body |
| Create Scheduler                 | POST   | `/configurations/{configurationId}/schedulers`               | `SchedulerPayload`               | 200 + body |
| Update Scheduler                 | PATCH  | `/configurations/{configurationId}/schedulers/{schedulerId}` | `SchedulerPayload`               | 200 + body |
| Create Dashboard Filter          | POST   | `/dashboards/{dashboardId}/filters`                          | `DashboardFilterPayload`         | 200 + body |
| Update Dashboard Filter          | PATCH  | `/dashboards/{dashboardId}/filters/{filterId}`               | `UpdateDashboardFilterPayload`   | 200 + body |
| Delete Dashboard Filter          | DELETE | `/dashboards/{dashboardId}/filters/{filterId}`               | none                             | 204        |

---

### 2.2 Run Report (V3) - Primary Write Operation

```
POST /api/insights/reports/{reportType}/_actions/run
Content-Type: application/json
Api-Token: {api-token}
```

**Path Parameters:**

| Name         | Type   | Required | Description                                                    |
| ------------ | ------ | -------- | -------------------------------------------------------------- |
| `reportType` | string | yes      | One of the supported report type identifiers (see Section 1.3) |

**Request Body (`RunReportPayloadV3`):**

```json
{
  "applications": [
    {
      "id": "uuid",
      "name": "My Application",
      "projects": [
        {
          "id": "uuid",
          "name": "My Project",
          "branches": [
            {
              "id": "uuid",
              "name": "main",
              "description": "Default branch",
              "type": "string",
              "isDefault": true
            }
          ]
        }
      ]
    }
  ],
  "severities": ["critical", "high", "medium", "low", "informational"],
  "tools": ["STATIC_POLARIS", "SCA_PACKAGE"],
  "standard": "none",
  "timePeriod": "all-time",
  "filter": "RSQL filter string",
  "scope": "SELECTED_BRANCHES",
  "customizations": [],
  "issuesDiscovered": ["in-test", "post-test"]
}
```

**Request Body Field Details:**

| Field                                              | Type        | Required | Description                                                           |
| -------------------------------------------------- | ----------- | -------- | --------------------------------------------------------------------- |
| `applications`                                     | array       | yes      | Applications and their projects/branches to include                   |
| `applications[].id`                                | string/UUID | no       | Application UUID                                                      |
| `applications[].name`                              | string      | no       | Application name                                                      |
| `applications[].projects`                          | array       | yes      | Projects within the application                                       |
| `applications[].projects[].id`                     | string/UUID | yes      | Project UUID (required)                                               |
| `applications[].projects[].name`                   | string      | no       | Project name                                                          |
| `applications[].projects[].branches`               | array       | no       | Branches to include (for SELECTED_BRANCHES scope)                     |
| `applications[].projects[].branches[].id`          | string/UUID | yes      | Branch UUID (required when specifying branches)                       |
| `applications[].projects[].branches[].name`        | string      | no       | Branch name                                                           |
| `applications[].projects[].branches[].description` | string      | no       | Branch description                                                    |
| `applications[].projects[].branches[].type`        | string      | no       | Branch type                                                           |
| `applications[].projects[].branches[].isDefault`   | boolean     | no       | Whether this is the default branch                                    |
| `severities`                                       | string[]    | yes      | Severity filters                                                      |
| `tools`                                            | string[]    | yes      | Tool filters                                                          |
| `standard`                                         | string      | no       | Compliance standard                                                   |
| `timePeriod`                                       | string      | no       | Time period for trend data (default: `all-time`)                      |
| `filter`                                           | string      | no       | Additional RSQL filter expression                                     |
| `scope`                                            | string      | no       | Report scope level                                                    |
| `customizations`                                   | array       | no       | Module customizations (include/exclude modules, tables, charts, etc.) |
| `issuesDiscovered`                                 | string[]    | no       | When issues were discovered                                           |

**Enum Values:**

| Field              | Allowed Values                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `severities`       | `critical`, `high`, `medium`, `low`, `informational`                                                  |
| `tools`            | `DAST_POLARIS`, `SCA_PACKAGE`, `SCA_SIGNATURE`, `STATIC_POLARIS`, `STATIC_RAPID`, `EXTERNAL_ANALYSIS` |
| `standard`         | `none`, `ty-1`, `ty-2`, `ty-4`, `ty-5`, `ty-7`                                                        |
| `timePeriod`       | `all-time`, `last-30-days`, `last-60-days`, `last-90-days`                                            |
| `scope`            | `ALL_APPLICATIONS`, `SELECTED_APPLICATIONS`, `SELECTED_BRANCHES`                                      |
| `issuesDiscovered` | `in-test`, `post-test`                                                                                |

**Scope Behavior:**

- `ALL_APPLICATIONS` - Report covers all applications in the organization (default branches only)
- `SELECTED_APPLICATIONS` - Report covers specific applications listed in the `applications` array
  (default branches only)
- `SELECTED_BRANCHES` - Report covers specific branches listed within each project

**Response Schema (`GetReportResponseV2`):**

| Field                   | Type              | Description                             |
| ----------------------- | ----------------- | --------------------------------------- |
| `id`                    | string/UUID       | Report unique identifier                |
| `name`                  | string            | Report name                             |
| `configurationId`       | string/UUID       | Associated configuration ID (if saved)  |
| `reportType`            | string            | Report type identifier                  |
| `reportTypeDescription` | string            | Human-readable report type description  |
| `startDate`             | string (datetime) | When report generation started          |
| `completedDate`         | string (datetime) | When report generation completed        |
| `createdBy`             | string/UUID       | User who created the report             |
| `configuration`         | string (JSON)     | Serialized configuration used           |
| `customizations`        | array             | Module customization details            |
| `format`                | string            | Output format (`pdf` or `json`)         |
| `status`                | string            | Report generation status                |
| `failureReason`         | string            | Failure reason (if status is FAILED)    |
| `fileSize`              | string            | File size in bytes                      |
| `message`               | string            | Status message                          |
| `_links`                | ReportLink[]      | HATEOAS links (including download link) |

**Report Status Values:** `INITIATED`, `IN_PROGRESS`, `COMPLETED`, `FAILED`

**Status Codes:** 200, 400, 401, 403, 500

---

### 2.3 Generate Report (V2, Deprecated)

```
POST /api/insights/reports/{reportType}/generate
Content-Type: application/json
Api-Token: {api-token}
```

**Request Body (`GenerateReportPayloadV2`):**

```json
{
  "name": "My Report",
  "format": "pdf",
  "applications": [
    {
      "id": "uuid",
      "projects": ["project-uuid-1", "project-uuid-2"]
    }
  ],
  "severities": ["critical", "high"],
  "tools": ["STATIC_POLARIS", "SCA_PACKAGE"],
  "standard": "none",
  "timePeriod": "all-time"
}
```

| Field                     | Type        | Required | Description                    |
| ------------------------- | ----------- | -------- | ------------------------------ |
| `name`                    | string      | no       | Report name                    |
| `format`                  | string      | no       | Output format (default: `pdf`) |
| `applications`            | array       | yes      | Applications to include        |
| `applications[].id`       | string/UUID | yes      | Application UUID               |
| `applications[].projects` | UUID[]      | yes      | Array of project UUIDs         |
| `severities`              | string[]    | yes      | Severity filters               |
| `tools`                   | string[]    | yes      | Tool filters                   |
| `standard`                | string      | no       | Compliance standard            |
| `timePeriod`              | string      | no       | Time period                    |

**Status Codes:** 200, 400, 401, 403, 500

---

### 2.4 Export SBOM Report (V2, Deprecated)

```
POST /api/insights/reports/{reportType}/export
Content-Type: application/json
Api-Token: {api-token}
```

**Path Parameters:** `reportType` must be one of: `spdx`, `cyclonedx`, `cyclonedx-v1.6`

**Request Body (`GenerateSBOMReportPayloadV2`):**

```json
{
  "name": "My SBOM Report",
  "format": "json",
  "applications": [
    {
      "projects": ["project-uuid-1"]
    }
  ]
}
```

| Field                     | Type   | Required | Description                     |
| ------------------------- | ------ | -------- | ------------------------------- |
| `name`                    | string | no       | Report name                     |
| `format`                  | string | no       | Output format (default: `json`) |
| `applications`            | array  | yes      | Applications to include         |
| `applications[].projects` | UUID[] | yes      | Array of project UUIDs          |

**SBOM Notes:**

- Only default branch data is included; non-default branch data is ignored
- Respects component triage settings (excluded components are omitted)
- Output is always JSON format

**Status Codes:** 200, 400, 401, 403, 500

---

### 2.5 Create Report Configuration

```
POST /api/insights/configurations
Content-Type: application/json
Api-Token: {api-token}
```

**Request Body (`ConfigurationPayloadV4`):**

```json
{
  "name": "Weekly Security Report",
  "appendDate": false,
  "reportType": "issues-report",
  "timePeriod": "last-30-days",
  "filter": "RSQL filter string",
  "scope": "ALL_APPLICATIONS",
  "severities": ["critical", "high", "medium"],
  "tools": ["STATIC_POLARIS", "SCA_PACKAGE", "DAST_POLARIS"],
  "standard": "none",
  "customizations": [],
  "issuesDiscovered": ["in-test"]
}
```

| Field              | Type     | Required | Description                                                                    |
| ------------------ | -------- | -------- | ------------------------------------------------------------------------------ |
| `name`             | string   | yes      | Configuration name (max 256 characters)                                        |
| `appendDate`       | boolean  | no       | Append date suffix to report name (default: false)                             |
| `reportType`       | string   | no       | Report type identifier (see Section 1.3)                                       |
| `timePeriod`       | string   | no       | Time period for trend data                                                     |
| `filter`           | string   | no       | RSQL filter expression                                                         |
| `scope`            | string   | yes      | Report scope: `ALL_APPLICATIONS`, `SELECTED_APPLICATIONS`, `SELECTED_BRANCHES` |
| `severities`       | string[] | yes      | Severity levels to include                                                     |
| `tools`            | string[] | yes      | Tools to include                                                               |
| `standard`         | string   | no       | Compliance standard                                                            |
| `customizations`   | array    | no       | Module customizations                                                          |
| `issuesDiscovered` | string[] | no       | When issues were discovered (`in-test`, `post-test`)                           |

**Response Schema (`CreateConfigurationResponseV4`):**

| Field              | Type        | Description                     |
| ------------------ | ----------- | ------------------------------- |
| `id`               | string/UUID | Configuration unique identifier |
| `name`             | string      | Configuration name              |
| `appendDate`       | boolean     | Whether date is appended        |
| `reportType`       | string      | Report type identifier          |
| `timePeriod`       | string      | Time period                     |
| `filter`           | string      | RSQL filter                     |
| `scope`            | string      | Report scope                    |
| `severities`       | string[]    | Severity levels                 |
| `tools`            | string[]    | Tool filters                    |
| `standard`         | string      | Compliance standard             |
| `customizations`   | array       | Module customizations           |
| `issuesDiscovered` | string[]    | Issues discovered filter        |
| `_links`           | LinkEntry[] | HATEOAS links                   |

**Status Codes:** 200, 400, 401, 403, 409 (name conflict), 500

---

### 2.6 Update Report Configuration

```
PATCH /api/insights/configurations/{configurationId}
Content-Type: application/json
Api-Token: {api-token}
```

**Path Parameters:**

| Name              | Type        | Required | Description        |
| ----------------- | ----------- | -------- | ------------------ |
| `configurationId` | string/UUID | yes      | Configuration UUID |

**Request Body:** Same as `ConfigurationPayloadV4` (Section 2.5)

**Response:** `CreateConfigurationResponseV4`

**Status Codes:** 200, 400, 401, 403, 409 (name conflict), 500

---

### 2.7 Run Saved Configuration

```
POST /api/insights/configurations/{configurationId}/_actions/run
Content-Type: application/json
Api-Token: {api-token}
```

**Path Parameters:**

| Name              | Type        | Required | Description        |
| ----------------- | ----------- | -------- | ------------------ |
| `configurationId` | string/UUID | yes      | Configuration UUID |

**Request Body:** Empty object with content-type header.

**Response:** `GetReportResponse`

**Status Codes:** 200, 400, 401, 403, 404, 500

---

### 2.8 Create Report Scheduler

```
POST /api/insights/configurations/{configurationId}/schedulers
Content-Type: application/json
Api-Token: {api-token}
```

**Path Parameters:**

| Name              | Type        | Required | Description        |
| ----------------- | ----------- | -------- | ------------------ |
| `configurationId` | string/UUID | yes      | Configuration UUID |

**Request Body (`SchedulerPayload`):**

The scheduler payload contains schedule-related fields for automating report generation. Reports can
be scheduled on a daily, weekly, or monthly basis.

> **Note:** The complete SchedulerPayload schema is truncated in the public OpenAPI specification.
> The following fields are inferred from documentation and UI behavior:

| Field       | Type   | Required | Description                                      |
| ----------- | ------ | -------- | ------------------------------------------------ |
| `frequency` | string | yes      | Schedule frequency: `daily`, `weekly`, `monthly` |
| `timezone`  | string | yes      | Timezone identifier (from GET `/timezones`)      |
| `day`       | string | no       | Day of week (for weekly) or day of month         |
| `time`      | string | no       | Time of day for scheduled execution              |

**Response Schema (`SchedulerResponse`):**

| Field             | Type        | Description                 |
| ----------------- | ----------- | --------------------------- |
| `id`              | string/UUID | Scheduler unique identifier |
| `configurationId` | string/UUID | Parent configuration ID     |
| `_links`          | LinkEntry[] | HATEOAS links               |

**Status Codes:** 200, 400, 401, 403, 404, 500

---

### 2.9 Update Report Scheduler

```
PATCH /api/insights/configurations/{configurationId}/schedulers/{schedulerId}
Content-Type: application/json
Api-Token: {api-token}
```

**Path Parameters:**

| Name              | Type        | Required | Description        |
| ----------------- | ----------- | -------- | ------------------ |
| `configurationId` | string/UUID | yes      | Configuration UUID |
| `schedulerId`     | string/UUID | yes      | Scheduler UUID     |

**Request Body:** Same as `SchedulerPayload` (Section 2.8)

**Response:** `SchedulerResponse`

**Status Codes:** 200, 400, 401, 403, 500

---

### 2.10 Create Dashboard Filter

```
POST /api/insights/dashboards/{dashboardId}/filters
Content-Type: application/json
Api-Token: {api-token}
```

**Path Parameters:**

| Name          | Type    | Required | Description  |
| ------------- | ------- | -------- | ------------ |
| `dashboardId` | integer | yes      | Dashboard ID |

**Request Body (`DashboardFilterPayload`):**

> **Note:** The complete DashboardFilterPayload schema is truncated in the public OpenAPI
> specification.

**Response Schema (`DashboardFilterResponse`):**

| Field    | Type        | Description              |
| -------- | ----------- | ------------------------ |
| `id`     | string/UUID | Filter unique identifier |
| `name`   | string      | Filter name              |
| `_links` | LinkEntry[] | HATEOAS links            |

**Status Codes:** 200, 400, 401, 404, 409 (name conflict), 500

---

### 2.11 Update Dashboard Filter

```
PATCH /api/insights/dashboards/{dashboardId}/filters/{filterId}
Content-Type: application/json
Api-Token: {api-token}
```

**Path Parameters:**

| Name          | Type        | Required | Description  |
| ------------- | ----------- | -------- | ------------ |
| `dashboardId` | integer     | yes      | Dashboard ID |
| `filterId`    | string/UUID | yes      | Filter UUID  |

**Request Body (`UpdateDashboardFilterPayload`):**

> **Note:** The complete UpdateDashboardFilterPayload schema is truncated in the public OpenAPI
> specification.

**Response:** `DashboardFilterResponse`

**Status Codes:** 200, 400, 401, 403, 404, 409 (name conflict), 500

---

### 2.12 Delete Operations

#### Delete Report

```
DELETE /api/insights/reports/{reportId}
Api-Token: {api-token}

Response: 204 No Content
Status Codes: 204, 400, 401, 403, 404, 500
```

#### Delete Configuration

```
DELETE /api/insights/configurations/{configurationId}
Api-Token: {api-token}

Response: 204 No Content
Status Codes: 204, 400, 401, 403, 404, 500
```

#### Delete Dashboard Filter

```
DELETE /api/insights/dashboards/{dashboardId}/filters/{filterId}
Api-Token: {api-token}

Response: 204 No Content
Status Codes: 204, 401, 403, 404, 500
```

---

## Section 3: Read Operations Detail

### 3.1 List Reports

```
GET /api/insights/reports
Api-Token: {api-token}
```

**Query Parameters:**

| Name      | In    | Type    | Required | Default | Description                        |
| --------- | ----- | ------- | -------- | ------- | ---------------------------------- |
| `_filter` | query | string  | no       | -       | RSQL filter (e.g., `name=='demo'`) |
| `_sort`   | query | string  | no       | -       | Sort: `field_name                  |
| `_offset` | query | integer | no       | 0       | Pagination offset                  |
| `_limit`  | query | integer | no       | 25      | Page size (max 100)                |

**Response Schema (`GetReportsResponseV2`):**

```json
{
  "_items": [
    {
      "id": "uuid",
      "name": "string",
      "configurationId": "uuid",
      "reportType": "string",
      "reportTypeDescription": "string",
      "startDate": "datetime",
      "completedDate": "datetime",
      "createdBy": "uuid",
      "configuration": "JSON string",
      "customizations": [],
      "format": "pdf|json",
      "status": "INITIATED|IN_PROGRESS|COMPLETED|FAILED",
      "failureReason": "string (optional)",
      "fileSize": "string (bytes)",
      "message": "string",
      "_links": []
    }
  ],
  "_links": [],
  "_collection": {
    "itemCount": 0,
    "currentPage": 1,
    "pageCount": 0
  }
}
```

---

### 3.2 Get Single Report

```
GET /api/insights/reports/{reportId}
Api-Token: {api-token}
```

**Response:** `GetReportResponseV2` (same structure as individual item in list response)

**Status Codes:** 200, 400, 401, 403, 404, 500

---

### 3.3 Download Report

```
GET /api/insights/reports/{reportId}/_actions/download
Api-Token: {api-token}
```

**Response:** Binary file stream (PDF or JSON depending on report type)

**Status Codes:** 200, 401, 403, 404, 500

---

### 3.4 List Configurations

```
GET /api/insights/configurations
Api-Token: {api-token}
```

**Query Parameters:**

| Name      | In    | Type    | Required | Default | Description         |
| --------- | ----- | ------- | -------- | ------- | ------------------- |
| `_filter` | query | string  | no       | -       | RSQL filter         |
| `_sort`   | query | string  | no       | -       | Sort expression     |
| `_offset` | query | integer | no       | 0       | Pagination offset   |
| `_limit`  | query | integer | no       | 25      | Page size (max 100) |

**Response:** `GetReportConfigurationsResponseV4` (paginated `_items` of
`CreateConfigurationResponseV4`)

---

### 3.5 Get Timezones

```
GET /api/insights/timezones
Api-Token: {api-token}
```

**Response:** Array of timezone identifier strings (e.g., `America/New_York`, `Europe/London`)

**Status Codes:** 200, 401, 500

---

### 3.6 List Dashboard Filters

```
GET /api/insights/dashboards/{dashboardId}/filters
Api-Token: {api-token}
```

**Query Parameters:**

| Name      | In    | Type    | Required | Default | Description         |
| --------- | ----- | ------- | -------- | ------- | ------------------- |
| `_filter` | query | string  | no       | -       | RSQL filter         |
| `_offset` | query | integer | no       | 0       | Pagination offset   |
| `_limit`  | query | integer | no       | 25      | Page size (max 100) |

**Response:** `GetDashboardsFiltersResponse` (paginated `_items` of `DashboardFilterResponse`)

---

## Section 4: Enums

| Enum Name        | Values                                                                                                                                                                                                                                                        | Used In                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| ReportType       | `issues-report`, `standard-compliance`, `standard-compliance-detail`, `security-audit`, `test-summary`, `issue-overview`, `developer-detail-static`, `developer-detail-sca`, `dast-detail-report`, `executive-summary`, `spdx`, `cyclonedx`, `cyclonedx-v1.6` | Path parameter, `reportType` field |
| Severity         | `critical`, `high`, `medium`, `low`, `informational`                                                                                                                                                                                                          | `severities` array                 |
| Tool             | `DAST_POLARIS`, `SCA_PACKAGE`, `SCA_SIGNATURE`, `STATIC_POLARIS`, `STATIC_RAPID`, `EXTERNAL_ANALYSIS`                                                                                                                                                         | `tools` array                      |
| Standard         | `none`, `ty-1`, `ty-2`, `ty-4`, `ty-5`, `ty-7`                                                                                                                                                                                                                | `standard` field                   |
| TimePeriod       | `all-time`, `last-30-days`, `last-60-days`, `last-90-days`                                                                                                                                                                                                    | `timePeriod` field                 |
| Scope            | `ALL_APPLICATIONS`, `SELECTED_APPLICATIONS`, `SELECTED_BRANCHES`                                                                                                                                                                                              | `scope` field                      |
| IssuesDiscovered | `in-test`, `post-test`                                                                                                                                                                                                                                        | `issuesDiscovered` array           |
| ReportStatus     | `INITIATED`, `IN_PROGRESS`, `COMPLETED`, `FAILED`                                                                                                                                                                                                             | `status` field in report response  |
| ReportFormat     | `pdf`, `json`                                                                                                                                                                                                                                                 | `format` field                     |

---

## Section 5: Error Response Schema

All endpoints return errors in this format:

```json
{
  "type": "urn:polaris:error:...",
  "status": 400,
  "title": "Bad Request",
  "detail": "Specific explanation of the error",
  "links": [],
  "locationId": "tracking-id",
  "remediation": "Suggested action to resolve"
}
```

Content-Type: `application/problem+json`

| Status | Description                                   |
| ------ | --------------------------------------------- |
| 400    | Bad request (invalid payload, missing fields) |
| 401    | Unauthorized (missing or invalid API token)   |
| 403    | Forbidden (insufficient permissions)          |
| 404    | Resource not found                            |
| 409    | Conflict (duplicate name for configurations)  |
| 500    | Internal server error                         |

---

## Section 6: Deprecation Timeline

| Deprecated Path Prefix | Current Path Prefix | Sunset Date                  |
| ---------------------- | ------------------- | ---------------------------- |
| `/api/report-service/` | `/api/insights/`    | Tue 24 Mar 2026 05:00:00 GMT |

**Deprecated Endpoints (avoid implementing):**

- `POST /reports/{reportType}/generate` - Use `POST /reports/{reportType}/_actions/run` instead
- `POST /reports/{reportType}/export` - Use `POST /reports/{reportType}/_actions/run` instead
- `GET /reports/{reportId}/download` - Use `GET /reports/{reportId}/_actions/download` instead

---

## Section 7: Typical Workflow

### Generate a Report (One-Time)

1. **Run the report:**
   ```
   POST /api/insights/reports/{reportType}/_actions/run
   Body: RunReportPayloadV3 with applications, severities, tools
   ```
   Response includes report `id` and `status: "INITIATED"`

2. **Poll for completion:**
   ```
   GET /api/insights/reports/{reportId}
   ```
   Wait until `status` is `COMPLETED` or `FAILED`

3. **Download the report:**
   ```
   GET /api/insights/reports/{reportId}/_actions/download
   ```
   Returns binary PDF or JSON file

### Create a Reusable Configuration with Schedule

1. **Create configuration:**
   ```
   POST /api/insights/configurations
   Body: ConfigurationPayloadV4
   ```

2. **Add a scheduler:**
   ```
   POST /api/insights/configurations/{configurationId}/schedulers
   Body: SchedulerPayload with frequency, timezone, etc.
   ```

3. Reports will be generated automatically per the schedule.

4. **Manually trigger from configuration:**
   ```
   POST /api/insights/configurations/{configurationId}/_actions/run
   ```

---

## Section 8: Sources

Documentation was extracted from:

- [Reports - Dev Portal (Black Duck)](https://polaris.blackduck.com/developer/default/documentation/reports)
- [Create a Report Guide](https://polaris.blackduck.com/developer/default/polaris-documentation/t_how-to-create-report)
- [API Reference Guide](https://polaris.blackduck.com/developer/default/documentation)
- [API Quickstart](https://polaris.blackduck.com/developer/default/documentation/t_api-quickstart)
- [API Introduction](https://polaris.blackduck.com/developer/default/documentation/c_api-intro)
