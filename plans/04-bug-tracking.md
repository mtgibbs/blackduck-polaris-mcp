# Bug Tracking Integration API - Comprehensive Implementation Plan

## Section 1: API Spec Summary

### 1.1 Overview

- **OpenAPI Version:** 3.1.0 (inferred from other Polaris APIs)
- **Title:** Bug Tracking Integration
- **Authentication:** ApiKeyAuth (header: `Api-token`)
- **Required Header:** `Organization-Id` (tenant identifier, required on all requests)
- **Base paths:**
  - `https://polaris.blackduck.com/api/integrations/bugtracking` (current)
  - `https://polaris.blackduck.com/api/issue-export-service` (deprecated, sunset Tue 24 Mar 2026)
- **Pagination:** Offset-based (`_offset` / `_limit`)
- **Filtering:** RSQL syntax via `_filter` query parameter
- **Sorting:** `{field}|{asc|desc}` via `_sort` query parameter
- **Access:** Organization administrators only

### 1.2 Media Types

| Media Type                                                 | Usage                                           |
| ---------------------------------------------------------- | ----------------------------------------------- |
| `application/vnd.polaris.bugtracking.configuration-1+json` | Bug tracking configurations (current)           |
| `application/vnd.iss.jira-1+json`                          | Jira configurations (deprecated until Mar 2026) |
| `application/json`                                         | Generic fallback / issue export requests        |
| `application/problem+json`                                 | Error responses                                 |

### 1.3 API Tags / Categories

| Tag                               | Description                                                           |
| --------------------------------- | --------------------------------------------------------------------- |
| Bug Tracking Configuration        | CRUD operations for bug tracking configurations (Jira, Azure DevOps)  |
| Bug Tracking Connection           | Test connectivity to external bug tracking systems                    |
| Bug Tracking Authorization        | OAuth authorization flow for Jira (create, read, update, delete auth) |
| Bug Tracking Projects             | Retrieve available projects and issue types from external systems     |
| Bug Tracking Project Mapping      | Map Polaris projects to external Jira/Azure DevOps projects           |
| Bug Tracking Issues Export        | Export Polaris issues as tickets or link to existing external tickets |
| Jira Configuration (deprecated)   | Legacy Jira-specific configuration endpoints                          |
| Jira Test Connection (deprecated) | Legacy Jira connection testing                                        |

### 1.4 Deprecation Timeline

All legacy endpoints under `/api/issue-export-service/jira/` and
`/api/issue-export-service/integration/jira/` are deprecated.

- **Deprecation date:** Mon, 16 Jun 2025 23:59:59 GMT
- **Sunset date:** Tue, 24 Mar 2026 05:00:00 GMT

Deprecated responses include headers: `Deprecation`, `Link` (pointing to replacement endpoint), and
`Sunset`.

---

### 1.5 Endpoints

#### Bug Tracking Configuration (Current - `/api/integrations/bugtracking`)

| Method | Path                   | OperationId                     | Deprecated |
| ------ | ---------------------- | ------------------------------- | ---------- |
| POST   | `/configurations`      | `createBugTrackingConfig`       | No         |
| GET    | `/configurations`      | `findBugTrackingConfigurations` | No         |
| GET    | `/configurations/{id}` | `getBugTrackingConfig`          | No         |
| PATCH  | `/configurations/{id}` | `updateBugTrackingConfig`       | No         |
| DELETE | `/configurations/{id}` | `deleteBugTrackingConfig`       | No         |

---

#### Bug Tracking Connection (Current)

| Method | Path                                   | OperationId                 | Deprecated |
| ------ | -------------------------------------- | --------------------------- | ---------- |
| POST   | `/configurations/{id}/test-connection` | `testBugTrackingConnection` | No         |

---

#### Bug Tracking Authorization (Current)

| Method | Path                                               | OperationId                      | Deprecated |
| ------ | -------------------------------------------------- | -------------------------------- | ---------- |
| POST   | `/configurations/{id}/authorizations`              | `createBugTrackingAuthorization` | No         |
| GET    | `/configurations/{id}/authorizations`              | `getBugTrackingAuthorization`    | No         |
| PATCH  | `/configurations/{id}/authorizations`              | `updateBugTrackingAuthorization` | No         |
| DELETE | `/configurations/{id}/authorizations`              | `deleteBugTrackingAuthorization` | No         |
| POST   | `/configurations/{id}/oauth-authorization`         | `requestTemporaryOAuthToken`     | No         |
| POST   | `/configurations/{id}/oauth-verification-code`     | `confirmOAuthAccess`             | No         |
| POST   | `/configurations/{id}/authorizations/access-token` | `createAccessToken`              | No         |
| GET    | `/configurations/{id}/authorizations/access-token` | `getAccessToken`                 | No         |
| PATCH  | `/configurations/{id}/authorizations/access-token` | `updateAccessToken`              | No         |
| DELETE | `/configurations/{id}/authorizations/access-token` | `deleteAccessToken`              | No         |

---

#### Bug Tracking Projects (Current)

| Method | Path                                                     | OperationId                  | Deprecated |
| ------ | -------------------------------------------------------- | ---------------------------- | ---------- |
| GET    | `/configurations/{id}/projects`                          | `getBugTrackingProjects`     | No         |
| GET    | `/configurations/{id}/projects/{projectKey}`             | `getBugTrackingProjectByKey` | No         |
| GET    | `/configurations/{id}/projects/{projectKey}/issue-types` | `getBugTrackingIssueTypes`   | No         |

---

#### Bug Tracking Project Mapping (Current)

| Method | Path                     | OperationId                       | Deprecated |
| ------ | ------------------------ | --------------------------------- | ---------- |
| POST   | `/project-mappings`      | `createBugTrackingProjectMapping` | No         |
| GET    | `/project-mappings`      | `getBugTrackingProjectMappings`   | No         |
| GET    | `/project-mappings/{id}` | `getBugTrackingProjectMapping`    | No         |
| PATCH  | `/project-mappings/{id}` | `updateBugTrackingProjectMapping` | No         |
| DELETE | `/project-mappings/{id}` | `deleteBugTrackingProjectMapping` | No         |

---

#### Bug Tracking Issues Export (Current)

| Method | Path                                 | OperationId                | Deprecated |
| ------ | ------------------------------------ | -------------------------- | ---------- |
| POST   | `/configurations/{id}/issues-export` | `exportIssuesToBugTracker` | No         |

