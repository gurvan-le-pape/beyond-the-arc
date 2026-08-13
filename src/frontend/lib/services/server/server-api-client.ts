// src/frontend/lib/services/server/server-api-client.ts
import { REQUEST_ID_HEADER } from "@/shared/constants";
import type { ApiErrorResponse } from "@/shared/types";
import { ApiError } from "@/shared/types";

/**
 * Server-side API client for use in getStaticProps/getStaticPaths/getServerSideProps.
 *
 * IMPORTANT:
 * - DO NOT import this in client-side code!
 * - Use the regular apiClient for client-side requests.
 * - This uses native fetch and absolute URLs.
 *
 * Configuration:
 * - Uses internal Docker service name or localhost
 * - No authentication (internal network)
 * - Simple error handling
 */

/**
 * Base URL for internal API communication.
 * Uses Docker service name in production, localhost in development.
 */
const BASE_URL = process.env.INTERNAL_API_URL || "http://backend:4000/api";

/**
 * Mirrors the 30s timeout of the client-side axios instance. Native fetch has
 * no default timeout, so without this a hung backend request would block the
 * SSR render indefinitely.
 */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * How long a server-side response stays in Next's Data Cache, in seconds.
 *
 * The route decides when a page renders; this decides how long its data lives.
 * A `revalidate` on the page is a different, weaker thing: it caches rendered
 * HTML, it cannot apply to a `force-dynamic` route, and it does nothing at all
 * unless the fetch underneath is itself cacheable. A fetch that passes neither
 * `cache` nor `next.revalidate` is `no-store` in Next 15, which means one
 * backend round trip per request per page.
 *
 * These windows mirror the client-side `staleTime` tiers in the Query Options
 * factories — same question ("how often does this actually change?"), asked of
 * the other half of the dual service layer.
 */
export const ServerRevalidate = {
  /**
   * Competition structure and geography. Only changes when the static-data
   * migration is refreshed, which is a manual, occasional job.
   */
  REFERENCE: 86_400,
  /**
   * Entities that move with a data refresh rather than with play: players,
   * teams, championships, pools. Matches the 1-hour window the detail pages
   * already declare, so nothing gets staler than it is today.
   */
  DEFAULT: 3_600,
  /** Anything the match scheduler writes: results, stats, leaderboards. */
  LIVE: 60,
} as const;

interface FetchApiOptions {
  /**
   * Seconds to keep the response in the Data Cache. Defaults to
   * `ServerRevalidate.DEFAULT` — caching is opt-out rather than opt-in so a
   * new server service cannot silently reintroduce a per-request query.
   */
  readonly revalidate?: number;
}

/**
 * Fetches data from the API server-side.
 * Uses absolute URLs required for Node.js environment.
 *
 * @param endpoint - API endpoint (e.g., '/clubs')
 * @param options - Cache window override; see {@link ServerRevalidate}
 * @returns Parsed JSON response
 * @throws {Error} If request fails
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: FetchApiOptions,
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // No try/catch here on purpose. This layer does not handle failures, it
  // reports them — and a 404 on a detail route is an expected, handled
  // outcome (handleServerError turns it into notFound()). Logging here made
  // every one of those an error-level line next to the real failures.
  // The error is logged once, where it is handled: see handleServerError.
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: options?.revalidate ?? ServerRevalidate.DEFAULT },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    // Build the ApiError from response.status directly. parseApiError only
    // recovers a status code from axios errors; on this native-fetch path it
    // receives the plain backend error body and would fall back to status 0,
    // so a 404 could never be distinguished (e.g. by handleServerError).
    const body = (await response
      .json()
      .catch(() => null)) as Partial<ApiErrorResponse> | null;
    throw new ApiError({
      statusCode: response.status,
      message: Array.isArray(body?.message)
        ? body.message.join(", ")
        : (body?.message ?? response.statusText),
      error: body?.error ?? response.statusText,
      path: body?.path,
      timestamp: body?.timestamp,
      // The correlation id comes off the header, not the body. Carried here so
      // handleServerError can log it: that is the only thing joining this
      // failure to the backend line that produced it.
      requestId: response.headers.get(REQUEST_ID_HEADER) ?? undefined,
    });
  }

  const data = await response.json();

  // Unwrap the standard API response format
  return (data && "data" in data ? data.data : data) as T;
}

/**
 * Utility to build query string from params object.
 *
 * @param params - Query parameters
 * @returns Query string (e.g., '?key=value&key2=value2')
 */
export function buildQueryString(
  params?: Record<string, string | number | boolean | undefined> | object,
): string {
  if (!params || Object.keys(params).length === 0) {
    return "";
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return `?${searchParams.toString()}`;
}
