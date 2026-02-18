# Portfolio API - Comprehensive Implementation Plan

## Section 1: API Spec Summary

### 1.1 Overview

- **OpenAPI Version:** 3.1.0
- **Title:** Portfolio
- **Authentication:** ApiKeyAuth (header: `Api-token`)
- **Base paths:**
  - `https://polaris.blackduck.com/api/portfolios` (current)
  - `https://polaris.blackduck.com/api/portfolio` (deprecated, sunset Tue 24 Mar 2026)
- **Pagination:** Offset-based (`_offset` / `_limit`)
- **Filtering:** RSQL syntax via `_filter` query parameter
- **Sorting:** `{field}|{asc|desc},{field}|{asc|desc},...` via `_sort` query parameter

### 1.2 Media Types

| Media Type                                               | Usage                                       |
| -------------------------------------------------------- | ------------------------------------------- |
| `application/vnd.polaris.portfolios-1+json`              | Portfolios (current)                        |
| `application/vnd.polaris.portfolios.applications-1+json` | Applications (current)                      |
| `application/vnd.polaris.portfolios.projects-1+json`     | Projects (current)                          |
| `application/vnd.polaris.portfolios.branches-1+json`     | Branches (current, inferred from codebase)  |
| `application/vnd.pm.portfolio-1+json`                    | Portfolios (deprecated)                     |
| `application/vnd.pm.portfolio-items-1+json`              | Portfolio Items / Applications (deprecated) |
| `application/vnd.pm.portfolio-items-2+json`              | Portfolio Items V2 (deprecated)             |
| `application/vnd.pm.portfolio-subitems-1+json`           | Portfolio Subitems / Projects (deprecated)  |
| `application/problem+json`                               | Error responses                             |

### 1.3 Endpoints

#### Portfolios

| Method | Path          | OperationId        | Media Type                      | Deprecated |
| ------ | ------------- | ------------------ | ------------------------------- | ---------- |
| GET    | `/`           | `getPortfoliosNew` | `vnd.polaris.portfolios-1+json` | No         |
| GET    | `/portfolios` | `getPortfolios`    | `vnd.pm.portfolio-1+json`       | Yes        |

**Parameters for GET `/`:** None (returns all portfolios for the org; typically one per org).

**Response:** `NewPortfoliosGetResponse` - paginated wrapper with `_items`, `_links`, `_collection`.

---

#### Applications

| Method | Path                               | OperationId          | Media Type                                   | Deprecated |
| ------ | ---------------------------------- | -------------------- | -------------------------------------------- | ---------- |
| POST   | `/{portfolioId}/applications`      | `createApplication`  | `vnd.polaris.portfolios.applications-1+json` | No         |
| GET    | `/{portfolioId}/applications`      | `getApplications`    | `vnd.polaris.portfolios.applications-1+json` | No         |
| GET    | `/{portfolioId}/applications/{id}` | `getApplicationById` | `vnd.polaris.portfolios.applications-1+json` | No         |
| PATCH  | `/{portfolioId}/applications/{id}` | `updateApplication`  | `vnd.polaris.portfolios.applications-1+json` | No         |
| DELETE | `/{portfolioId}/applications/{id}` | `deleteApplication`  | N/A (204)                                    | No         |

**GET `/{portfolioId}/applications` Parameters:**

| Name               | In    | Type    | Required | Default     | Description                   |
| ------------------ | ----- | ------- | -------- | ----------- | ----------------------------- |
| `portfolioId`      | path  | uuid    | yes      | -           | Portfolio ID                  |
| `name`             | query | string  | no       | -           | Filter by name                |
| `description`      | query | string  | no       | -           | Filter by description         |
| `_filter`          | query | string  | no       | -           | RSQL filter expression        |
| `_sort`            | query | string  | no       | `name\|asc` | Sort expression               |
| `_offset`          | query | int32   | no       | 0           | Pagination offset             |
| `_limit`           | query | int32   | no       | 100         | Page size                     |
| `_includeLabelIds` | query | boolean | no       | false       | Include label IDs in response |

**RSQL filterable fields for applications:** `id`, `name`, `labelId`, `description`

**Sortable fields for applications:** `id`, `name`, `description`

---

#### Projects

| Method | Path                                                               | OperationId           | Media Type                               | Deprecated |
| ------ | ------------------------------------------------------------------ | --------------------- | ---------------------------------------- | ---------- |
| GET    | `/{portfolioId}/projects`                                          | `getProjectsByFilter` | `vnd.polaris.portfolios.projects-1+json` | No         |
| POST   | `/{portfolioId}/applications/{applicationId}/projects`             | `createProject`       | `vnd.polaris.portfolios.projects-1+json` | No         |
| GET    | `/{portfolioId}/applications/{applicationId}/projects`             | `getProjects`         | `vnd.polaris.portfolios.projects-1+json` | No         |
| GET    | `/{portfolioId}/applications/{applicationId}/projects/{projectId}` | `getProjectById`      | `vnd.polaris.portfolios.projects-1+json` | No         |
| PATCH  | `/{portfolioId}/applications/{applicationId}/projects/{projectId}` | `updateProject`       | `vnd.polaris.portfolios.projects-1+json` | No         |

