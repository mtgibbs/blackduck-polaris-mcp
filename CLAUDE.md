# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

MCP (Model Context Protocol) server for the Black Duck Polaris API. Enables coding agents (Claude
Code, GitHub Copilot, etc.) to query security vulnerabilities, issues, projects, and scan results
from Polaris directly within development workflows. Published to npm as
`@mtgibbs/blackduck-polaris-mcp`.

## Build & Development Commands

```bash
deno task dev          # Run with watch mode (auto-restart on changes)
deno task check        # Type check entry points
deno task lint         # Lint (Deno built-in, recommended rules)
deno task fmt          # Format (100 char width, 2 spaces, double quotes)
deno fmt --check       # Check formatting without modifying
deno task test         # Run all tests
deno test src/path/to/test.ts  # Run a single test file
deno task build:npm    # Build npm package via dnt (output: npm/)
```

## Architecture

### Layer Structure

```
MCP Tool (src/mcp/tools/)      <-- Tool definitions with Zod schemas
    |
Service Layer (src/services/)   <-- Business logic, filter building
    |
API Layer (src/api/)            <-- Polaris REST API calls with media types
    |
PolarisClient (src/api/client.ts) <-- HTTP client with auth + pagination
```

### Key Files

- `agent.ts` — MCP server entry point (stdio transport)
- `deno.json` — All config: deps, tasks, fmt, lint (no separate tsconfig/eslintrc/prettierrc)
- `build_npm.ts` — dnt (Deno to Node Transform) build for npm publishing
- `src/api/client.ts` — Core HTTP client: `Api-token` auth, offset + cursor pagination, vendor media
  types
- `src/mcp/server.ts` — McpServer setup, iterates tools array for registration
- `src/mcp/types.ts` — `ToolDefinition<T>`, `jsonResponse()`, `errorResponse()` helpers
- `src/mcp/tools/index.ts` — Flat array of all tool definitions
- `src/services/index.ts` — Re-exports all service modules
- `src/types/polaris.ts` — TypeScript interfaces for Polaris API responses

### Tool Definition Pattern

Each tool is one file exporting a `ToolDefinition<typeof schema>`:

- Schema is a **plain object of Zod types** (NOT wrapped in `z.object()`)
- Handler destructures args directly, delegates to service layer
- All tools have `annotations: { readOnlyHint: true, openWorldHint: true }`
- Return `jsonResponse(data)` or `errorResponse(message)`

### MCP Tools

| Tool                              | Purpose                                                |
| --------------------------------- | ------------------------------------------------------ |
| `get_portfolios`                  | Get org portfolio ID (entry point for all queries)     |
| `get_applications`                | List applications in a portfolio                       |
| `get_projects`                    | List projects (codebases scanned for vulns)            |
| `get_branches`                    | List branches for a project                            |
| `get_issues`                      | Query security issues with severity/tool/delta filters |
| `get_occurrences`                 | Get specific vulnerability instances (file, line)      |
| `get_code_snippet`                | Source code around a vulnerability                     |
| `get_remediation_assist`          | AI remediation guidance (Polaris Assist)               |
| `get_tests`                       | List scan history (SAST, SCA, DAST)                    |
| `get_test_metrics`                | Issue counts by severity for a scan                    |
| `get_bug_tracking_configurations` | List Jira/Azure DevOps integrations                    |
| `get_external_projects`           | List projects in external bug tracking system          |
| `export_issues`                   | Export issues to Jira/Azure DevOps tickets             |

## Polaris API Conventions

- **Auth**: Custom `Api-token` header (not Bearer). Tokens expire after 30 days of inactivity.
- **Base URL**: `https://polaris.blackduck.com` (or tenant-specific). Each service has its own base
  path.
- **Media types**: Vendor-specific Accept/Content-Type headers **required**. Pattern:
  `application/vnd.polaris.{service}.{resource}-{version}+json`. Requests without correct Accept
  header return 406.
- **Pagination**: Cursor-based for Findings (`_first`, `_cursor`), offset-based for others
  (`_offset`, `_limit`).
- **Filtering**: RSQL via `_filter` param. Operators: `==`, `!=`, `=in=()`, `=out=()`. Logical: `;`
  (AND), `,` (OR).
- **Errors**: RFC 7807 `application/problem+json` with `type`, `title`, `status`, `detail`.

### Data Hierarchy

```
Organization -> Portfolio (one per org) -> Applications -> Projects -> Branches -> Tests -> Issues -> Occurrences
```

### Key Findings Query Patterns

- `GET /api/findings/issues?projectId={id}&testId=latest&_first=100`
- `_includeType=true` — issue names, descriptions, remediation
- `_includeOccurrenceProperties=true` — file paths, line numbers, severity
- Severity filter: `_filter=occurrence:severity=in=('critical','high')`
- Tool type filter: `_filter=context:tool-type=in=('sast','sca','dast')`
- New issues only: `_filter=special:delta==new`

### API Service Base Paths

| Service      | Base Path                       |
| ------------ | ------------------------------- |
| Portfolio    | `/api/portfolios`               |
| Findings     | `/api/findings`                 |
| Tests        | `/api/tests`                    |
| Auth         | `/api/auth`                     |
| Tools        | `/api/tools`                    |
| Policies     | `/api/policies`                 |
| Reports      | `/api/insights`                 |
| Audit        | `/api/audit`                    |
| Bug Tracking | `/api/integrations/bugtracking` |
| Repos        | `/api/integrations/repos`       |

Old base paths (e.g., `/api/portfolio`, `/api/specialization-layer-service`) sunset **March 24,
2026**.

## Configuration

Environment variables (see `.env.example`):

- `POLARIS_URL` — Polaris instance URL
- `POLARIS_API_TOKEN` — API access token (Profile > Access Tokens in Polaris UI)
- `POLARIS_ORGANIZATION_ID` — (Optional) Organization ID, required for bug tracking integration APIs

## Release Flow

Conventional Commits -> Release Please (auto PR + changelog) -> npm publish with provenance. Version
tracked in `deno.json` and `.release-please-manifest.json`.