> **Note (May 2025 enhancement):** The `POST /configurations/{id}/issues-export` endpoint was
> enhanced so that, in addition to creating new tickets in Jira and Azure DevOps, you can use it to
> link Polaris issues to pre-existing tickets in Jira or Azure DevOps.

---

#### Deprecated Jira Configuration Endpoints (Legacy)

| Method | Path         | OperationId                   | Deprecated |
| ------ | ------------ | ----------------------------- | ---------- |
| POST   | `/jira`      | `createJiraConfig`            | Yes        |
| GET    | `/jira`      | `findJiraConfigurations`      | Yes        |
| GET    | `/jira/{id}` | `findJiraConfigurationById`   | Yes        |
| PATCH  | `/jira/{id}` | `updateJiraConfig`            | Yes        |
| DELETE | `/jira/{id}` | `deleteJiraConfigurationById` | Yes        |

---

#### Deprecated Jira Connection Testing (Legacy)

| Method | Path                         | OperationId          | Deprecated |
| ------ | ---------------------------- | -------------------- | ---------- |
| POST   | `/jira/{id}/test-connection` | `testJiraConnection` | Yes        |

---

#### Deprecated Jira Authorization Endpoints (Legacy)

| Method | Path                                             | OperationId                      | Deprecated |
| ------ | ------------------------------------------------ | -------------------------------- | ---------- |
| POST   | `/integration/jira/{id}/auth`                    | `createJiraAuth`                 | Yes        |
| GET    | `/integration/jira/{id}/auth`                    | `getJiraAuth`                    | Yes        |
| PATCH  | `/integration/jira/{id}/auth`                    | `updateJiraAuth`                 | Yes        |
| DELETE | `/integration/jira/{id}/auth`                    | `deleteJiraAuth`                 | Yes        |
| POST   | `/integration/jira/{id}/oauth-authorization`     | `requestTemporaryJiraOAuthToken` | Yes        |
| POST   | `/integration/jira/{id}/oauth-verification-code` | `confirmJiraOAuthAccess`         | Yes        |
| POST   | `/integration/jira/{id}/auth/access-token`       | `createJiraAuthAccessToken`      | Yes        |
| GET    | `/integration/jira/{id}/auth/access-token`       | `getJiraAccessToken`             | Yes        |
| PATCH  | `/integration/jira/{id}/auth/access-token`       | `updateJiraAccessToken`          | Yes        |
| DELETE | `/integration/jira/{id}/auth/access-token`       | `deleteJiraAccessToken`          | Yes        |

---

#### Deprecated Jira Project Mapping Endpoints (Legacy)

| Method | Path                                      | OperationId                | Deprecated |
| ------ | ----------------------------------------- | -------------------------- | ---------- |
| POST   | `/integration/jira/project-mappings`      | `createJiraProjectMapping` | Yes        |
| GET    | `/integration/jira/project-mappings`      | `getJiraProjectMappings`   | Yes        |
| GET    | `/integration/jira/project-mappings/{id}` | `getJiraProjectMapping`    | Yes        |
| PATCH  | `/integration/jira/project-mappings/{id}` | `updateJiraProjectMapping` | Yes        |
| DELETE | `/integration/jira/project-mappings/{id}` | `deleteJiraProjectMapping` | Yes        |

---

#### Deprecated Jira Projects Endpoints (Legacy)

| Method | Path                                               | OperationId           | Deprecated |
| ------ | -------------------------------------------------- | --------------------- | ---------- |
| GET    | `/jira/{id}/projects`                              | `getJiraProjects`     | Yes        |
| GET    | `/jira/{id}/projects/{jiraProjectKey}`             | `getJiraProjectByKey` | Yes        |
| GET    | `/jira/{id}/projects/{jiraProjectKey}/issue-types` | `getJiraIssueTypes`   | Yes        |

---

#### Deprecated Jira Linked Issues Endpoints (Legacy)

| Method | Path                                         | OperationId                   | Deprecated |
| ------ | -------------------------------------------- | ----------------------------- | ---------- |
| POST   | `/jira/{jiraId}/linked-issues`               | `linkIssueToJira`             | Yes        |
| GET    | `/jira/{jiraId}/linked-issues`               | `getJiraLinkedIssues`         | Yes        |
| GET    | `/jira/{jiraId}/linked-issues/{id}`          | `getJiraLinkedIssue`          | Yes        |
| DELETE | `/jira/{jiraId}/linked-issues/{id}`          | `deleteJiraLinkedIssue`       | Yes        |
| POST   | `/jira/{jiraId}/linked-issues/{id}/comments` | `createCommentForLinkedIssue` | Yes        |

---

### 1.6 Endpoint Details - Write Operations (POST/PUT/PATCH/DELETE)

#### POST `/configurations` - Create Bug Tracking Configuration

Creates a new bug tracking configuration for Jira or Azure DevOps.

**Query Parameters:**

| Name     | In    | Type   | Required | Description                           |
| -------- | ----- | ------ | -------- | ------------------------------------- |
| `system` | query | string | yes      | External system type: `jira`, `azure` |

**Request Body:** `anyOf` - depends on `system` value.

**For Jira (`system=jira`):**

```json
{
  "url": "https://your-instance.atlassian.net",
  "type": "JIRA",
  "enabled": true,
  "details": {
    "deploymentType": "CLOUD"
  }
}
```

| Field                    | Type    | Required | Description                                  |
| ------------------------ | ------- | -------- | -------------------------------------------- |
| `url`                    | string  | yes      | Jira instance URL                            |
| `type`                   | string  | yes      | Literal `"JIRA"`                             |
| `enabled`                | boolean | no       | Whether the configuration is active          |
| `details`                | object  | no       | System-specific details                      |
| `details.deploymentType` | string  | no       | `"CLOUD"` or `"SERVER"` (Server/Data Center) |

**For Azure DevOps (`system=azure`):**

```json
{
  "url": "https://dev.azure.com/your-org",
  "type": "AZURE",
  "enabled": true,
  "details": {
    "accessToken": "your-personal-access-token"
  }
}
```

| Field                 | Type    | Required | Description                              |
| --------------------- | ------- | -------- | ---------------------------------------- |
| `url`                 | string  | yes      | Azure DevOps organization URL            |
| `type`                | string  | yes      | Literal `"AZURE"`                        |
| `enabled`             | boolean | no       | Whether the configuration is active      |
| `details`             | object  | no       | System-specific details                  |
| `details.accessToken` | string  | yes      | Azure DevOps Personal Access Token (PAT) |