**GET `/{portfolioId}/projects` Parameters (org-wide project search):**

| Name          | In    | Type   | Required | Default     | Description            |
| ------------- | ----- | ------ | -------- | ----------- | ---------------------- |
| `portfolioId` | path  | uuid   | yes      | -           | Portfolio ID           |
| `_filter`     | query | string | no       | -           | RSQL filter expression |
| `_sort`       | query | string | no       | `name\|asc` | Sort expression        |
| `_offset`     | query | int32  | no       | 0           | Pagination offset      |
| `_limit`      | query | int32  | no       | 100         | Page size              |

**GET `/{portfolioId}/applications/{applicationId}/projects` Parameters:**

| Name               | In    | Type    | Required | Default     | Description                   |
| ------------------ | ----- | ------- | -------- | ----------- | ----------------------------- |
| `portfolioId`      | path  | uuid    | yes      | -           | Portfolio ID                  |
| `applicationId`    | path  | uuid    | yes      | -           | Application ID                |
| `name`             | query | string  | no       | -           | Filter by name                |
| `description`      | query | string  | no       | -           | Filter by description         |
| `_filter`          | query | string  | no       | -           | RSQL filter expression        |
| `_sort`            | query | string  | no       | `name\|asc` | Sort expression               |
| `_offset`          | query | int32   | no       | 0           | Pagination offset             |
| `_limit`           | query | int32   | no       | 100         | Page size                     |
| `_includeLabelIds` | query | boolean | no       | false       | Include label IDs in response |

**RSQL filterable fields for projects (org-wide):** `id`, `name`, `description`, `applicationId`,
`createdAt`, `updatedAt`

**RSQL filterable fields for projects (in application):** `id`, `name`, `projectType`, `labelId`

**Sortable fields for projects:** `id`, `name`, `projectType`, `description`

---

#### Branches

The spec defines a "Branches" tag with description: "Retrieves information about branches associated
with a portfolio subitem in an organization." The branch endpoints are truncated from the visible
spec, but the current codebase already uses a branch endpoint path. Based on the tag definition,
existing codebase usage, and the media type `application/vnd.polaris.portfolios.branches-1+json`,
the branches endpoint follows this pattern:

| Method | Path                                                                                   | OperationId (inferred) | Media Type                               |
| ------ | -------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------- |
| GET    | `/{portfolioId}/applications/{applicationId}/projects/{projectId}/branches`            | `getBranches`          | `vnd.polaris.portfolios.branches-1+json` |
| GET    | `/{portfolioId}/applications/{applicationId}/projects/{projectId}/branches/{branchId}` | `getBranchById`        | `vnd.polaris.portfolios.branches-1+json` |

**Expected parameters for GET branches (based on API patterns):**

| Name            | In    | Type   | Required | Default | Description            |
| --------------- | ----- | ------ | -------- | ------- | ---------------------- |
| `portfolioId`   | path  | uuid   | yes      | -       | Portfolio ID           |
| `applicationId` | path  | uuid   | yes      | -       | Application ID         |
| `projectId`     | path  | uuid   | yes      | -       | Project ID             |
| `_filter`       | query | string | no       | -       | RSQL filter expression |
| `_sort`         | query | string | no       | -       | Sort expression        |
| `_offset`       | query | int32  | no       | 0       | Pagination offset      |
| `_limit`        | query | int32  | no       | 100     | Page size              |

---

#### Deprecated Endpoints (Portfolio Items / Portfolio Subitems)

These are the legacy equivalents. They use `vnd.pm.*` media types and will be sunsetted on
2026-03-24. Our implementation should NOT use these.

