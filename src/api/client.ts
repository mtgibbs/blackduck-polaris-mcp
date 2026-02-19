import type { PolarisConfig } from "../utils/config.ts";

export interface PaginatedResponse<T> {
  _items: T[];
  _collection: {
    itemCount: number;
    pageCount: number;
    currentPage: number;
  };
  _links: LinkEntry[];
}

export interface LinkEntry {
  href: string;
  rel: string;
  method: string;
}

export interface ProblemDetail {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  accept?: string;
  contentType?: string;
}

let client: PolarisClient | null = null;

export function initClient(config: PolarisConfig): void {
  client = new PolarisClient(config);
}

export function getClient(): PolarisClient {
  if (!client) {
    throw new Error("Polaris client not initialized. Call initClient() first.");
  }
  return client;
}

export class PolarisClient {
  private baseUrl: string;
  private apiToken: string;
  private organizationId?: string;

  constructor(config: PolarisConfig) {
    this.baseUrl = config.baseUrl;
    this.apiToken = config.apiToken;
    this.organizationId = config.organizationId;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(path, this.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private buildHeaders(accept?: string, contentType?: string): Headers {
    const headers = new Headers({
      "Api-token": this.apiToken,
    });
    if (this.organizationId) {
      headers.set("Organization-Id", this.organizationId);
    }
    if (accept) {
      headers.set("Accept", accept);
    }
    if (contentType) {
      headers.set("Content-Type", contentType);
    }
    return headers;
  }

  async fetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path, options.params);
    const headers = this.buildHeaders(options.accept, options.contentType);

    const fetchOptions: globalThis.RequestInit = {
      method: options.method ?? "GET",
      headers,
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
      if (!options.contentType) {
        headers.set("Content-Type", "application/json");
      }
    }

    const response = await globalThis.fetch(url, fetchOptions);

    if (!response.ok) {
      let detail = "";
      try {
        const problem = (await response.json()) as ProblemDetail;
        detail = problem.detail ?? problem.title;
      } catch {
        detail = await response.text();
      }
      throw new Error(`Polaris API error ${response.status}: ${detail}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json() as T;
  }

  get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    accept?: string,
  ): Promise<T> {
    return this.fetch<T>(path, { params, accept });
  }

  /**
   * Fetch all pages using offset-based pagination.
   * Used by most Polaris services (portfolio, tests, auth, etc.)
   */
  async getAllOffset<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    accept?: string,
    limit = 100,
  ): Promise<T[]> {
    const allItems: T[] = [];
    let offset = 0;

    while (true) {
      const response = await this.fetch<PaginatedResponse<T>>(path, {
        params: { ...params, _offset: offset, _limit: limit },
        accept,
      });

      allItems.push(...response._items);

      const hasNext = response._links.some((l) => l.rel === "next");
      if (!hasNext || response._items.length < limit) {
        break;
      }

      offset += limit;
    }

    return allItems;
  }

  /**
   * Fetch all pages using cursor-based pagination.
   * Used by the Findings API (issues, occurrences).
   */
  async getAllCursor<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    accept?: string,
    pageSize = 100,
  ): Promise<T[]> {
    const allItems: T[] = [];
    let cursor: string | undefined;

    while (true) {
      const requestParams: Record<string, string | number | boolean | undefined> = {
        ...params,
      };
      // Only set _first if _last wasn't explicitly provided (they're mutually exclusive)
      if (!requestParams._last) {
        requestParams._first = pageSize;
      }
      if (cursor) {
        requestParams._cursor = cursor;
      }

      const response = await this.fetch<PaginatedResponse<T> & { _cursor?: string }>(path, {
        params: requestParams,
        accept,
      });

      allItems.push(...response._items);

      const nextLink = response._links.find((l) => l.rel === "next");
      if (!nextLink || response._items.length < pageSize) {
        break;
      }

      // Extract cursor from next link URL
      const nextUrl = new URL(nextLink.href, this.baseUrl);
      cursor = nextUrl.searchParams.get("_cursor") ?? undefined;
      if (!cursor) {
        break;
      }
    }

    return allItems;
  }
}