**Response:** `createBugTrackingConfigResponse` (200) - the created configuration object.

**Status Codes:** 200, 400, 403, 405, 406, 500

---

#### GET `/configurations` - List Bug Tracking Configurations

**Query Parameters:**

| Name      | In    | Type    | Required | Default     | Description                             |
| --------- | ----- | ------- | -------- | ----------- | --------------------------------------- |
| `_filter` | query | string  | no       | -           | RSQL filter expression                  |
| `_sort`   | query | string  | no       | `type\|asc` | Sort expression: `{field}\|{asc\|desc}` |
| `_offset` | query | integer | no       | 0           | Pagination offset                       |
| `_limit`  | query | integer | no       | 100         | Page size (max 100)                     |

**RSQL Filterable Fields:**

| Field            | Type    | Description                         |
| ---------------- | ------- | ----------------------------------- |
| `id`             | uuid    | Configuration ID                    |
| `tenantId`       | uuid    | Tenant/organization ID              |
| `type`           | string  | Configuration type: `JIRA`, `AZURE` |
| `url`            | string  | External system URL                 |
| `enabled`        | boolean | Whether configuration is active     |
| `deploymentType` | string  | Jira deployment type                |

**Response:** Paginated collection with `_items`, `_links`, `_collection`.

---

#### GET `/configurations/{id}` - Get Configuration by ID

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Response:** `getBugTrackingConfigResponse`

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### PATCH `/configurations/{id}` - Update Bug Tracking Configuration

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Request Body:** `updateBugTrackingConfigRequest` - partial update of configuration fields.

```json
{
  "url": "https://updated-instance.atlassian.net",
  "enabled": false,
  "details": {
    "deploymentType": "SERVER"
  }
}
```

| Field     | Type    | Required | Description                     |
| --------- | ------- | -------- | ------------------------------- |
| `url`     | string  | no       | Updated external system URL     |
| `enabled` | boolean | no       | Updated activation status       |
| `details` | object  | no       | Updated system-specific details |

**Response:** `updateBugTrackingConfigResponse`

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### DELETE `/configurations/{id}` - Delete Bug Tracking Configuration

Deletes the configuration and all related OAuth credentials, access tokens, and project mappings.

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Response:** 200 (success), no body

**Status Codes:** 200, 400, 404, 405, 406, 500

---

#### POST `/configurations/{id}/test-connection` - Test Connection

Verifies connectivity to the configured external bug tracking system.

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Response:** `testConnectionResponse` (200) - connectivity status.

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### POST `/configurations/{id}/authorizations` - Create Authorization

Establishes OAuth credentials for a Jira integration.

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Request Body:** OAuth credentials.

```json
{
  "consumerKey": "OauthKey",
  "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
}
```

| Field         | Type   | Required | Description                              |
| ------------- | ------ | -------- | ---------------------------------------- |
| `consumerKey` | string | yes      | OAuth consumer key (default: `OauthKey`) |
| `privateKey`  | string | yes      | PKCS8-format RSA private key             |

**Response:** `createAuthorizationResponse`

**Status Codes:** 200, 400, 403, 405, 406, 500

---

#### POST `/configurations/{id}/oauth-authorization` - Request Temporary OAuth Token

Initiates the OAuth flow by requesting a temporary token from Jira.

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Response:** `oauthAuthorizationResponse` - contains the temporary token and authorization URL that
the admin must visit to authorize Polaris.

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### POST `/configurations/{id}/oauth-verification-code` - Confirm OAuth Access

Completes the OAuth flow by submitting the verification code obtained after the admin authorizes
Polaris in the Jira UI.

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Request Body:**

```json
{
  "verificationCode": "abc123"
}
```

| Field              | Type   | Required | Description                          |
| ------------------ | ------ | -------- | ------------------------------------ |
| `verificationCode` | string | yes      | OAuth verification code from Jira UI |

**Response:** `oauthVerificationResponse`

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### POST `/configurations/{id}/authorizations/access-token` - Create Access Token

Generates an access token for the authorized Jira integration.

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Response:** `createAccessTokenResponse`

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### DELETE `/configurations/{id}/authorizations` - Delete Authorization

Removes OAuth credentials for a configuration.

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### GET `/configurations/{id}/projects` - List External Projects

Retrieves available projects from the configured external system (Jira or Azure DevOps).

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Query Parameters:**

| Name      | In    | Type    | Required | Default | Description                 |
| --------- | ----- | ------- | -------- | ------- | --------------------------- |
| `_filter` | query | string  | no       | -       | RSQL filter (field: `name`) |
| `_offset` | query | integer | no       | 0       | Pagination offset           |
| `_limit`  | query | integer | no       | 100     | Page size (max 100)         |

**RSQL Filter:** `name==PROJECTNAME` or `name=like='%partial%'`

**Response:** Paginated collection of project objects.

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### GET `/configurations/{id}/projects/{projectKey}` - Get External Project by Key

**Path Parameters:**

| Name         | In   | Type   | Required | Description                           |
| ------------ | ---- | ------ | -------- | ------------------------------------- |
| `id`         | path | uuid   | yes      | Configuration ID                      |
| `projectKey` | path | string | yes      | External project key (case-sensitive) |

**Response:** Project details including key, name, and available issue types.

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### GET `/configurations/{id}/projects/{projectKey}/issue-types` - List Issue Types

Retrieves valid issue types for a specific project in the external system.

**Path Parameters:**

| Name         | In   | Type   | Required | Description                           |
| ------------ | ---- | ------ | -------- | ------------------------------------- |
| `id`         | path | uuid   | yes      | Configuration ID                      |
| `projectKey` | path | string | yes      | External project key (case-sensitive) |

**Response:** Paginated collection of issue type objects (id, name, description).

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### POST `/project-mappings` - Create Project Mapping

Links a Polaris project to an external Jira or Azure DevOps project.

**Request Body:** `createProjectMappingRequest`

```json
{
  "configurationId": "uuid-of-bug-tracking-config",
  "polarisProjectId": "uuid-of-polaris-project",
  "externalProjectKey": "JIRA-PROJECT-KEY",
  "externalIssueTypeId": "10001",
  "enabled": true
}
```

