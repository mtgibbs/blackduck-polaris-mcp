# Policies API - Comprehensive Implementation Plan

## Section 1: API Spec Summary

### 1.1 Overview

- **OpenAPI Version:** 3.0.3
- **Title:** Policies
- **Authentication:** ApiKeyAuth (header: `Api-token`)
- **Base paths:**
  - `https://polaris.blackduck.com/api/policies` (current)
  - `https://polaris.blackduck.com/api/risk/policies` (deprecated, sunset Tue 24 Mar 2026)
- **Pagination:** Offset-based (`_offset` / `_limit`)
- **Filtering:** RSQL syntax via `_filter` query parameter
- **Sorting:** `{field}|{asc|desc}` via `_sort` query parameter

### 1.2 Media Types

| Media Type                                                       | Usage                                   |
| ---------------------------------------------------------------- | --------------------------------------- |
| `application/vnd.polaris.policies.issue-policy-1+json`           | Issue Policies (current)                |
| `application/vnd.polaris.policy.issue-policy-1+json`             | Issue Policies (legacy alias)           |
| `application/vnd.polaris.policies.pr-policies-1+json`            | PR Policies (current)                   |
| `application/vnd.polaris.policies.test-scheduling-policy-1+json` | Test Scheduling Policies (current)      |
| `application/vnd.polaris.policy.test-scheduling-policy-1+json`   | Test Scheduling Policies (legacy alias) |
| `application/vnd.polaris.policies.action-1+json`                 | Policy Actions (current)                |
| `application/vnd.polaris.policy.action-1+json`                   | Policy Actions (legacy alias)           |
| `application/vnd.polaris.policies.policy-assignments-1+json`     | Policy Assignments (current)            |
| `application/vnd.polaris.policy.policy-assignments-1+json`       | Policy Assignments (legacy alias)       |
| `application/vnd.polaris.policies.policy-bulk-assignment-2+json` | Bulk Assignments V2 (current)           |
| `application/vnd.polaris.policy.policy-bulk-assignment-2+json`   | Bulk Assignments V2 (legacy alias)      |
| `application/json`                                               | Generic fallback (all endpoints)        |
| `application/problem+json`                                       | Error responses                         |

### 1.3 API Tags / Categories

The OpenAPI spec defines these tag groups:

| Tag                            | Description                                           |
| ------------------------------ | ----------------------------------------------------- |
| Policy Actions                 | Retrieve supported policy actions and their details   |
| Issue Policies                 | Create, read, update, delete issue policies           |
| Component Policies             | Manage component policies (SCA-focused)               |
| PR Policies                    | Create, read, update, delete pull request policies    |
| Policy Assignments             | Assign/unassign policies to projects (V1, deprecated) |
| Policy Assignments V2          | Bulk assign/unassign policies to projects (current)   |
| Policy Settings                | Manage organization default policy settings           |
| Test Scheduling Policies       | Create, read, update test scheduling policies         |
| Portfolio Policy Configuration | Manage portfolio-level policy configuration           |
| Issue Policy Execution         | Execute/trigger issue policies                        |
| Issue Policy Evaluation        | Evaluate issue policies against findings              |
| Policy Evaluations             | General policy evaluation endpoints                   |
| Policy Violations              | Track and manage policy violations                    |
| Active Violation Counts        | Retrieve active violation count summaries             |

> **Note:** The full OpenAPI spec is truncated in the developer portal. Endpoints for Component
> Policies, Portfolio Policy Configuration, Issue Policy Execution, Issue Policy Evaluation, Policy
> Evaluations, Policy Violations, and Active Violation Counts are defined as tags but their endpoint
> paths are not fully visible in the public documentation. The endpoints documented below are the
> ones confirmed from the visible specification.

---

### 1.4 Endpoints

#### Policy Actions (Read-Only)

| Method | Path                         | OperationId     | Deprecated Path                   |
| ------ | ---------------------------- | --------------- | --------------------------------- |
| GET    | `/api/policies/actions`      | `getActions`    | `/api/risk/policies/actions`      |
| GET    | `/api/policies/actions/{id}` | `getActionById` | `/api/risk/policies/actions/{id}` |

**GET `/api/policies/actions` Parameters:**

| Name      | In    | Type   | Required | Default | Description                                                     |
| --------- | ----- | ------ | -------- | ------- | --------------------------------------------------------------- |
| `_filter` | query | string | no       | -       | RSQL filter by `policyUseCase` (issue_policy, component_policy) |
| `_offset` | query | int    | no       | 0       | Pagination offset                                               |
| `_limit`  | query | int    | no       | 100     | Page size (max 100)                                             |

