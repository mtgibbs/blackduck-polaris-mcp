# PRD-07: Error Resilience & Diagnostics

## Problem Statement

The MCP server has minimal error handling — all API errors are thrown as raw
`Error("Polaris API error {status}: {detail}")` strings that bubble up unhandled to the MCP SDK.
This creates several problems observed in real usage:

1. **Stale resource IDs** — Portfolio/Application/Project IDs changed mid-session after ~90 minutes,
   causing 403 errors with no guidance. Users had to restart the MCP server and re-fetch all IDs.

2. **Unhelpful 500 errors** — The first export attempt failed with a 500 because `bts_issue_type_id`
   was missing. The error message gave no indication of what was wrong or how to fix it.

3. **404 for resolved issues** — Attempting to export an issue that was fixed in code returned
   "Issue family cannot be found" with no context about why (issue resolved in latest scan).

4. **No error wrapping in tool handlers** — Tool handlers don't catch exceptions from the
   service/API layer. Errors propagate as unhandled exceptions to the MCP SDK, losing the
   opportunity to add contextual guidance.

5. **No retry or recovery logic** — Any transient error (network blip, token refresh) immediately
   fails with no recovery path.

## Goals

1. Wrap all tool handlers with try/catch that converts API errors into contextual `errorResponse()`
   messages with actionable guidance
2. Detect stale-ID patterns (403 on previously-valid resources) and suggest re-fetching
3. Enhance specific error scenarios with diagnostic messages (404 on export, 500 on missing params)
4. Add optional retry logic for transient errors (429, 503, network timeouts)

## Non-Goals

- Automatic ID refresh (would add hidden API calls and complexity)
- Caching resource IDs across calls
- Changing the Polaris API's error response format
- Full circuit-breaker or resilience library

## Design

### Part 1: Tool Handler Error Wrapping

Currently, tool handlers call service functions directly with no try/catch:

```typescript
// Current pattern (e.g., triage-issues.ts)
handler: (async (args) => {
  // ... validation ...
  const result = await findingsService.triageIssues(opts);
  return jsonResponse(result);
});
```

If the API call throws, the error propagates as an unhandled exception. The MCP SDK converts this to
a generic error response, losing the opportunity to add tool-specific guidance.

#### Solution: `withErrorHandling` Wrapper

Create a shared handler wrapper in `src/mcp/error-handling.ts`:

```typescript
import { errorResponse } from "./types.ts";
import type { ToolResponse } from "./types.ts";

interface PolarisApiError {
  message: string;
  status?: number;
}

/**
 * Parse the HTTP status code from a Polaris API error message.
 * Format: "Polaris API error {status}: {detail}"
 */
function parseApiErrorStatus(error: Error): PolarisApiError {
  const match = error.message.match(/Polaris API error (\d+): (.+)/);
  if (match) {
    return { status: parseInt(match[1]), message: match[2] };
  }
  return { message: error.message };
}

/**
 * Contextual error messages for common HTTP status codes.
 */
function getStatusGuidance(status: number, toolName: string): string {
  switch (status) {
    case 401:
      return "Authentication failed. Your API token may have expired " +
        "(tokens expire after 30 days of inactivity). " +
        "Generate a new token in Polaris UI: Profile > Access Tokens.";

    case 403:
      return "Access denied. This can happen when:\n" +
        "- Resource IDs have become stale (portfolio/application/project IDs can change)\n" +
        "- Your API token lacks permissions for this resource\n" +
        "- The organization context has changed\n\n" +
        "Suggested fix: Re-fetch resource IDs starting from get_portfolios().";

    case 404:
      return "Resource not found. This can happen when:\n" +
        "- The resource was deleted or resolved (e.g., a fixed vulnerability)\n" +
        "- The ID is from a different branch or test run\n" +
        "- Resource IDs have become stale\n\n" +
        "Suggested fix: Verify the resource still exists by querying the parent collection.";

    case 406:
      return "Not Acceptable — the API rejected the request media type. " +
        "This is likely an internal MCP server bug. Please report it.";

    case 429:
      return "Rate limited by the Polaris API. Wait a moment and retry.";

    case 500:
      return "Internal server error from Polaris API. This often indicates:\n" +
        "- Missing required parameters that aren't validated client-side\n" +
        "- Invalid parameter combinations\n\n" +
        "Check that all required parameters are provided.";

    case 503:
      return "Polaris API is temporarily unavailable. Retry in a few moments.";

    default:
      return "";
  }
}

/**
 * Tool-specific error context for known failure patterns.
 */
type ToolErrorContext = Record<string, (error: PolarisApiError) => string | null>;

const TOOL_ERROR_CONTEXT: ToolErrorContext = {
  "export_issues": (error) => {
    if (error.status === 404 && error.message.includes("issue family")) {
      return "The issue may have been resolved in the latest scan (code was fixed). " +
        "Use get_issues(project_id) to verify which issues currently exist.";
    }
    if (error.status === 500) {
      return "Common cause: missing bts_issue_type_id when creating a new ticket. " +
        "Either provide bts_issue_type_id explicitly, or use project_id for auto-resolution. " +
        "Use get_external_issue_types(config_id, project_key) to find valid issue types.";
    }
    return null;
  },

  "bulk_export_issues": (error) => {
    // Same patterns as export_issues
    return TOOL_ERROR_CONTEXT["export_issues"]?.(error) ?? null;
  },

  "triage_issues": (error) => {
    if (error.status === 400 && error.message.includes("exclusive")) {
      return "Triage field exclusivity error. Rules:\n" +
        "- To dismiss: use {dismissal-reason, comment} only\n" +
        "- To change status: use {status, comment} only\n" +
        "- NEVER set is-dismissed (auto-calculated)\n" +
        "- NEVER combine status with dismissal-reason";
    }
    if (error.message.includes("0") || error.message.includes("count")) {
      return "If triage returned count=0, your filter may not match any issues. " +
        "Try occurrence:filename instead of occurrence:id for triage operations.";
    }
    return null;
  },

  "get_external_projects": (error) => {
    if (error.message.includes("less than or equal to")) {
      return "The API has a lower page size limit than expected. " +
        "This should be handled internally — please report this as a bug.";
    }
    return null;
  },
};

/**
 * Wrap a tool handler with error handling that provides contextual guidance.
 */
export function withErrorHandling(
  toolName: string,
  handler: (args: Record<string, unknown>) => Promise<ToolResponse>,
): (args: Record<string, unknown>) => Promise<ToolResponse> {
  return async (args) => {
    try {
      return await handler(args);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      const parsed = parseApiErrorStatus(error);

      // Build contextual error message
      const parts: string[] = [error.message];

      // Add status-specific guidance
      if (parsed.status) {
        const statusGuide = getStatusGuidance(parsed.status, toolName);
        if (statusGuide) parts.push(statusGuide);
      }

      // Add tool-specific guidance
      const toolContext = TOOL_ERROR_CONTEXT[toolName];
      if (toolContext) {
        const toolGuide = toolContext(parsed);
        if (toolGuide) parts.push(toolGuide);
      }

      return errorResponse(parts.join("\n\n"));
    }
  };
}
```