| Field                 | Type    | Required | Description                                         |
| --------------------- | ------- | -------- | --------------------------------------------------- |
| `configurationId`     | uuid    | yes      | Bug tracking configuration ID                       |
| `polarisProjectId`    | uuid    | yes      | Polaris project ID to map                           |
| `externalProjectKey`  | string  | yes      | External project key (Jira project key or Azure ID) |
| `externalIssueTypeId` | string  | no       | Issue type ID from the external system              |
| `enabled`             | boolean | no       | Whether the mapping is active                       |

> **Constraint:** Each Polaris project can only be connected to one Azure DevOps or Jira project.

**Response:** `createProjectMappingResponse`

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### GET `/project-mappings` - List Project Mappings

**Query Parameters:**

| Name      | In    | Type    | Required | Default | Description            |
| --------- | ----- | ------- | -------- | ------- | ---------------------- |
| `_filter` | query | string  | no       | -       | RSQL filter expression |
| `_offset` | query | integer | no       | 0       | Pagination offset      |
| `_limit`  | query | integer | no       | 100     | Page size (max 100)    |

**Response:** Paginated collection of project mapping objects.

**Status Codes:** 200, 400, 403, 405, 406, 500

---

#### PATCH `/project-mappings/{id}` - Update Project Mapping

**Path Parameters:**

| Name | In   | Type | Required | Description        |
| ---- | ---- | ---- | -------- | ------------------ |
| `id` | path | uuid | yes      | Project mapping ID |

**Request Body:** `updateProjectMappingRequest`

```json
{
  "externalProjectKey": "NEW-PROJECT-KEY",
  "externalIssueTypeId": "10002",
  "enabled": false
}
```

**Response:** `updateProjectMappingResponse`

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### DELETE `/project-mappings/{id}` - Delete Project Mapping

Deletes the mapping and all related linked issues.

**Path Parameters:**

| Name | In   | Type | Required | Description        |
| ---- | ---- | ---- | -------- | ------------------ |
| `id` | path | uuid | yes      | Project mapping ID |

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

#### POST `/configurations/{id}/issues-export` - Export Issues to Bug Tracker

**This is the primary write operation for creating tickets / linking issues.**

Exports Polaris security issues to an external bug tracker (Jira or Azure DevOps). As of May 2025,
this endpoint supports two modes:

1. **Create new tickets** - Creates new tickets/work items in the external system
2. **Link to existing tickets** - Links Polaris issues to pre-existing tickets in Jira/Azure DevOps

**Path Parameters:**

| Name | In   | Type | Required | Description      |
| ---- | ---- | ---- | -------- | ---------------- |
| `id` | path | uuid | yes      | Configuration ID |

**Request Body:** `issuesExportRequest`

```json
{
  "issueIds": ["issue-uuid-1", "issue-uuid-2"],
  "projectId": "polaris-project-uuid",
  "branchId": "polaris-branch-uuid",
  "externalProjectKey": "JIRA-KEY",
  "externalIssueTypeId": "10001",
  "externalTicketId": "JIRA-KEY-123"
}
```

| Field                 | Type     | Required | Description                                                          |
| --------------------- | -------- | -------- | -------------------------------------------------------------------- |
| `issueIds`            | string[] | yes      | Array of Polaris issue IDs to export                                 |
| `projectId`           | uuid     | yes      | Polaris project ID that the issues belong to                         |
| `branchId`            | uuid     | no       | Polaris branch ID for scoping                                        |
| `externalProjectKey`  | string   | no       | External project key (if not using project mapping default)          |
| `externalIssueTypeId` | string   | no       | Issue type ID in the external system                                 |
| `externalTicketId`    | string   | no       | Existing ticket ID to link to (for linking mode instead of creating) |

> **Note on modes:**
>
> - To **create new tickets**: Provide `issueIds`, `projectId`, and optionally
>   `externalProjectKey`/`externalIssueTypeId` (or rely on the project mapping defaults).
> - To **link to existing tickets**: Also provide `externalTicketId` to link instead of create.

**Ticket Content (when creating):**

When Polaris creates a ticket in the external system, the ticket includes:

- **Summary:** Dynamic format based on issue type and source (manual export or policy violation)
- **Description:** Issue details, evidence, remediation guidance, and links back to Polaris
- **Reporter:** The configured integration user

**Response:** `issuesExportResponse` (200) - details of created/linked tickets.

**Status Codes:** 200, 400, 403, 404, 405, 406, 500

---

### 1.7 Deprecated Linked Issues Endpoints (Legacy - detailed)

These legacy endpoints provide more granular control over Jira linked issues. They are deprecated
but documented here for completeness and to inform the equivalent current endpoints.

#### POST `/jira/{jiraId}/linked-issues` - Create Linked Jira Ticket (Deprecated)

**Path Parameters:**

| Name     | In   | Type | Required | Description    |
| -------- | ---- | ---- | -------- | -------------- |
| `jiraId` | path | uuid | yes      | Jira config ID |

**Request Body:** `postRequestLinkIssue`

```json
{
  "issueId": "polaris-issue-uuid",
  "projectId": "polaris-project-uuid",
  "branchId": "polaris-branch-uuid",
  "jiraProjectKey": "PROJ",
  "jiraIssueTypeId": "10001"
}
```

**Response:** `postResponseLinkIssue` - contains the created Jira issue key and link details.

---

#### POST `/jira/{jiraId}/linked-issues/{id}/comments` - Add Comment (Deprecated)

**Path Parameters:**

| Name     | In   | Type | Required | Description     |
| -------- | ---- | ---- | -------- | --------------- |
| `jiraId` | path | uuid | yes      | Jira config ID  |
| `id`     | path | uuid | yes      | Linked issue ID |

**Request Body:** `postRequestAddCommentLinkIssue`

```json
{
  "comment": "Updated status from Polaris"
}
```

**Response:** `postResponseAddCommentLinkIssue`

---

### 1.8 Pagination

All collection endpoints use **offset-based pagination**.

**Query parameters:**

- `_offset` (integer, default: 0) - number of items to skip
- `_limit` (integer, default: 100, max: 100) - max items per page

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

### 1.9 RSQL Filter Fields

#### For GET `/configurations`

| Field            | Type    | Description              |
| ---------------- | ------- | ------------------------ |
| `id`             | uuid    | Configuration ID         |
| `tenantId`       | uuid    | Organization/tenant ID   |
| `type`           | string  | `JIRA` or `AZURE`        |
| `url`            | string  | External system URL      |
| `enabled`        | boolean | Whether config is active |
| `deploymentType` | string  | Jira deployment type     |

#### For GET `/configurations/{id}/projects`