**Supported Actions:**

- `SEND_EMAIL` - Send email notification to Organization Admins
- `BREAK_THE_BUILD` - Attempt to break the build (requires Bridge CLI Bundle 3.2.0+ or Thin Client
  3.0.16+)
- `CREATE_BUNDLE_JIRA_TICKET` - Create a Jira ticket
- `BLOCK_PR` - Block a pull request (PR Policies only)

---

#### Issue Policies (Full CRUD)

| Method | Path                                | OperationId             | Deprecated Path                        |
| ------ | ----------------------------------- | ----------------------- | -------------------------------------- |
| POST   | `/api/policies/issue-policies`      | `createIssuePolicy`     | `/api/risk/policies/issue-policy`      |
| GET    | `/api/policies/issue-policies`      | `getIssuePolicies`      | `/api/risk/policies/issue-policy`      |
| GET    | `/api/policies/issue-policies/{id}` | `getIssuePolicyById`    | `/api/risk/policies/issue-policy/{id}` |
| PUT    | `/api/policies/issue-policies/{id}` | `updateIssuePolicyById` | `/api/risk/policies/issue-policy/{id}` |
| DELETE | `/api/policies/issue-policies/{id}` | `deleteIssuePolicyById` | `/api/risk/policies/issue-policy/{id}` |

**GET `/api/policies/issue-policies` Parameters:**

| Name            | In    | Type   | Required | Default     | Description                                    |
| --------------- | ----- | ------ | -------- | ----------- | ---------------------------------------------- |
| `_filter`       | query | string | no       | -           | RSQL filter expression (e.g., `name=='...'`)   |
| `_sort`         | query | string | no       | `name\|asc` | Sort expression                                |
| `_offset`       | query | int    | no       | 0           | Pagination offset                              |
| `_limit`        | query | int    | no       | 100         | Page size                                      |
| `associationId` | query | string | no       | -           | Filter by associated entity (e.g., Project ID) |

**POST/PUT Request Body (`IssuePolicyPolicyPayload`):**

```json
{
  "name": "Critical and High Severity Issues Policy",
  "description": "Send notification for critical/high severity issues",
  "filterGroups": {
    "rules": [
      {
        "ruleNumber": 1,
        "filter": {
          "powerFilterQuery": "context:tool-type=in=('sast','sca','dast');issueProperties:severity=in=('critical','high')"
        },
        "actions": [
          {
            "name": "SEND_EMAIL",
            "disabled": false
          },
          {
            "name": "BREAK_THE_BUILD",
            "disabled": false
          }
        ],
        "fixByRule": [
          {
            "query": "issueProperties:severity==critical",
            "days": 7,
            "disabled": false
          },
          {
            "query": "issueProperties:severity==high",
            "days": 30,
            "disabled": false
          }
        ]
      }
    ]
  }
}
```

**Constraints:**

- Maximum 5 rules per issue policy
- Maximum 5 fixByRule entries per rule
- Default issue policy cannot be deleted
- Policy name: up to 255 characters
- Policy description: up to 512 characters

**Response:** `IssuePoliciesResponse` (201 for POST, 200 for PUT)

**DELETE Response:** 204 No Content

---

#### PR Policies (Full CRUD)

| Method | Path                             | OperationId          |
| ------ | -------------------------------- | -------------------- |
| POST   | `/api/policies/pr-policies`      | `createPrPolicy`     |
| GET    | `/api/policies/pr-policies`      | `getPrPolicies`      |
| GET    | `/api/policies/pr-policies/{id}` | `getPrPolicyById`    |
| PUT    | `/api/policies/pr-policies/{id}` | `updatePrPolicyById` |
| DELETE | `/api/policies/pr-policies/{id}` | `deletePrPolicyById` |

> **Note:** PR Policies do NOT have deprecated `/api/risk/` equivalents. They are a newer addition.

**GET `/api/policies/pr-policies` Parameters:**

| Name            | In    | Type   | Required | Default     | Description                                    |
| --------------- | ----- | ------ | -------- | ----------- | ---------------------------------------------- |
| `_filter`       | query | string | no       | -           | RSQL filter expression                         |
| `_sort`         | query | string | no       | `name\|asc` | Sort expression                                |
| `_offset`       | query | int    | no       | 0           | Pagination offset                              |
| `_limit`        | query | int    | no       | 100         | Page size                                      |
| `associationId` | query | string | no       | -           | Filter by associated entity (e.g., Project ID) |

