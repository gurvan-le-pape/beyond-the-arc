// src/frontend/lib/services/api.ts
import { ApiError } from "@/shared/types";
import { toApiError } from "@/shared/utils";

const isServer = typeof window === "undefined";

/**
 * Where the backend is, from wherever this runs. A server render reaches it
 * over the Docker network; the browser goes through its public URL.
 * `INTERNAL_API_URL` is not `NEXT_PUBLIC_`, so the browser bundle never sees it.
 */
const BASE_URL = isServer
  ? process.env.INTERNAL_API_URL || "http://backend:4000/api"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Native fetch has no default timeout, so without this a hung backend would
 * block a server render, or leave a query pending, indefinitely.
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
 * In the browser the option is ignored; there, freshness is the query's
 * `staleTime`. Both answer the same question — how often does this actually
 * change? — so an endpoint's tier and its query's `staleTime` should agree.
 */
export const ServerRevalidate = {
  /**
   * Competition structure and geography. Only changes when the static-data
   * migration is refreshed, which is a manual, occasional job.
   */
  REFERENCE: 86_400,
  /**
   * Entities that move with a data refresh rather than with play: players,
   * teams, championships, pools.
   */
  DEFAULT: 3_600,
  /** Anything the match scheduler writes: results, stats, leaderboards. */
  LIVE: 60,
} as const;

interface RequestOptions {
  /** Query-string parameters; `undefined` and `null` values are left out. */
  readonly params?: object;
  /**
   * Seconds to keep the response in the Data Cache on the server. Defaults to
   * `ServerRevalidate.DEFAULT` — caching is opt-out rather than opt-in so a
   * new endpoint cannot silently reintroduce a per-request query.
   */
  readonly revalidate?: number;
  /**
   * TanStack Query's `queryFn` signal. Passing it is what lets query-core
   * abort a superseded request: it only cancels when the signal was read.
   */
  readonly signal?: AbortSignal;
}

/**
 * GETs one backend endpoint and returns its `data`, from a server component
 * or from the browser alike — the same call either way, so a feature writes
 * each endpoint once.
 *
 * A non-2xx response throws an `ApiError` carrying the HTTP status and the
 * `x-request-id`, which `handleServerError` and the query retry policy read.
 * In the browser, a request that got no response at all (offline, refused,
 * aborted, timed out) throws an `ApiError` with `statusCode: 0`. On the server
 * such a failure is rethrown untouched, because Next signals its own render
 * control flow by throwing out of `fetch` and that must not be repackaged.
 *
 * @param path - the endpoint, from the API root, e.g. `/matches/12`
 * @param options - query parameters, server cache window, abort signal
 * @returns the response's `data` field
 */
export async function request<T>(
  path: string,
  {
    params,
    revalidate = ServerRevalidate.DEFAULT,
    signal,
  }: RequestOptions = {},
): Promise<T> {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    // No Content-Type: a GET carries no body, and in the browser the header
    // would turn every request into a CORS preflight plus the request.
    response = await fetch(`${BASE_URL}${path}${toQueryString(params)}`, {
      next: { revalidate },
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (error) {
    if (isServer) throw error;
    throw new ApiError({
      statusCode: 0,
      message: error instanceof Error ? error.message : String(error),
      error: error instanceof Error ? error.name : "NetworkError",
    });
  }

  if (!response.ok) throw await toApiError(response);

  const body: unknown = await response.json();
  return (
    body !== null && typeof body === "object" && "data" in body
      ? body.data
      : body
  ) as T;
}

function toQueryString(params?: object): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null)
      search.append(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}