| Field  | Type   | Description           |
| ------ | ------ | --------------------- |
| `name` | string | External project name |

### 1.10 Schema / Model Definitions

#### BugTrackingConfiguration

Returned from configuration endpoints. Represents a configured connection to an external bug
tracking system.

| Field            | Type          | Required | Description                                |
| ---------------- | ------------- | -------- | ------------------------------------------ |
| `id`             | string (uuid) | yes      | Unique configuration identifier            |
| `tenantId`       | string (uuid) | yes      | Organization/tenant identifier             |
| `url`            | string        | yes      | External system URL                        |
| `type`           | ConfigType    | yes      | System type: `JIRA` or `AZURE`             |
| `enabled`        | boolean       | yes      | Whether the configuration is active        |
| `deploymentType` | string        | no       | Jira: `CLOUD` or `SERVER`; Azure: not used |
| `createdAt`      | string (dt)   | no       | Creation timestamp (ISO 8601)              |
| `updatedAt`      | string (dt)   | no       | Last update timestamp (ISO 8601)           |
| `_links`         | LinkEntry[]   | yes      | HATEOAS links                              |

---

#### ExternalProject

Returned from project listing endpoints. Represents a project in the external system.

| Field        | Type        | Required | Description                |
| ------------ | ----------- | -------- | -------------------------- |
| `key`        | string      | yes      | Project key (e.g., `PROJ`) |
| `name`       | string      | yes      | Project display name       |
| `issueTypes` | IssueType[] | no       | Available issue types      |
| `_links`     | LinkEntry[] | no       | HATEOAS links              |

---

#### ExternalIssueType

Returned from issue type listing endpoints.

| Field         | Type   | Required | Description            |
| ------------- | ------ | -------- | ---------------------- |
| `id`          | string | yes      | Issue type ID          |
| `name`        | string | yes      | Issue type name        |
| `description` | string | no       | Issue type description |

---

#### ProjectMapping

Returned from project mapping endpoints. Represents the link between a Polaris project and an
external project.

| Field                 | Type          | Required | Description                            |
| --------------------- | ------------- | -------- | -------------------------------------- |
| `id`                  | string (uuid) | yes      | Mapping identifier                     |
| `configurationId`     | string (uuid) | yes      | Bug tracking configuration ID          |
| `polarisProjectId`    | string (uuid) | yes      | Polaris project ID                     |
| `externalProjectKey`  | string        | yes      | External project key                   |
| `externalIssueTypeId` | string        | no       | Default issue type for ticket creation |
| `enabled`             | boolean       | yes      | Whether the mapping is active          |
| `createdAt`           | string (dt)   | no       | Creation timestamp                     |
| `updatedAt`           | string (dt)   | no       | Last update timestamp                  |
| `_links`              | LinkEntry[]   | yes      | HATEOAS links                          |

---

#### IssueExportResult

Returned from the issues-export endpoint. Represents the result of exporting issues.

| Field               | Type          | Required | Description                                 |
| ------------------- | ------------- | -------- | ------------------------------------------- |
| `id`                | string (uuid) | yes      | Export result identifier                    |
| `externalTicketId`  | string        | yes      | Created/linked ticket ID (e.g., `PROJ-123`) |
| `externalTicketUrl` | string        | no       | URL to the ticket in the external system    |
| `issueIds`          | string[]      | yes      | Polaris issue IDs that were exported/linked |
| `status`            | string        | yes      | Export status                               |
| `_links`            | LinkEntry[]   | no       | HATEOAS links                               |

---

#### LinkedIssue (Legacy)

Returned from the deprecated linked issues endpoints.

| Field            | Type          | Required | Description                       |
| ---------------- | ------------- | -------- | --------------------------------- |
| `id`             | string (uuid) | yes      | Linked issue mapping identifier   |
| `issueId`        | string (uuid) | yes      | Polaris issue ID                  |
| `jiraIssueKey`   | string        | yes      | Jira issue key (e.g., `PROJ-123`) |
| `jiraIssueUrl`   | string        | no       | URL to the Jira issue             |
| `jiraProjectKey` | string        | yes      | Jira project key                  |
| `status`         | string        | no       | Link status                       |
| `createdAt`      | string (dt)   | no       | Creation timestamp                |
| `_links`         | LinkEntry[]   | yes      | HATEOAS links                     |

---

### 1.11 Enums

| Enum Name        | Values            | Used In                             |
| ---------------- | ----------------- | ----------------------------------- |
| `ConfigType`     | `JIRA`, `AZURE`   | BugTrackingConfiguration.type       |
| `DeploymentType` | `CLOUD`, `SERVER` | Jira configuration details          |
| `SystemParam`    | `jira`, `azure`   | POST /configurations `system` param |

### 1.12 Authentication Details

**API Key Authentication:**

- Header: `Api-token` (standard Polaris API token)
- Header: `Organization-Id` (required tenant identifier for bug tracking endpoints)

**OAuth Flow for Jira Integration (Jira Server/Data Center):**

1. **Generate RSA keys** using OpenSSL:
   - Private key: `openssl genrsa -out jira_privatekey.pem 1024`
   - X509 certificate: `openssl req -newkey rsa:1024 -x509 -key jira_privatekey.pem`
   - PKCS8 private key: `openssl pkcs8 -topk8 -nocrypt`
   - Public key: `openssl x509 -pubkey -noout`

2. **Configure Jira Application Link:**
   - Application Type: Generic Application
   - Consumer Key: `OauthKey` (hardcoded)
   - Consumer Name: `Polaris`
   - Public Key: from the X.509 certificate

3. **API OAuth Flow:**
   - `POST /configurations/{id}/authorizations` - Submit consumer key + private key
   - `POST /configurations/{id}/oauth-authorization` - Get temporary token + auth URL
   - Admin visits the authorization URL in Jira to approve
   - `POST /configurations/{id}/oauth-verification-code` - Submit verification code
   - `POST /configurations/{id}/authorizations/access-token` - Generate access token

**Azure DevOps Authentication:**

- Uses Personal Access Tokens (PAT) directly in the configuration details
- No OAuth flow required

### 1.13 Error Responses