**POST/PUT Request Body (`PrPolicyPolicyPayload`):**

```json
{
  "name": "Block Critical PR Issues",
  "description": "Block pull requests with critical/high severity findings",
  "rules": [
    {
      "criteriaQuery": "context:tool-type=in=('sast','sca','dast');issueProperties:severity=in=('critical','high')",
      "actions": [
        {
          "name": "BLOCK_PR",
          "disabled": false
        }
      ]
    }
  ]
}
```

**Constraints:**

- Maximum 5 rules per PR policy
- Policy name: up to 255 characters
- Policy description: up to 512 characters

**Response:** `PrPolicyResponse` (201 for POST, 200 for PUT)

**DELETE Response:** 204 No Content

---

#### Test Scheduling Policies (CRUD)

| Method | Path                                          | OperationId                      | Deprecated Path                                 |
| ------ | --------------------------------------------- | -------------------------------- | ----------------------------------------------- |
| POST   | `/api/policies/test-scheduling-policies`      | `createTestSchedulingPolicy`     | `/api/risk/policies/test-frequency-policy`      |
| GET    | `/api/policies/test-scheduling-policies`      | `getTestSchedulingPolicies`      | `/api/risk/policies/test-frequency-policy`      |
| GET    | `/api/policies/test-scheduling-policies/{id}` | `getTestSchedulingPolicyById`    | `/api/risk/policies/test-frequency-policy/{id}` |
| PUT    | `/api/policies/test-scheduling-policies/{id}` | `updateTestSchedulingPolicyById` | `/api/risk/policies/test-frequency-policy/{id}` |

> **Note:** No DELETE endpoint was found for test scheduling policies in the visible spec. The
> system provides a default "Test Weekly" policy. Multi-policy support is not available for test
> scheduling policies.

**GET `/api/policies/test-scheduling-policies` Parameters:**

| Name            | In    | Type   | Required | Default     | Description                                    |
| --------------- | ----- | ------ | -------- | ----------- | ---------------------------------------------- |
| `_filter`       | query | string | no       | -           | RSQL filter expression                         |
| `_sort`         | query | string | no       | `name\|asc` | Sort expression                                |
| `_offset`       | query | int    | no       | 0           | Pagination offset                              |
| `_limit`        | query | int    | no       | 100         | Page size                                      |
| `associationId` | query | string | no       | -           | Filter by associated entity (e.g., Project ID) |

**POST/PUT Request Body (`TestFrequencyPolicyPayload`):**

```json
{
  "name": "Test Daily",
  "description": "Run security tests daily on active projects",
  "scheduleGroups": {
    "rules": [
      {
        "ruleNumber": 1,
        "frequency": "daily"
      }
    ]
  }
}
```

**Frequency Values:**

- `daily` - Test automatically registered within 24 hours after previous test completion
- `weekly` - Test automatically registered within one week after previous test completion

**Constraints:**

- Multi-policy support is not available (one test scheduling policy per project/branch)
- System default: "Test Weekly"

**Response:** `TestSchedulingPolicyResponse` (201 for POST, 200 for PUT)

---

#### Policy Assignments V2 (Current)

| Method | Path                           | OperationId         |
| ------ | ------------------------------ | ------------------- |
| POST   | `/api/policies/assignments`    | `addAssignments`    |
| DELETE | `/api/policies/assignments`    | `deleteAssignments` |
| GET    | `/api/policies/assignments`    | `getAssignments`    |
| GET    | `/api/policies/assignments/id` | `getAssignmentById` |

**POST/DELETE `/api/policies/assignments` Request Body (`BulkAssignmentsPayload`):**

```json
{
  "assignments": [
    {
      "type": "project",
      "associationId": "079d85b4-d2dc-49ba-96c4-8765bf3965df",
      "policyId": "021e4bdf-17e5-4294-97c9-c6fe3223da81"
    }
  ]
}
```

**POST Response:** 204 No Content **DELETE Response:** 204 No Content

**GET `/api/policies/assignments` Parameters:**

| Name      | In    | Type   | Required | Default | Description                                               |
| --------- | ----- | ------ | -------- | ------- | --------------------------------------------------------- |
| `_filter` | query | string | **yes**  | -       | RSQL filter (required). Example: `policyId==7520cf4e-...` |
| `_offset` | query | int    | no       | 0       | Pagination offset                                         |
| `_limit`  | query | int    | no       | 100     | Page size                                                 |