#### Integration Pattern

Update tool registration in `src/mcp/server.ts`:

```typescript
import { withErrorHandling } from "./error-handling.ts";

// Current:
server.tool(
  tool.name,
  tool.description,
  tool.schema,
  tool.annotations ?? {},
  (args) => tool.handler(args),
);

// Updated:
server.tool(
  tool.name,
  tool.description,
  tool.schema,
  tool.annotations ?? {},
  withErrorHandling(tool.name, (args) => tool.handler(args)),
);
```

This is a single-line change in `server.ts` that wraps **all** tools with error handling
automatically. No changes needed in individual tool files.

### Part 2: Stale-ID Detection & Guidance

The most impactful error scenario: resource IDs become stale after ~90 minutes, causing 403 errors
on previously-working calls. Users don't know what happened or how to recover.

#### Approach: 403 Pattern Detection

The `withErrorHandling` wrapper already adds guidance for 403 errors (see Part 1). Additionally,
track whether the session has successfully used an ID before:

```typescript
// Optional enhancement: track known-good IDs in memory
const knownGoodIds = new Set<string>();

export function trackSuccessfulId(id: string): void {
  knownGoodIds.add(id);
}

export function wasIdPreviouslyValid(id: string): boolean {
  return knownGoodIds.has(id);
}
```

If a 403 occurs on a previously-valid ID, the error message becomes more specific:

```
Access denied for resource {id}. This resource was previously accessible in this session,
which suggests resource IDs have become stale.

Suggested fix: Re-fetch resource IDs starting from get_portfolios(). Resource IDs can change
when the Polaris server rotates internal references or when organization context shifts.
```

**Note:** This is an optional enhancement. The basic 403 guidance in Part 1 is sufficient for most
cases and doesn't require tracking state.

### Part 3: Retry Logic for Transient Errors

Add optional retry for specific transient error codes in the HTTP client.

#### Retryable Status Codes

- **429** — Rate limited (retry after `Retry-After` header or exponential backoff)
- **503** — Service unavailable (retry with exponential backoff)
- **Network errors** — Connection reset, timeout (retry once)

#### Implementation in `src/api/client.ts`

```typescript
private async sendRequestWithRetry<T>(
  path: string,
  options: RequestOptions,
  maxRetries = 2,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await this.sendRequest<T>(path, options);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Only retry on transient errors
      const parsed = lastError.message.match(/Polaris API error (\d+)/);
      const status = parsed ? parseInt(parsed[1]) : 0;

      if (status === 429 || status === 503) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000); // 1s, 2s, 4s... max 10s
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Non-retryable error — throw immediately
      throw lastError;
    }
  }

  throw lastError!;
}
```