| Status | Error Type                       | Description                              |
| ------ | -------------------------------- | ---------------------------------------- |
| 400    | `request-body-missing`           | Required request body not provided       |
| 400    | `missing-tenant-header`          | `Organization-Id` header not found       |
| 400    | `invalid-method-argument`        | Invalid parameter values                 |
| 400    | `bad-request`                    | Validation failures (e.g., invalid UUID) |
| 403    | `resource-access-not-allowed`    | Tenant access denied                     |
| 403    | `access-token-invalid`           | Missing/invalid authorization header     |
| 404    | `resource-not-found`             | Resource does not exist                  |
| 405    | `method-not-allowed`             | HTTP method not supported for endpoint   |
| 406    | `http-media-type-not-acceptable` | Unsupported Accept header                |
| 500    | `internal-server-error`          | Unexpected server error                  |

Errors return `application/problem+json` with the standard RFC 7807 `ProblemDetail` structure.

### 1.14 Important Constraints

1. **Admin-only access** - All Bug Tracking Integration API endpoints are only accessible to
   organization administrators.

2. **One mapping per project** - Each Polaris project can only be connected to one Azure DevOps or
   Jira project.

3. **Immutable links** - Links that appear in the Polaris Issues view cannot be overwritten. Once an
   issue is linked to a ticket, it cannot be linked to a new ticket even after integration changes.

4. **Cascade deletes:**
   - Deleting a configuration deletes all related OAuth credentials, access tokens, and project
     mappings.
   - Deleting a project mapping deletes all related linked issues.

5. **Supported platforms:**
   - Jira Cloud (classic) - latest LTS release
   - Jira Server / Data Center
   - Azure DevOps
   - Jira Next-Gen: **not supported**

6. **Exportable issue types:** DAST, SAST, and SCA issues can all be exported.

---

## Section 2: Current Implementation Analysis

### 2.1 What We Have Now

No bug tracking implementation exists in the codebase. The CLAUDE.md file lists `Bug Tracking` as a
known API service with base path `/api/integrations/bugtracking`, but there are no:

- Type definitions for bug tracking models
- API layer functions for bug tracking endpoints
- Service layer functions for bug tracking
- MCP tools for bug tracking

### 2.2 What's Correct

- The base path `/api/integrations/bugtracking` is correctly documented in CLAUDE.md.
- The existing `PolarisClient` supports all needed HTTP methods (GET, POST, PATCH, DELETE) through
  the `fetch()` method.
- The `getAllOffset()` pagination helper works for bug tracking list endpoints.

### 2.3 What's Missing - Everything

The entire bug tracking integration needs to be built from scratch:

1. **Types** - All interfaces for configurations, project mappings, issue exports, etc.
2. **API layer** - All endpoint functions
3. **Service layer** - Business logic for common workflows
4. **MCP tools** - Tools for the most useful operations

---

## Section 3: Implementation Plan

### 3.1 New Types in `src/types/polaris.ts`

Add the following types to the Bug Tracking section:

```typescript
// --- Bug Tracking Integration ---

/**
 * Bug tracking system type.
 */
export type BugTrackingSystemType = "JIRA" | "AZURE";

/**
 * Jira deployment type.
 */
export type JiraDeploymentType = "CLOUD" | "SERVER";

/**
 * Bug tracking configuration. Represents a connection to Jira or Azure DevOps.
 * Returned from GET /api/integrations/bugtracking/configurations
 */
export interface BugTrackingConfiguration {
  id: string;
  tenantId?: string;
  url: string;
  type: BugTrackingSystemType;
  enabled: boolean;
  deploymentType?: JiraDeploymentType;
  createdAt?: string;
  updatedAt?: string;
  _links: LinkEntry[];
}

/**
 * External project in Jira or Azure DevOps.
 * Returned from GET /configurations/{id}/projects
 */
export interface ExternalProject {
  key: string;
  name: string;
  issueTypes?: ExternalIssueType[];
  _links?: LinkEntry[];
}

/**
 * Issue type available in an external project.
 */
export interface ExternalIssueType {
  id: string;
  name: string;
  description?: string;
}

/**
 * Mapping between a Polaris project and an external project.
 * Returned from GET /project-mappings
 */
export interface ProjectMapping {
  id: string;
  configurationId: string;
  polarisProjectId: string;
  externalProjectKey: string;
  externalIssueTypeId?: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  _links: LinkEntry[];
}

/**
 * Result of exporting issues to an external bug tracker.
 * Returned from POST /configurations/{id}/issues-export
 */
export interface IssueExportResult {
  id: string;
  externalTicketId: string;
  externalTicketUrl?: string;
  issueIds: string[];
  status: string;
  _links?: LinkEntry[];
}
```

### 3.2 New API Layer: `src/api/bug-tracking.ts`