**GET `/api/policies/assignments/id` Parameters:**

| Name           | In    | Type   | Required | Default | Description     |
| -------------- | ----- | ------ | -------- | ------- | --------------- |
| `assignmentId` | query | string | **yes**  | -       | Assignment UUID |

**Assignment Limits:**

- Up to 5 issue policies per project/branch
- Up to 1 test scheduling policy per project/branch

---

#### Policy Assignments V1 (Deprecated)

| Method | Path                                             | OperationId              |
| ------ | ------------------------------------------------ | ------------------------ |
| POST   | `/api/risk/policies/{policyId}/assignments`      | `createAssignment`       |
| GET    | `/api/risk/policies/{policyId}/assignments`      | `getAssignments` (V1)    |
| GET    | `/api/risk/policies/{policyId}/assignments/{id}` | `getAssignmentById` (V1) |
| DELETE | `/api/risk/policies/{policyId}/assignments/{id}` | `deleteAssignment` (V1)  |
| POST   | `/api/risk/policies/{policyId}/bulk-assign`      | `bulkAssign`             |
| POST   | `/api/risk/policies/{policyId}/bulk-unassign`    | `bulkUnassign`           |

> All V1 assignment endpoints are deprecated and will sunset on 2026-03-24.

---

#### Policy Settings

| Method | Path                            | OperationId         | Deprecated Path                         |
| ------ | ------------------------------- | ------------------- | --------------------------------------- |
| POST   | `/api/policies/policy-settings` | `setPolicySettings` | `/api/risk/policies/{policyId}/default` |

**Request Body (`PolicySettingsPayload`):**

```json
{
  "policyId": "021e4bdf-17e5-4294-97c9-c6fe3223da81",
  "defaultPolicyStatus": true
}
```

**Response:** 204 No Content

**Notes:**

- Sets a policy as the organization default
- New default policy will NOT be reassigned to existing projects
- System provides default policies: "Critical, High Severity notify" (issue) and "Test Weekly"
  (scheduling)

---

### 1.5 Request Body Schemas (Write Operations Detail)

#### IssuePolicyPolicyPayload

| Field                                          | Type    | Required | Description                                 |
| ---------------------------------------------- | ------- | -------- | ------------------------------------------- |
| `name`                                         | string  | yes      | Policy name (max 255 chars)                 |
| `description`                                  | string  | no       | Policy description (max 512 chars)          |
| `filterGroups`                                 | object  | yes      | Container for rules                         |
| `filterGroups.rules`                           | array   | yes      | Array of rule objects (max 5)               |
| `filterGroups.rules[].ruleNumber`              | integer | yes      | Rule sequence number (1-based)              |
| `filterGroups.rules[].filter`                  | object  | yes      | Filter definition                           |
| `filterGroups.rules[].filter.powerFilterQuery` | string  | yes      | RSQL query for matching issues              |
| `filterGroups.rules[].actions`                 | array   | yes      | Actions to execute when rule matches        |
| `filterGroups.rules[].actions[].name`          | string  | yes      | Action identifier (enum, see below)         |
| `filterGroups.rules[].actions[].disabled`      | boolean | no       | Whether action is disabled (default: false) |
| `filterGroups.rules[].fixByRule`               | array   | no       | Fix-by date rules (max 5)                   |
| `filterGroups.rules[].fixByRule[].query`       | string  | yes      | RSQL query for severity filter              |
| `filterGroups.rules[].fixByRule[].days`        | integer | yes      | Days allowed to fix                         |
| `filterGroups.rules[].fixByRule[].disabled`    | boolean | no       | Whether fix-by rule is disabled             |

**Issue Policy Action Enum:** `SEND_EMAIL`, `BREAK_THE_BUILD`, `CREATE_BUNDLE_JIRA_TICKET`

**powerFilterQuery Fields (Issue Policies):**

- `context:tool-type` - values: `sast`, `sca`, `dast`
- `issueProperties:severity` - values: `critical`, `high`, `medium`, `low`
- Uses RSQL operators: `==`, `=in=()`, `;` (AND)
- Example: `context:tool-type=in=('sast','sca');issueProperties:severity=in=('critical','high')`

**fixByRule Query Fields:**

- `issueProperties:severity` - target severity for fix-by deadline
- Example: `issueProperties:severity==critical`

---

#### PrPolicyPolicyPayload