| Method | Path                                        | OperationId                    | Deprecated |
| ------ | ------------------------------------------- | ------------------------------ | ---------- |
| POST   | `/portfolios/{id}/portfolio-items`          | `createPortfolioItem`          | Yes        |
| GET    | `/portfolios/{id}/portfolio-items`          | `getPortfolioItems`            | Yes        |
| PATCH  | `/portfolio-items/{id}`                     | `updatePortfolioItem`          | Yes        |
| GET    | `/portfolio-items/{id}`                     | `getPortfolioItemById`         | Yes        |
| DELETE | `/portfolio-items/{id}`                     | `deletePortfolioItem`          | Yes        |
| GET    | `/portfolio-sub-items`                      | `getPortfolioSubItemsByFilter` | Yes        |
| POST   | `/portfolio-items/{id}/portfolio-sub-items` | `createPortfolioSubItem`       | Yes        |
| GET    | `/portfolio-items/{id}/portfolio-sub-items` | `getPortfolioSubItems`         | Yes        |
| PATCH  | `/portfolio-sub-items/{id}`                 | `updatePortfolioSubItem`       | Yes        |
| GET    | `/portfolio-sub-items/{id}`                 | `getPortfolioSubItemById`      | Yes        |
| DELETE | `/portfolio-sub-items/{id}`                 | `deletePortfolioSubItem`       | Yes        |

---

### 1.4 Pagination

All collection endpoints use **offset-based pagination**.

**Query parameters:**

- `_offset` (int32, default: 0) - number of items to skip
- `_limit` (int32, default: 100) - max items per page

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

The `_links` array contains navigation links with `rel` values: `first`, `next`, `prev`, `last`,
`self`.

### 1.5 RSQL Filter Syntax

The `_filter` parameter uses RSQL syntax. Examples:

- `name=='my-app'` - exact match
- `name=like='%partial%'` - partial match
- `id=in=('uuid1','uuid2')` - in-set
- `labelId=in=('uuid1','uuid2')` - filter by label
- `applicationId=='uuid'` - filter projects by application

### 1.6 Schema / Model Definitions

#### Portfolio

The portfolio object returned from `GET /`. Each organization has a single portfolio.

| Field            | Type          | Required | Description                            |
| ---------------- | ------------- | -------- | -------------------------------------- |
| `id`             | string (uuid) | yes      | Unique identifier                      |
| `name`           | string        | yes      | Portfolio name                         |
| `organizationId` | string (uuid) | yes      | Organization this portfolio belongs to |
| `_links`         | LinkEntry[]   | yes      | HATEOAS links                          |

> **Note:** The full portfolio schema is not fully exposed in the spec's visible portion. The
> response primarily serves as a container to get the portfolio ID for navigating to
> applications/projects.

---

#### Application

Returned from application endpoints. Represents a grouping of related projects.

| Field                          | Type                           | Required | Description                                                    |
| ------------------------------ | ------------------------------ | -------- | -------------------------------------------------------------- |
| `id`                           | string (uuid)                  | yes      | Unique identifier                                              |
| `name`                         | string (1-255 chars)           | yes      | Application name                                               |
| `description`                  | string (max 2048 chars)        | no       | Description                                                    |
| `subscriptionTypeUsed`         | enum: `PARALLEL`, `CONCURRENT` | yes      | Subscription type                                              |
| `portfolioId`                  | string (uuid)                  | yes      | Parent portfolio ID                                            |
| `labelIds`                     | string[] (uuid[])              | no       | Associated label IDs (only present if `_includeLabelIds=true`) |
| `entitlements`                 | Entitlements                   | no       | Entitlement details                                            |
| `riskFactorMapping`            | Record<string, string>         | no       | Mapping of risk factor UUIDs to risk category UUIDs            |
| `inTrash`                      | boolean                        | no       | Soft-delete indicator                                          |
| `createdAt`                    | string (datetime)              | no       | Creation timestamp                                             |
| `updatedAt`                    | string (datetime)              | no       | Last update timestamp                                          |
| `autoDeleteSetting`            | boolean                        | no       | Auto-delete inactive branches                                  |
| `branchRetentionPeriodSetting` | integer (1-90)                 | no       | Days before auto-delete of inactive branches                   |
| `_links`                       | LinkEntry[]                    | yes      | HATEOAS links                                                  |

---

#### Entitlements

Nested object within Application.

| Field            | Type              | Required | Description              |
| ---------------- | ----------------- | -------- | ------------------------ |
| `entitlementIds` | string[] (uuid[]) | no       | Array of entitlement IDs |
| `quantity`       | integer           | no       | Entitlement quantity     |

---

#### Project (SAST/SCA Type)

Returned from project endpoints. Represents a codebase being scanned. The spec uses a discriminated
union (`anyOf`) for project types: SAST/SCA vs. various DAST types. The SAST/SCA type
(`PortfolioSubItemSastScaResponse`) is the primary type.