**Scope:** Only apply retry logic to GET requests (reads). POST/PATCH/DELETE should not auto-retry
to avoid duplicate side effects.

### Part 4: Improved Error Messages for Specific Scenarios

#### Scenario: Export 404 — Issue Resolved

**Before:**

```
Error: Polaris API error 404: Requested issue family cannot be found
```

**After (via TOOL_ERROR_CONTEXT):**

```
Error: Polaris API error 404: Requested issue family cannot be found

The issue may have been resolved in the latest scan (code was fixed).
Use get_issues(project_id) to verify which issues currently exist.
```

#### Scenario: Triage 400 — Field Exclusivity

**Before:**

```
Error: Polaris API error 400: status and dismissal-reason are exclusive
```

**After (via TOOL_ERROR_CONTEXT + PRD-04 client-side validation):**

With PRD-04's client-side validation, this error is caught **before** the API call:

```
Error: Cannot set both 'status' and 'dismissal-reason' (exclusive fields).
To dismiss: use {dismissal-reason, comment} only — status auto-sets to 'dismissed'.
To change status: use {status, comment} only.
```

#### Scenario: Export 500 — Missing bts_issue_type_id

**Before:**

```
Error: Polaris API error 500: Internal Server Error
```

**After (via TOOL_ERROR_CONTEXT):**

```
Error: Polaris API error 500: Internal Server Error

Common cause: missing bts_issue_type_id when creating a new ticket.
Either provide bts_issue_type_id explicitly, or use project_id for auto-resolution.
Use get_external_issue_types(config_id, project_key) to find valid issue types.
```

#### Scenario: get_external_projects — Limit Exceeded

**Before:**

```
Error: getBtsProjects._limit: must be less than or equal to 50
```

**After (handled by PRD-05 pagination defaults + TOOL_ERROR_CONTEXT fallback):**

With PRD-05's fix, this error shouldn't occur. The error context is a safety net.

## Implementation Plan

### Phase 1: Error Wrapping Infrastructure

1. Create `src/mcp/error-handling.ts` with `withErrorHandling`, `parseApiErrorStatus`,
   `getStatusGuidance`
2. Add unit tests for error parsing and message generation
3. Integrate `withErrorHandling` in `src/mcp/server.ts` (single-line change)

### Phase 2: Tool-Specific Error Context

4. Add `TOOL_ERROR_CONTEXT` entries for high-impact tools: `export_issues`, `triage_issues`,
   `get_external_projects`
5. Add entries for new tools from PRD-05/06: `bulk_export_issues`, `dismiss_issues`
6. Add unit tests for each tool-specific error context function

### Phase 3: Retry Logic (Optional)

7. Add `sendRequestWithRetry` to `src/api/client.ts`
8. Apply retry only to GET-based methods (`get`, `getAllOffset`, `getAllCursor`)
9. Add tests for retry behavior (mock 429/503 responses)

### Phase 4: Stale-ID Detection (Optional)

10. Add ID tracking utilities
11. Enhance 403 messages when a previously-valid ID fails
12. Add tests

## Implementation Dependencies

- **Independent of other PRDs** — can be implemented in any order
- **Complements PRD-04** — PRD-04 adds client-side validation to prevent errors; PRD-07 handles
  errors that get past validation
- **Complements PRD-05** — PRD-05 fixes pagination defaults; PRD-07 provides fallback error context

## Success Metrics

- All API errors include actionable guidance (not just raw status codes)
- 403 errors suggest re-fetching IDs from `get_portfolios()`
- Export 404 errors explain that the issue may have been resolved
- Triage 400 errors explain field exclusivity rules
- Zero unhandled exceptions reaching the MCP SDK from tool handlers
- Transient 429/503 errors auto-recover without user intervention

## Risks & Mitigations

| Risk                                                                      | Mitigation                                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Error message heuristics are wrong (e.g., 500 isn't about missing params) | Messages are additive guidance, not authoritative diagnosis        |
| Retry logic masks real errors                                             | Only retry on 429/503; max 2 retries; log each attempt             |
| Stale-ID tracking uses memory                                             | Bounded Set with TTL or max size; reset on session restart         |
| `withErrorHandling` catches errors that should propagate                  | Only catches Error instances; re-throws non-Error values           |
| Tool-specific context becomes stale as API evolves                        | Context is additive hints, not blocking validation; easy to update |

## Open Questions

1. Should retry logic include a configurable max retry count or backoff strategy? Recommendation:
   keep it simple (2 retries, exponential backoff, max 10s delay).
2. Should stale-ID detection be proactive (ping an endpoint before each call) or reactive (detect
   after failure)? Recommendation: reactive only — proactive adds latency to every call.
3. Should error wrapping also log errors to stderr for debugging? Recommendation: yes,
   `console.error` for all caught errors so users running in debug mode can see the raw error.