| Field                        | Type    | Required | Description                                 |
| ---------------------------- | ------- | -------- | ------------------------------------------- |
| `name`                       | string  | yes      | Policy name (max 255 chars)                 |
| `description`                | string  | no       | Policy description (max 512 chars)          |
| `rules`                      | array   | yes      | Array of rule objects (max 5)               |
| `rules[].criteriaQuery`      | string  | yes      | RSQL query for matching PR findings         |
| `rules[].actions`            | array   | yes      | Actions to execute when rule matches        |
| `rules[].actions[].name`     | string  | yes      | Action identifier (only `BLOCK_PR`)         |
| `rules[].actions[].disabled` | boolean | no       | Whether action is disabled (default: false) |

**PR Policy Action Enum:** `BLOCK_PR`

**criteriaQuery Fields (PR Policies):**

- Same as issue policy `powerFilterQuery` fields
- `context:tool-type` - values: `sast`, `sca`, `dast`
- `issueProperties:severity` - values: `critical`, `high`, `medium`, `low`

---

#### TestFrequencyPolicyPayload

| Field                               | Type    | Required | Description                         |
| ----------------------------------- | ------- | -------- | ----------------------------------- |
| `name`                              | string  | yes      | Policy name                         |
| `description`                       | string  | no       | Policy description                  |
| `scheduleGroups`                    | object  | yes      | Container for scheduling rules      |
| `scheduleGroups.rules`              | array   | yes      | Array of schedule rule objects      |
| `scheduleGroups.rules[].ruleNumber` | integer | yes      | Rule sequence number (1-based)      |
| `scheduleGroups.rules[].frequency`  | string  | yes      | Frequency enum: `daily` or `weekly` |

---

#### BulkAssignmentsPayload (V2)

| Field                         | Type   | Required | Description                        |
| ----------------------------- | ------ | -------- | ---------------------------------- |
| `assignments`                 | array  | yes      | Array of assignment objects        |
| `assignments[].type`          | string | yes      | Entity type (e.g., `project`)      |
| `assignments[].associationId` | string | yes      | UUID of the entity (e.g., Project) |
| `assignments[].policyId`      | string | yes      | UUID of the policy                 |

---

#### PolicySettingsPayload

| Field                 | Type    | Required | Description                             |
| --------------------- | ------- | -------- | --------------------------------------- |
| `policyId`            | string  | yes      | UUID of the policy to configure         |
| `defaultPolicyStatus` | boolean | yes      | Whether to mark as organization default |

---

### 1.6 Response Schemas

#### Issue Policy Response (`IssuePoliciesResponse`)

Based on the API patterns, the response contains the payload fields plus server-generated metadata:

| Field          | Type              | Description                                     |
| -------------- | ----------------- | ----------------------------------------------- |
| `id`           | string (uuid)     | Policy unique identifier                        |
| `name`         | string            | Policy name                                     |
| `description`  | string            | Policy description                              |
| `filterGroups` | object            | Same structure as in the request payload        |
| `isDefault`    | boolean           | Whether this is the organization default policy |
| `createdAt`    | string (datetime) | Creation timestamp                              |
| `updatedAt`    | string (datetime) | Last update timestamp                           |
| `_links`       | LinkEntry[]       | HATEOAS links                                   |

#### PR Policy Response (`PrPolicyResponse`)

| Field         | Type              | Description                      |
| ------------- | ----------------- | -------------------------------- |
| `id`          | string (uuid)     | Policy unique identifier         |
| `name`        | string            | Policy name                      |
| `description` | string            | Policy description               |
| `rules`       | array             | Same structure as in the request |
| `createdAt`   | string (datetime) | Creation timestamp               |
| `updatedAt`   | string (datetime) | Last update timestamp            |
| `_links`      | LinkEntry[]       | HATEOAS links                    |

#### Test Scheduling Policy Response (`TestSchedulingPolicyResponse`)

| Field            | Type              | Description                              |
| ---------------- | ----------------- | ---------------------------------------- |
| `id`             | string (uuid)     | Policy unique identifier                 |
| `name`           | string            | Policy name                              |
| `description`    | string            | Policy description                       |
| `scheduleGroups` | object            | Same structure as in the request         |
| `isDefault`      | boolean           | Whether this is the organization default |
| `createdAt`      | string (datetime) | Creation timestamp                       |
| `updatedAt`      | string (datetime) | Last update timestamp                    |
| `_links`         | LinkEntry[]       | HATEOAS links                            |

#### Policy Assignment Response