| Field                          | Type                    | Required | Description                                 |
| ------------------------------ | ----------------------- | -------- | ------------------------------------------- |
| `id`                           | string (uuid)           | yes      | Unique identifier                           |
| `name`                         | string                  | yes      | Project name                                |
| `description`                  | string                  | no       | Description                                 |
| `subItemType`                  | enum: `PROJECT`, `DAST` | yes      | Discriminator for project type              |
| `portfolioItemId`              | string (uuid)           | yes      | Parent application ID                       |
| `defaultBranch`                | DefaultBranch           | no       | Default branch details                      |
| `labelIds`                     | string[] (uuid[])       | no       | Associated label IDs                        |
| `inTrash`                      | boolean                 | no       | Soft-delete indicator                       |
| `createdAt`                    | string (datetime)       | no       | Creation timestamp                          |
| `updatedAt`                    | string (datetime)       | no       | Last update timestamp                       |
| `autoDeleteSetting`            | boolean                 | no       | Auto-delete inactive branches               |
| `branchRetentionPeriodSetting` | integer (1-90)          | no       | Branch retention period in days             |
| `autoDeleteSettingsCustomized` | boolean                 | no       | Whether auto-delete settings are customized |
| `_links`                       | LinkEntry[]             | yes      | HATEOAS links                               |

---

#### Project (DAST Type)

DAST projects have additional fields depending on their authentication mode. All DAST types include:

| Field                           | Type           | Required | Description                        |
| ------------------------------- | -------------- | -------- | ---------------------------------- |
| (all base project fields above) |                |          |                                    |
| `subItemType`                   | literal `DAST` | yes      | Always "DAST" for DAST projects    |
| `entryPointUrl`                 | string         | yes      | Target URL                         |
| `entryPointPrivate`             | boolean        | no       | Whether the entry point is private |
| `profile`                       | object         | no       | Scan profile configuration         |
| `proxy`                         | object         | no       | Proxy configuration                |

DAST authentication modes: `NONE`, `FORMS`, `SAML`, `SELENIUM`

---

#### DefaultBranch

Embedded in project responses.

| Field         | Type          | Required | Description                   |
| ------------- | ------------- | -------- | ----------------------------- |
| `id`          | string (uuid) | yes      | Branch ID                     |
| `name`        | string        | yes      | Branch name                   |
| `description` | string        | no       | Branch description            |
| `source`      | enum: `USER`  | no       | Origin indicator              |
| `isDefault`   | boolean       | yes      | Always true for defaultBranch |

---

#### Branch

Returned from branch endpoints. Represents a code branch within a project.

| Field         | Type          | Required | Description                        |
| ------------- | ------------- | -------- | ---------------------------------- |
| `id`          | string (uuid) | yes      | Unique identifier                  |
| `name`        | string        | yes      | Branch name                        |
| `description` | string        | no       | Branch description                 |
| `source`      | enum: `USER`  | no       | Origin indicator                   |
| `isDefault`   | boolean       | no       | Whether this is the default branch |
| `_links`      | LinkEntry[]   | yes      | HATEOAS links                      |

---

#### LinkEntry

Used across all responses.

| Field    | Type         | Required | Description                                           |
| -------- | ------------ | -------- | ----------------------------------------------------- |
| `href`   | string (url) | yes      | Link URL                                              |
| `rel`    | string       | yes      | Relationship: `self`, `first`, `next`, `prev`, `last` |
| `method` | string       | no       | HTTP method (e.g., `GET`)                             |

---

#### PaginatedCollection

The `_collection` metadata object.

| Field         | Type    | Required | Description                            |
| ------------- | ------- | -------- | -------------------------------------- |
| `itemCount`   | integer | yes      | Total number of items across all pages |
| `currentPage` | integer | yes      | Current page number (1-based)          |
| `pageCount`   | integer | yes      | Total number of pages                  |

---

### 1.7 Enums

| Enum Name        | Values                                  | Used In                             |
| ---------------- | --------------------------------------- | ----------------------------------- |
| SubscriptionType | `PARALLEL`, `CONCURRENT`                | Application.subscriptionTypeUsed    |
| SubItemType      | `PROJECT`, `DAST`                       | Project.subItemType                 |
| BranchSource     | `USER`                                  | Branch.source, DefaultBranch.source |
| DastAuthMode     | `NONE`, `FORMS`, `SAML`, `SELENIUM`     | DAST project authentication         |
| LinkRel          | `self`, `first`, `next`, `prev`, `last` | LinkEntry.rel                       |
| SortDirection    | `asc`, `desc`                           | _sort parameter                     |

---

## Section 2: Current Implementation Analysis

### 2.1 What We Have Now

#### Types (`src/types/polaris.ts`)

- `Portfolio`: `id`, `name`, `description?`, `_links`
- `Application`: `id`, `name`, `description?`, `_links`
- `Project`: `id`, `name`, `description?`, `type?`, `applicationId?`, `_links`
- `Branch`: `id`, `name`, `isDefault?`, `projectId?`, `_links`
- `LinkEntry`: `href`, `rel`, `method?`