```typescript
import { getClient } from "./client.ts";
import type {
  BugTrackingConfiguration,
  ExternalIssueType,
  ExternalProject,
  IssueExportResult,
  ProjectMapping,
} from "../types/polaris.ts";

const BASE = "/api/integrations/bugtracking";
const ACCEPT = "application/vnd.polaris.bugtracking.configuration-1+json";

// --- Configurations ---

export interface CreateConfigParams {
  system: "jira" | "azure";
  url: string;
  type: "JIRA" | "AZURE";
  enabled?: boolean;
  details?: {
    deploymentType?: "CLOUD" | "SERVER";
    accessToken?: string;
  };
}

export function createConfiguration(
  params: CreateConfigParams,
): Promise<BugTrackingConfiguration> {
  const client = getClient();
  const { system, ...body } = params;
  return client.fetch<BugTrackingConfiguration>(`${BASE}/configurations`, {
    method: "POST",
    params: { system },
    body,
    accept: ACCEPT,
    contentType: "application/json",
  });
}

export interface GetConfigurationsParams {
  filter?: string;
  sort?: string;
  offset?: number;
  limit?: number;
}

export function getConfigurations(
  params?: GetConfigurationsParams,
): Promise<BugTrackingConfiguration[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params?.filter) queryParams._filter = params.filter;
  if (params?.sort) queryParams._sort = params.sort;
  if (params?.offset !== undefined) queryParams._offset = params.offset;
  if (params?.limit !== undefined) queryParams._limit = params.limit;
  return client.getAllOffset<BugTrackingConfiguration>(
    `${BASE}/configurations`,
    queryParams,
    ACCEPT,
  );
}

export function getConfiguration(id: string): Promise<BugTrackingConfiguration> {
  const client = getClient();
  return client.get<BugTrackingConfiguration>(
    `${BASE}/configurations/${id}`,
    undefined,
    ACCEPT,
  );
}

export interface UpdateConfigParams {
  id: string;
  url?: string;
  enabled?: boolean;
  details?: {
    deploymentType?: "CLOUD" | "SERVER";
    accessToken?: string;
  };
}

export function updateConfiguration(
  params: UpdateConfigParams,
): Promise<BugTrackingConfiguration> {
  const client = getClient();
  const { id, ...body } = params;
  return client.fetch<BugTrackingConfiguration>(
    `${BASE}/configurations/${id}`,
    {
      method: "PATCH",
      body,
      accept: ACCEPT,
      contentType: "application/json",
    },
  );
}

export function deleteConfiguration(id: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(`${BASE}/configurations/${id}`, {
    method: "DELETE",
  });
}

// --- Connection Testing ---

export function testConnection(configId: string): Promise<unknown> {
  const client = getClient();
  return client.fetch(`${BASE}/configurations/${configId}/test-connection`, {
    method: "POST",
    accept: ACCEPT,
  });
}

// --- External Projects ---

export interface GetExternalProjectsParams {
  configId: string;
  filter?: string;
  offset?: number;
  limit?: number;
}

export function getExternalProjects(
  params: GetExternalProjectsParams,
): Promise<ExternalProject[]> {
  const client = getClient();
  const queryParams: Record<string, string | number | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.offset !== undefined) queryParams._offset = params.offset;
  if (params.limit !== undefined) queryParams._limit = params.limit;
  return client.getAllOffset<ExternalProject>(
    `${BASE}/configurations/${params.configId}/projects`,
    queryParams,
    ACCEPT,
  );
}

export function getExternalProject(
  configId: string,
  projectKey: string,
): Promise<ExternalProject> {
  const client = getClient();
  return client.get<ExternalProject>(
    `${BASE}/configurations/${configId}/projects/${projectKey}`,
    undefined,
    ACCEPT,
  );
}

export function getExternalIssueTypes(
  configId: string,
  projectKey: string,
): Promise<ExternalIssueType[]> {
  const client = getClient();
  return client.getAllOffset<ExternalIssueType>(
    `${BASE}/configurations/${configId}/projects/${projectKey}/issue-types`,
    undefined,
    ACCEPT,
  );
}

// --- Project Mappings ---

export interface CreateProjectMappingParams {
  configurationId: string;
  polarisProjectId: string;
  externalProjectKey: string;
  externalIssueTypeId?: string;
  enabled?: boolean;
}

export function createProjectMapping(
  params: CreateProjectMappingParams,
): Promise<ProjectMapping> {
  const client = getClient();
  return client.fetch<ProjectMapping>(`${BASE}/project-mappings`, {
    method: "POST",
    body: params,
    accept: ACCEPT,
    contentType: "application/json",
  });
}

export function getProjectMappings(
  filter?: string,
): Promise<ProjectMapping[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (filter) queryParams._filter = filter;
  return client.getAllOffset<ProjectMapping>(
    `${BASE}/project-mappings`,
    queryParams,
    ACCEPT,
  );
}

export function getProjectMapping(id: string): Promise<ProjectMapping> {
  const client = getClient();
  return client.get<ProjectMapping>(
    `${BASE}/project-mappings/${id}`,
    undefined,
    ACCEPT,
  );
}

export interface UpdateProjectMappingParams {
  id: string;
  externalProjectKey?: string;
  externalIssueTypeId?: string;
  enabled?: boolean;
}

export function updateProjectMapping(
  params: UpdateProjectMappingParams,
): Promise<ProjectMapping> {
  const client = getClient();
  const { id, ...body } = params;
  return client.fetch<ProjectMapping>(`${BASE}/project-mappings/${id}`, {
    method: "PATCH",
    body,
    accept: ACCEPT,
    contentType: "application/json",
  });
}

export function deleteProjectMapping(id: string): Promise<void> {
  const client = getClient();
  return client.fetch<void>(`${BASE}/project-mappings/${id}`, {
    method: "DELETE",
  });
}

// --- Issues Export ---

export interface ExportIssuesParams {
  configId: string;
  issueIds: string[];
  projectId: string;
  branchId?: string;
  externalProjectKey?: string;
  externalIssueTypeId?: string;
  externalTicketId?: string;
}

export function exportIssues(
  params: ExportIssuesParams,
): Promise<IssueExportResult> {
  const client = getClient();
  const { configId, ...body } = params;
  return client.fetch<IssueExportResult>(
    `${BASE}/configurations/${configId}/issues-export`,
    {
      method: "POST",
      body,
      accept: ACCEPT,
      contentType: "application/json",
    },
  );
}
```

### 3.3 New Service Layer: `src/services/bug-tracking.ts`

```typescript
import * as bugTrackingApi from "../api/bug-tracking.ts";
import type {
  BugTrackingConfiguration,
  ExternalIssueType,
  ExternalProject,
  IssueExportResult,
  ProjectMapping,
} from "../types/polaris.ts";

// --- Configurations ---

export function getConfigurations(
  filter?: string,
): Promise<BugTrackingConfiguration[]> {
  return bugTrackingApi.getConfigurations({ filter });
}

export function getConfiguration(
  id: string,
): Promise<BugTrackingConfiguration> {
  return bugTrackingApi.getConfiguration(id);
}

// --- External Projects ---

export interface GetExternalProjectsOptions {
  configId: string;
  filter?: string;
}

export function getExternalProjects(
  options: GetExternalProjectsOptions,
): Promise<ExternalProject[]> {
  return bugTrackingApi.getExternalProjects(options);
}

export function getExternalIssueTypes(
  configId: string,
  projectKey: string,
): Promise<ExternalIssueType[]> {
  return bugTrackingApi.getExternalIssueTypes(configId, projectKey);
}

// --- Project Mappings ---

export function getProjectMappings(
  filter?: string,
): Promise<ProjectMapping[]> {
  return bugTrackingApi.getProjectMappings(filter);
}

// --- Issues Export ---

export interface ExportIssuesOptions {
  configId: string;
  issueIds: string[];
  projectId: string;
  branchId?: string;
  externalProjectKey?: string;
  externalIssueTypeId?: string;
  externalTicketId?: string;
}

export function exportIssues(
  options: ExportIssuesOptions,
): Promise<IssueExportResult> {
  return bugTrackingApi.exportIssues(options);
}
```

### 3.4 New MCP Tools

#### `src/mcp/tools/get-bug-tracking-configurations.ts`