| Field           | Type          | Description                   |
| --------------- | ------------- | ----------------------------- |
| `id`            | string (uuid) | Assignment unique identifier  |
| `type`          | string        | Entity type (e.g., `project`) |
| `associationId` | string (uuid) | UUID of the associated entity |
| `policyId`      | string (uuid) | UUID of the assigned policy   |
| `_links`        | LinkEntry[]   | HATEOAS links                 |

#### Policy Action Response

| Field           | Type          | Description                                    |
| --------------- | ------------- | ---------------------------------------------- |
| `id`            | string (uuid) | Action unique identifier                       |
| `name`          | string        | Action identifier (e.g., `SEND_EMAIL`)         |
| `description`   | string        | Human-readable description                     |
| `policyUseCase` | string        | Use case: `issue_policy` or `component_policy` |
| `_links`        | LinkEntry[]   | HATEOAS links                                  |

---

### 1.7 Pagination

All collection endpoints use **offset-based pagination**.

**Query parameters:**

- `_offset` (int, default: 0) - Number of items to skip
- `_limit` (int, default: 100, max: 100) - Max items per page

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

### 1.8 RSQL Filter Fields

#### For List Endpoints (`_filter` parameter)

Issue Policies, PR Policies, and Test Scheduling Policies all support:

- `name` - Filter by policy name (e.g., `name=='My Policy'`)

#### For powerFilterQuery / criteriaQuery (Inside Policy Rules)

**Tool type:**

- `context:tool-type` - values: `sast`, `sca`, `dast`

**Issue properties:**

- `issueProperties:severity` - values: `critical`, `high`, `medium`, `low`

**Component properties (Component Policies):**

- SBOM status (included/excluded)
- License family: `Permissive`, `Reciprocal`, `AGPL`, `Restricted Third Party Proprietary`,
  `Unknown`, `Weak Reciprocal`
- Dependency type: direct, transitive
- Security risk: `critical`, `high`, `medium`, `low`
- Specific license (by name)
- Component name (exact match, 100 char limit)
- Match score (numerical ranges)

#### For Policy Assignments

- `policyId` - Filter by policy UUID (e.g., `policyId==7520cf4e-...`)

---

### 1.9 Component Policies

Component policies automate actions when components with specific properties are detected during SCA
tests. While the full CRUD endpoints are not visible in the truncated OpenAPI spec, based on the API
patterns and documentation they likely follow the same pattern:

| Method | Path (inferred)                         | Description                |
| ------ | --------------------------------------- | -------------------------- |
| POST   | `/api/policies/component-policies`      | Create component policy    |
| GET    | `/api/policies/component-policies`      | List component policies    |
| GET    | `/api/policies/component-policies/{id}` | Get component policy by ID |
| PUT    | `/api/policies/component-policies/{id}` | Update component policy    |
| DELETE | `/api/policies/component-policies/{id}` | Delete component policy    |

**Component Policy Characteristics:**

- Maximum 5 rules per policy
- Up to 5 component policies assignable per project/branch
- Actions: `SEND_EMAIL`, `BREAK_THE_BUILD`, `CREATE_BUNDLE_JIRA_TICKET`
- Filter criteria focus on SCA-specific properties (license, dependency type, security risk, etc.)

> **Important:** The component policy endpoints are inferred from patterns. The actual paths should
> be verified against the full OpenAPI spec or by testing against the API.

---

### 1.10 Undocumented Endpoint Categories

The following tag categories are defined in the OpenAPI spec but their endpoints are truncated in
the public documentation:

| Category                       | Likely Purpose                                          |
| ------------------------------ | ------------------------------------------------------- |
| Portfolio Policy Configuration | Manage default policies at the portfolio level          |
| Issue Policy Execution         | Trigger execution of issue policies (e.g., re-evaluate) |
| Issue Policy Evaluation        | Evaluate issue policies against current findings        |
| Policy Evaluations             | General policy evaluation status                        |
| Policy Violations              | Track which projects/branches violate policies          |
| Active Violation Counts        | Get counts of active violations per application/project |

These endpoints are important for a complete implementation but cannot be documented without access
to the full specification.

---

### 1.11 Enums