#### API Layer (`src/api/portfolio.ts`)

- `getPortfolios()` - GET `/api/portfolios/` with `vnd.polaris.portfolios-1+json`
- `getApplications(portfolioId, filter?)` - GET `/{portfolioId}/applications` with RSQL filter
- `getApplication(portfolioId, applicationId)` - GET single application
- `getProjects(portfolioId, applicationId?, filter?)` - GET projects (org-wide or by application)
- `getProject(portfolioId, applicationId, projectId)` - GET single project
- `getBranches(portfolioId, applicationId, projectId)` - GET branches for project

#### Service Layer (`src/services/portfolio.ts`)

Thin passthrough wrappers around the API layer. Same signatures.

#### MCP Tools

- `get_portfolios` - No parameters
- `get_applications` - `portfolio_id`, `filter?`
- `get_projects` - `portfolio_id`, `application_id?`, `filter?`
- `get_branches` - `portfolio_id`, `application_id`, `project_id`

### 2.2 What's Correct

1. **API path structure** - The paths follow the correct pattern: `/{portfolioId}/applications`,
   `/{portfolioId}/applications/{applicationId}/projects`, etc.
2. **Media types** - The four `vnd.polaris.*` Accept headers are correct.
3. **Pagination** - Uses `getAllOffset` which correctly handles `_offset`/`_limit` pagination.
4. **RSQL filter** - The `_filter` parameter is correctly passed for applications and projects.
5. **Client architecture** - The three-layer pattern (API -> Service -> MCP Tool) is clean.
6. **GET single application and project** - Correct endpoint paths.

### 2.3 What's Wrong or Missing

#### Type Definitions - WRONG/INCOMPLETE

1. **`Portfolio` type** is missing `organizationId` field. It may also be missing other fields from
   the actual response.

2. **`Application` type** is severely incomplete. Missing:
   - `subscriptionTypeUsed` (enum)
   - `portfolioId`
   - `labelIds`
   - `entitlements` (nested object)
   - `riskFactorMapping`
   - `inTrash`
   - `createdAt`
   - `updatedAt`
   - `autoDeleteSetting`
   - `branchRetentionPeriodSetting`

3. **`Project` type** is severely incomplete. Has wrong field names:
   - `type` should be `subItemType` (enum: `PROJECT` | `DAST`)
   - `applicationId` should be `portfolioItemId`
   - Missing: `defaultBranch`, `labelIds`, `inTrash`, `createdAt`, `updatedAt`, `autoDeleteSetting`,
     `branchRetentionPeriodSetting`, `autoDeleteSettingsCustomized`