```typescript
import { z } from "zod";
import { getConfigurations } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z.string().optional().describe(
    "RSQL filter expression. Fields: id, tenantId, type, url, enabled, deploymentType. " +
      "Examples: type=='JIRA', enabled==true",
  ),
};

export const getBugTrackingConfigurationsTool: ToolDefinition<typeof schema> = {
  name: "get_bug_tracking_configurations",
  description: "List bug tracking integration configurations (Jira, Azure DevOps). " +
    "Shows configured connections to external issue tracking systems. Admin-only.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter }) => {
    const configs = await getConfigurations(filter);
    return jsonResponse(configs);
  },
};
```

#### `src/mcp/tools/get-external-projects.ts`

```typescript
import { z } from "zod";
import { getExternalProjects } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  filter: z.string().optional().describe(
    "RSQL filter by project name. Example: name=='MYPROJECT'",
  ),
};

export const getExternalProjectsTool: ToolDefinition<typeof schema> = {
  name: "get_external_projects",
  description: "List available projects in a configured Jira or Azure DevOps instance. " +
    "Use this to find the project key for creating project mappings or exporting issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ config_id, filter }) => {
    const projects = await getExternalProjects({ configId: config_id, filter });
    return jsonResponse(projects);
  },
};
```

#### `src/mcp/tools/export-issues.ts`

```typescript
import { z } from "zod";
import { exportIssues } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  config_id: z.string().describe("Bug tracking configuration ID"),
  issue_ids: z.array(z.string()).describe("Array of Polaris issue IDs to export"),
  project_id: z.string().describe("Polaris project ID the issues belong to"),
  branch_id: z.string().optional().describe("Polaris branch ID for scoping"),
  external_project_key: z.string().optional().describe(
    "External project key (overrides project mapping default)",
  ),
  external_issue_type_id: z.string().optional().describe(
    "Issue type ID in the external system",
  ),
  external_ticket_id: z.string().optional().describe(
    "Existing ticket ID to link to (instead of creating a new ticket). " +
      "Example: 'PROJ-123' for Jira",
  ),
};

export const exportIssuesTool: ToolDefinition<typeof schema> = {
  name: "export_issues",
  description:
    "Export Polaris security issues to Jira or Azure DevOps. Creates new tickets or links to " +
    "existing tickets. To create: provide issue_ids and project_id. To link to existing: also " +
    "provide external_ticket_id. Admin-only.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({
    config_id,
    issue_ids,
    project_id,
    branch_id,
    external_project_key,
    external_issue_type_id,
    external_ticket_id,
  }) => {
    const result = await exportIssues({
      configId: config_id,
      issueIds: issue_ids,
      projectId: project_id,
      branchId: branch_id,
      externalProjectKey: external_project_key,
      externalIssueTypeId: external_issue_type_id,
      externalTicketId: external_ticket_id,
    });
    return jsonResponse(result);
  },
};
```

### 3.5 Changes to `src/mcp/tools/index.ts`

Register the new bug tracking tools:

```typescript
// Add imports:
import { getBugTrackingConfigurationsTool } from "./get-bug-tracking-configurations.ts";
import { getExternalProjectsTool } from "./get-external-projects.ts";
import { exportIssuesTool } from "./export-issues.ts";

// Add to tools array:
export const tools: AnyToolDefinition[] = [
  // ... existing tools ...
  getBugTrackingConfigurationsTool,
  getExternalProjectsTool,
  exportIssuesTool,
];
```

### 3.6 Changes to `src/services/index.ts`

Add re-export for the new bug tracking service:

```typescript
export * from "./bug-tracking.ts";
```

### 3.7 Implementation Order

1. **Add types to `src/types/polaris.ts`** - Bug tracking interfaces and enums
2. **Create `src/api/bug-tracking.ts`** - All API layer functions
3. **Create `src/services/bug-tracking.ts`** - Service layer wrappers
4. **Update `src/services/index.ts`** - Re-export bug tracking service
5. **Create MCP tool files** - `get-bug-tracking-configurations.ts`, `get-external-projects.ts`,
   `export-issues.ts`
6. **Update `src/mcp/tools/index.ts`** - Register new tools
7. **Verify TypeScript compilation** - `deno task check`
8. **Test against live API** - Verify all endpoints work

### 3.8 Tools Prioritization

**Phase 1 (Essential - read operations):**

- `get_bug_tracking_configurations` - View configured integrations
- `get_external_projects` - Browse available external projects

**Phase 2 (High value - write operations):**

- `export_issues` - The primary value-add: exporting issues to Jira/Azure DevOps

**Phase 3 (Optional - admin configuration):**

- `create_bug_tracking_configuration` - Set up new integration
- `get_project_mappings` - View project mappings
- `create_project_mapping` - Link Polaris project to external project
- `test_bug_tracking_connection` - Verify connectivity
- `get_external_issue_types` - List available issue types

The Phase 3 tools are admin-only operations that are typically done once during initial setup via
the Polaris UI, so they are lower priority for an MCP tool implementation.

### 3.9 Key Differences from Other Polaris APIs

1. **Requires `Organization-Id` header** - Unlike other Polaris APIs that only need `Api-token`, bug
   tracking endpoints also require the `Organization-Id` header. The client may need to be updated
   to send this header for bug tracking requests.

2. **Admin-only access** - These APIs are restricted to organization administrators. Non-admin users
   will receive 403 errors.

3. **Write-heavy API** - Unlike the Portfolio and Findings APIs which are predominantly read-only,
   the Bug Tracking API is heavily write-oriented (creating configs, mappings, exporting issues).

4. **OAuth flow complexity** - Jira Server/Data Center integration requires a multi-step OAuth flow
   that involves the admin visiting an external URL. This is challenging to automate via an MCP tool
   and may be better left to the Polaris UI.

5. **External system dependency** - Many operations depend on the external system (Jira/Azure) being
   available and correctly configured. Connection testing is recommended before operations.

---

## Appendix: Source References

- [Bug Tracking Integration API Reference](https://polaris.blackduck.com/developer/default/documentation/bug-tracking-integration)
- [Issue Tracking Integrations Overview](https://polaris.blackduck.com/developer/default/documentation/tracking-integrations)
- [Issue Tracking Integration for Jira](https://polaris.blackduck.com/developer/default/documentation/tracking-jira)
- [Export Issues to Azure DevOps or Jira](https://polaris.blackduck.com/developer/default/documentation/tracking-export)
- [Polaris API Introduction](https://polaris.blackduck.com/developer/default/documentation/c_api-intro)
- [Polaris Release Notes](https://polaris.blackduck.com/developer/default/polaris-documentation/r_release-notes)