| Enum Name             | Values                                                       | Used In                          |
| --------------------- | ------------------------------------------------------------ | -------------------------------- |
| IssuePolicyAction     | `SEND_EMAIL`, `BREAK_THE_BUILD`, `CREATE_BUNDLE_JIRA_TICKET` | Issue policy rule actions        |
| PrPolicyAction        | `BLOCK_PR`                                                   | PR policy rule actions           |
| ComponentPolicyAction | `SEND_EMAIL`, `BREAK_THE_BUILD`, `CREATE_BUNDLE_JIRA_TICKET` | Component policy rule actions    |
| Frequency             | `daily`, `weekly`                                            | Test scheduling policy rules     |
| AssignmentType        | `project`                                                    | Bulk assignments V2              |
| PolicyUseCase         | `issue_policy`, `component_policy`                           | Policy actions filter            |
| Severity              | `critical`, `high`, `medium`, `low`                          | powerFilterQuery / criteriaQuery |
| ToolType              | `sast`, `sca`, `dast`                                        | powerFilterQuery / criteriaQuery |

---

### 1.12 Error Responses

| Status | Description                       |
| ------ | --------------------------------- |
| 400    | Bad request (invalid payload)     |
| 401    | Unauthorized                      |
| 404    | Resource not found                |
| 406    | Not acceptable (wrong media type) |
| 415    | Unsupported media type            |
| 500    | Internal server error             |

**Error Schema:**

```json
{
  "type": "urn:polaris:error:...",
  "status": 400,
  "title": "Bad Request",
  "details": "Detailed error message",
  "locationId": "...",
  "remediation": "How to fix"
}
```

---

### 1.13 Deprecation Timeline

| Deprecated Path Prefix | Current Path Prefix | Deprecation Date            | Sunset Date                        |
| ---------------------- | ------------------- | --------------------------- | ---------------------------------- |
| `/api/risk/policies/`  | `/api/policies/`    | Fri 1 Nov 2024 23:59:59 GMT | Tue 24 Mar 2026 05:00:00 GMT (EST) |

**Recommendation:** Use ONLY the `/api/policies/` endpoints. The `/api/risk/policies/` endpoints
should not be implemented as they will stop functioning on the sunset date.

---

## Section 2: Write Operations Focus

### 2.1 Summary of All Write Operations

| Operation                     | Method | Path                                          | Request Body                 | Response   |
| ----------------------------- | ------ | --------------------------------------------- | ---------------------------- | ---------- |
| Create Issue Policy           | POST   | `/api/policies/issue-policies`                | `IssuePolicyPolicyPayload`   | 201 + body |
| Update Issue Policy           | PUT    | `/api/policies/issue-policies/{id}`           | `IssuePolicyPolicyPayload`   | 200 + body |
| Delete Issue Policy           | DELETE | `/api/policies/issue-policies/{id}`           | none                         | 204        |
| Create PR Policy              | POST   | `/api/policies/pr-policies`                   | `PrPolicyPolicyPayload`      | 201 + body |
| Update PR Policy              | PUT    | `/api/policies/pr-policies/{id}`              | `PrPolicyPolicyPayload`      | 200 + body |
| Delete PR Policy              | DELETE | `/api/policies/pr-policies/{id}`              | none                         | 204        |
| Create Test Scheduling Policy | POST   | `/api/policies/test-scheduling-policies`      | `TestFrequencyPolicyPayload` | 201 + body |
| Update Test Scheduling Policy | PUT    | `/api/policies/test-scheduling-policies/{id}` | `TestFrequencyPolicyPayload` | 200 + body |
| Add Policy Assignments        | POST   | `/api/policies/assignments`                   | `BulkAssignmentsPayload`     | 204        |
| Remove Policy Assignments     | DELETE | `/api/policies/assignments`                   | `BulkAssignmentsPayload`     | 204        |
| Set Default Policy            | POST   | `/api/policies/policy-settings`               | `PolicySettingsPayload`      | 204        |

### 2.2 Write Operation Details

#### Create Issue Policy

```
POST /api/policies/issue-policies
Accept: application/vnd.polaris.policies.issue-policy-1+json
Content-Type: application/vnd.polaris.policies.issue-policy-1+json

{
  "name": "string (required, max 255)",
  "description": "string (optional, max 512)",
  "filterGroups": {
    "rules": [
      {
        "ruleNumber": 1,
        "filter": {
          "powerFilterQuery": "context:tool-type=in=('sast');issueProperties:severity=in=('critical','high')"
        },
        "actions": [
          { "name": "SEND_EMAIL", "disabled": false },
          { "name": "BREAK_THE_BUILD", "disabled": false }
        ],
        "fixByRule": [
          { "query": "issueProperties:severity==critical", "days": 7, "disabled": false },
          { "query": "issueProperties:severity==high", "days": 30, "disabled": false }
        ]
      }
    ]
  }
}

Response: 201 Created
Body: IssuePoliciesResponse (id, name, description, filterGroups, isDefault, createdAt, updatedAt, _links)
```