4. **`Branch` type** is incomplete:
   - Missing `description` field
   - Missing `source` field (enum: `USER`)
   - Has `projectId` which is NOT in the API response (it's implied by the path)

5. **No `DefaultBranch` type** - Needed for the `defaultBranch` nested object in project responses.

6. **No `Entitlements` type** - Needed for the `entitlements` field on Application.

#### API Layer - MISSING FEATURES

1. **`getApplications`** does not pass `_sort`, `name`, `description`, or `_includeLabelIds`
   parameters.

2. **`getProjects`** does not pass `_sort`, `name`, `description`, or `_includeLabelIds` parameters.

3. **`getBranches`** does not accept or pass `_filter` or `_sort` parameters.

4. **No `deleteApplication`** function.

5. **No `deleteProject`** function (the spec does not show a DELETE for the new project endpoint,
   but DELETE exists for the deprecated version).

6. **`getPortfolios`** path has trailing slash (`/api/portfolios/`) - the current endpoint is
   `GET /` (relative to base path `/api/portfolios`), so the path should be `/api/portfolios` or
   just `/api/portfolios/`. This likely works but is worth noting.

#### Service Layer - MISSING FEATURES

The service layer is a passthrough, so it inherits all the API layer gaps. It does not add `_sort`
or `_includeLabelIds` parameters.

#### MCP Tools - MISSING FEATURES

1. **`get_applications`** - Missing `_sort` parameter option. Missing `_includeLabelIds` toggle.

2. **`get_projects`** - Missing `_sort` parameter option.

3. **`get_branches`** - Missing `_filter` parameter option. Cannot filter branches by name.

4. **No `get_application` tool** (single application by ID).

5. **No `get_project` tool** (single project by ID).

---

## Section 3: Implementation Plan

### 3.1 Changes to `src/types/polaris.ts`

Replace the Portfolio section (lines 1-32) with these updated type definitions:

```typescript
// --- Portfolio ---

/**
 * Subscription type for an application.
 */
export type SubscriptionType = "PARALLEL" | "CONCURRENT";

/**
 * Discriminator for project type: standard SAST/SCA vs DAST.
 */
export type SubItemType = "PROJECT" | "DAST";

/**
 * Branch origin indicator.
 */
export type BranchSource = "USER";

/**
 * Portfolio - top-level container. Each organization has one portfolio.
 * Returned from GET /api/portfolios/
 */
export interface Portfolio {
  id: string;
  name: string;
  organizationId?: string;
  description?: string;
  _links: LinkEntry[];
}

/**
 * Entitlements nested within an Application.
 */
export interface Entitlements {
  entitlementIds?: string[];
  quantity?: number;
}

/**
 * Application - groups related projects together.
 * Returned from GET /{portfolioId}/applications
 */
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

/**
 * DefaultBranch - embedded in Project responses.
 */
export interface DefaultBranch {
  id: string;
  name: string;
  description?: string;
  source?: BranchSource;
  isDefault?: boolean;
}

/**
 * Project - represents a codebase being scanned.
 * Returned from GET /{portfolioId}/applications/{applicationId}/projects
 *
 * Note: The API uses a discriminated union (anyOf) for SAST/SCA vs DAST types.
 * For simplicity, we model the common superset here.
 */
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

/**
 * Branch - represents a code branch within a project.
 * Returned from GET /{portfolioId}/applications/{applicationId}/projects/{projectId}/branches
 */
export interface Branch {
  id: string;
  name: string;
  description?: string;
  source?: BranchSource;
  isDefault?: boolean;
  _links: LinkEntry[];
}
```

**Summary of changes:**

- Add `SubscriptionType`, `SubItemType`, `BranchSource` type aliases
- Add `organizationId` to `Portfolio`
- Add all missing fields to `Application`: `subscriptionTypeUsed`, `portfolioId`, `labelIds`,
  `entitlements`, `riskFactorMapping`, `inTrash`, `createdAt`, `updatedAt`, `autoDeleteSetting`,
  `branchRetentionPeriodSetting`
- Add new `Entitlements` interface
- Add new `DefaultBranch` interface
- Replace `Project.type` with `subItemType`, replace `applicationId` with `portfolioItemId`, add
  `defaultBranch`, `labelIds`, `inTrash`, `createdAt`, `updatedAt`, `autoDeleteSetting`,
  `branchRetentionPeriodSetting`, `autoDeleteSettingsCustomized`
- Add `description` and `source` to `Branch`, remove `projectId`

### 3.2 Changes to `src/api/portfolio.ts`

Replace the entire file with:

```typescript
import { getClient } from "./client.ts";
import type { Application, Branch, Portfolio, Project } from "../types/polaris.ts";

const ACCEPT = "application/vnd.polaris.portfolios-1+json";
const ACCEPT_APPS = "application/vnd.polaris.portfolios.applications-1+json";
const ACCEPT_PROJECTS = "application/vnd.polaris.portfolios.projects-1+json";
const ACCEPT_BRANCHES = "application/vnd.polaris.portfolios.branches-1+json";

// --- Portfolios ---

export function getPortfolios(): Promise<Portfolio[]> {
  const client = getClient();
  return client.getAllOffset<Portfolio>("/api/portfolios/", undefined, ACCEPT);
}

// --- Applications ---

export interface GetApplicationsParams {
  portfolioId: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getApplications(
  params: GetApplicationsParams,
): Promise<Application[]> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeLabelIds) queryParams._includeLabelIds = params.includeLabelIds;
  return client.getAllOffset<Application>(
    `/api/portfolios/${params.portfolioId}/applications`,
    queryParams,
    ACCEPT_APPS,
  );
}

export function getApplication(
  portfolioId: string,
  applicationId: string,
): Promise<Application> {
  const client = getClient();
  return client.get<Application>(
    `/api/portfolios/${portfolioId}/applications/${applicationId}`,
    undefined,
    ACCEPT_APPS,
  );
}

// --- Projects ---

export interface GetProjectsParams {
  portfolioId: string;
  applicationId?: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getProjects(
  params: GetProjectsParams,
): Promise<Project[]> {
  const client = getClient();
  const queryParams: Record<string, string | boolean | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  if (params.includeLabelIds) queryParams._includeLabelIds = params.includeLabelIds;

  const path = params.applicationId
    ? `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects`
    : `/api/portfolios/${params.portfolioId}/projects`;

  return client.getAllOffset<Project>(path, queryParams, ACCEPT_PROJECTS);
}

export function getProject(
  portfolioId: string,
  applicationId: string,
  projectId: string,
): Promise<Project> {
  const client = getClient();
  return client.get<Project>(
    `/api/portfolios/${portfolioId}/applications/${applicationId}/projects/${projectId}`,
    undefined,
    ACCEPT_PROJECTS,
  );
}

// --- Branches ---

export interface GetBranchesParams {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  filter?: string;
  sort?: string;
}

export function getBranches(
  params: GetBranchesParams,
): Promise<Branch[]> {
  const client = getClient();
  const queryParams: Record<string, string | undefined> = {};
  if (params.filter) queryParams._filter = params.filter;
  if (params.sort) queryParams._sort = params.sort;
  return client.getAllOffset<Branch>(
    `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/branches`,
    queryParams,
    ACCEPT_BRANCHES,
  );
}
```

**Summary of changes:**

- Convert `getApplications`, `getProjects`, `getBranches` to accept a params object instead of
  positional args
- Add `_sort` and `_includeLabelIds` support to `getApplications`
- Add `_sort` and `_includeLabelIds` support to `getProjects`
- Add `_filter` and `_sort` support to `getBranches`
- Export param interfaces (`GetApplicationsParams`, `GetProjectsParams`, `GetBranchesParams`) for
  use by the service layer

### 3.3 Changes to `src/services/portfolio.ts`

Replace the entire file with:

```typescript
import * as portfolioApi from "../api/portfolio.ts";
import type { Application, Branch, Portfolio, Project } from "../types/polaris.ts";

export function getPortfolios(): Promise<Portfolio[]> {
  return portfolioApi.getPortfolios();
}

export interface GetApplicationsOptions {
  portfolioId: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getApplications(
  options: GetApplicationsOptions,
): Promise<Application[]> {
  return portfolioApi.getApplications(options);
}

export function getApplication(
  portfolioId: string,
  applicationId: string,
): Promise<Application> {
  return portfolioApi.getApplication(portfolioId, applicationId);
}

export interface GetProjectsOptions {
  portfolioId: string;
  applicationId?: string;
  filter?: string;
  sort?: string;
  includeLabelIds?: boolean;
}

export function getProjects(
  options: GetProjectsOptions,
): Promise<Project[]> {
  return portfolioApi.getProjects(options);
}

export function getProject(
  portfolioId: string,
  applicationId: string,
  projectId: string,
): Promise<Project> {
  return portfolioApi.getProject(portfolioId, applicationId, projectId);
}

export interface GetBranchesOptions {
  portfolioId: string;
  applicationId: string;
  projectId: string;
  filter?: string;
  sort?: string;
}

export function getBranches(
  options: GetBranchesOptions,
): Promise<Branch[]> {
  return portfolioApi.getBranches(options);
}
```

**Summary of changes:**

- Convert `getApplications`, `getProjects`, `getBranches` to accept options objects
- Add `sort` and `includeLabelIds` options where applicable
- Add `filter` and `sort` options to `getBranches`
- Export options interfaces

### 3.4 Changes to `src/services/index.ts`

The existing file re-exports everything from `./portfolio.ts`, so the new option types will be
automatically exported. No changes needed unless we want explicit named exports. **No changes
required.**

### 3.5 Changes to MCP Tools

#### `src/mcp/tools/get-portfolios.ts` - NO CHANGES

The current implementation is correct. Portfolios have no filter/sort parameters in the API.

#### `src/mcp/tools/get-applications.ts` - UPDATE

```typescript
import { z } from "zod";
import { getApplications } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  filter: z.string().optional().describe(
    "RSQL filter expression. Filterable fields: id, name, labelId, description. Examples: name=='my-app', name=like='%partial%'",
  ),
  sort: z.string().optional().describe(
    "Sort expression. Format: field|direction. Sortable fields: id, name, description. Example: name|asc",
  ),
  include_label_ids: z.boolean().optional().describe(
    "Include labelIds in response (default: false)",
  ),
};

export const getApplicationsTool: ToolDefinition<typeof schema> = {
  name: "get_applications",
  description: "List applications in a portfolio. Applications group related projects together.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, filter, sort, include_label_ids }) => {
    const apps = await getApplications({
      portfolioId: portfolio_id,
      filter,
      sort,
      includeLabelIds: include_label_ids,
    });
    return jsonResponse(apps);
  },
};
```

**Changes:** Add `sort` and `include_label_ids` parameters. Change to pass options object. Add
filterable/sortable field documentation in parameter descriptions.

#### `src/mcp/tools/get-projects.ts` - UPDATE

```typescript
import { z } from "zod";
import { getProjects } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().optional().describe(
    "Application ID to filter projects (omit to list all projects org-wide)",
  ),
  filter: z.string().optional().describe(
    "RSQL filter expression. Org-wide filterable fields: id, name, description, applicationId, createdAt, updatedAt. In-application filterable fields: id, name, projectType, labelId. Examples: name=='my-project', applicationId=='uuid'",
  ),
  sort: z.string().optional().describe(
    "Sort expression. Format: field|direction. Sortable fields: id, name, projectType, description. Example: name|asc",
  ),
};

export const getProjectsTool: ToolDefinition<typeof schema> = {
  name: "get_projects",
  description:
    "List projects in a portfolio, optionally filtered by application. Projects represent codebases that are scanned for vulnerabilities.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, filter, sort }) => {
    const projects = await getProjects({
      portfolioId: portfolio_id,
      applicationId: application_id,
      filter,
      sort,
    });
    return jsonResponse(projects);
  },
};
```

**Changes:** Add `sort` parameter. Change to pass options object. Add documentation about
filterable/sortable fields per endpoint variant. Note: `_includeLabelIds` omitted from the tool
since it adds noise; can be added if needed.

#### `src/mcp/tools/get-branches.ts` - UPDATE

```typescript
import { z } from "zod";
import { getBranches } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  filter: z.string().optional().describe(
    "RSQL filter expression for branches. Example: name=='main'",
  ),
};

export const getBranchesTool: ToolDefinition<typeof schema> = {
  name: "get_branches",
  description: "List branches for a project. Each branch can have its own scan results and issues.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, filter }) => {
    const branches = await getBranches({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      filter,
    });
    return jsonResponse(branches);
  },
};
```

**Changes:** Add `filter` parameter. Change to pass options object.

### 3.6 New Tools to Consider

Based on the API spec, the following additional MCP tools could be added. These are **optional** and
can be deferred:

#### `get_application` - Get a single application by ID

This tool would be useful when the caller already has an application ID and needs its details
without listing all applications.

```typescript
// src/mcp/tools/get-application.ts
import { z } from "zod";
import { getApplication } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
};

export const getApplicationTool: ToolDefinition<typeof schema> = {
  name: "get_application",
  description:
    "Get a single application by ID. Returns full application details including entitlements and settings.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id }) => {
    const app = await getApplication(portfolio_id, application_id);
    return jsonResponse(app);
  },
};
```

#### `get_project` - Get a single project by ID

```typescript
// src/mcp/tools/get-project.ts
import { z } from "zod";
import { getProject } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
};

export const getProjectTool: ToolDefinition<typeof schema> = {
  name: "get_project",
  description:
    "Get a single project by ID. Returns full project details including default branch, settings, and labels.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id }) => {
    const project = await getProject(portfolio_id, application_id, project_id);
    return jsonResponse(project);
  },
};
```

If these new tools are added, `src/mcp/tools/index.ts` must be updated to import and register them:

```typescript
import type { AnyToolDefinition } from "../types.ts";
import { getPortfoliosTool } from "./get-portfolios.ts";
import { getApplicationsTool } from "./get-applications.ts";
import { getApplicationTool } from "./get-application.ts"; // NEW
import { getProjectsTool } from "./get-projects.ts";
import { getProjectTool } from "./get-project.ts"; // NEW
import { getBranchesTool } from "./get-branches.ts";
import { getIssuesTool } from "./get-issues.ts";
import { getOccurrencesTool } from "./get-occurrences.ts";
import { getCodeSnippetTool } from "./get-code-snippet.ts";
import { getRemediationAssistTool } from "./get-remediation-assist.ts";
import { getTestsTool } from "./get-tests.ts";
import { getTestMetricsTool } from "./get-test-metrics.ts";

export const tools: AnyToolDefinition[] = [
  getPortfoliosTool,
  getApplicationsTool,
  getApplicationTool, // NEW
  getProjectsTool,
  getProjectTool, // NEW
  getBranchesTool,
  getIssuesTool,
  getOccurrencesTool,
  getCodeSnippetTool,
  getRemediationAssistTool,
  getTestsTool,
  getTestMetricsTool,
];
```

### 3.7 Impact on Callers

The signature changes to `getApplications`, `getProjects`, and `getBranches` (from positional args
to options objects) will require updating any other callers. Based on the codebase, the only callers
are:

1. `src/services/portfolio.ts` -> calls `src/api/portfolio.ts` functions (updated above)
2. MCP tool handlers -> call `src/services/portfolio.ts` functions (updated above)

There are no other callers of these functions in the codebase, so the changes are self-contained.

### 3.8 Implementation Order

1. **Update `src/types/polaris.ts`** - Add all new types and fix existing ones
2. **Update `src/api/portfolio.ts`** - Change signatures to params objects, add new query params
3. **Update `src/services/portfolio.ts`** - Change signatures to match API layer
4. **Update MCP tool files** - Update handlers to pass options objects, add new schema params
5. **(Optional) Add new tool files** - `get-application.ts`, `get-project.ts`
6. **(Optional) Update `src/mcp/tools/index.ts`** - Register new tools
7. **Test** - Verify all tools work correctly against the live API