#### Update Issue Policy

```
PUT /api/policies/issue-policies/{id}
Accept: application/vnd.polaris.policies.issue-policy-1+json
Content-Type: application/vnd.polaris.policies.issue-policy-1+json

Body: Same as Create (full replacement, not partial update)

Response: 200 OK
Body: IssuePoliciesResponse
```

#### Delete Issue Policy

```
DELETE /api/policies/issue-policies/{id}

Response: 204 No Content
Note: Default issue policy cannot be deleted
```

#### Create PR Policy

```
POST /api/policies/pr-policies
Accept: application/vnd.polaris.policies.pr-policies-1+json
Content-Type: application/vnd.polaris.policies.pr-policies-1+json

{
  "name": "string (required, max 255)",
  "description": "string (optional, max 512)",
  "rules": [
    {
      "criteriaQuery": "context:tool-type=in=('sast','sca');issueProperties:severity=in=('critical')",
      "actions": [
        { "name": "BLOCK_PR", "disabled": false }
      ]
    }
  ]
}

Response: 201 Created
Body: PrPolicyResponse
```

#### Update PR Policy

```
PUT /api/policies/pr-policies/{id}
Accept: application/vnd.polaris.policies.pr-policies-1+json
Content-Type: application/vnd.polaris.policies.pr-policies-1+json

Body: Same as Create (full replacement)

Response: 200 OK
Body: PrPolicyResponse
```

#### Delete PR Policy

```
DELETE /api/policies/pr-policies/{id}

Response: 204 No Content
```

#### Create Test Scheduling Policy

```
POST /api/policies/test-scheduling-policies
Accept: application/vnd.polaris.policies.test-scheduling-policy-1+json
Content-Type: application/vnd.polaris.policies.test-scheduling-policy-1+json

{
  "name": "string (required)",
  "description": "string (optional)",
  "scheduleGroups": {
    "rules": [
      {
        "ruleNumber": 1,
        "frequency": "daily"
      }
    ]
  }
}

Response: 201 Created
Body: TestSchedulingPolicyResponse
```

#### Update Test Scheduling Policy

```
PUT /api/policies/test-scheduling-policies/{id}
Accept: application/vnd.polaris.policies.test-scheduling-policy-1+json
Content-Type: application/vnd.polaris.policies.test-scheduling-policy-1+json

Body: Same as Create (full replacement)

Response: 200 OK
Body: TestSchedulingPolicyResponse
```

#### Add Policy Assignments (V2)

```
POST /api/policies/assignments
Accept: application/vnd.polaris.policies.policy-bulk-assignment-2+json
Content-Type: application/vnd.polaris.policies.policy-bulk-assignment-2+json

{
  "assignments": [
    {
      "type": "project",
      "associationId": "uuid-of-project",
      "policyId": "uuid-of-policy"
    },
    {
      "type": "project",
      "associationId": "uuid-of-another-project",
      "policyId": "uuid-of-policy"
    }
  ]
}

Response: 204 No Content
```

#### Remove Policy Assignments (V2)

```
DELETE /api/policies/assignments
Accept: application/vnd.polaris.policies.policy-bulk-assignment-2+json
Content-Type: application/vnd.polaris.policies.policy-bulk-assignment-2+json

Body: Same as Add (identifies which assignments to remove)

Response: 204 No Content
```

#### Set Default Policy

```
POST /api/policies/policy-settings
Content-Type: application/json

{
  "policyId": "uuid-of-policy",
  "defaultPolicyStatus": true
}

Response: 204 No Content
Note: New default policy will NOT be reassigned to existing projects
```

---

## Section 3: Sources

Documentation was extracted from:

- [Policies - Dev Portal](https://polaris.blackduck.com/developer/default/documentation/policies)
- [Component Policies Documentation](https://polaris.blackduck.com/developer/default/polaris-documentation/t_policy_component)
- [API Reference Guide](https://polaris.blackduck.com/developer/default/documentation)
- [Issue Policies Documentation](https://polaris.blackduck.com/developer/default/polaris-documentation/t_post_scan_policies)
- [Monitor Policies](https://polaris.blackduck.com/developer/default/polaris-documentation/t_policy_monitor)
- [API Quickstart](https://polaris.blackduck.com/developer/default/documentation/t_api-quickstart)
