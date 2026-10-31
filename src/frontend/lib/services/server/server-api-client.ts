// src/frontend/lib/services/server/server-api-client.ts
import { request } from "../api";

export { ServerRevalidate } from "../api";

interface FetchApiOptions {
  /** Seconds to keep the response in the Data Cache; see `ServerRevalidate`. */
  readonly revalidate?: number;
}

/**
 * Fetches one endpoint for a server component, over `request`.
 *
 * Failures are not logged here: a 404 on a detail route is an expected
 * outcome that `handleServerError` turns into `notFound()`, and every other
 * failure is logged once, there.
 *
 * @param endpoint - the endpoint, from the API root, with its query string
 * @param options - the Data Cache window
 * @returns the response's `data` field
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: FetchApiOptions,
): Promise<T> {
  return request<T>(endpoint, { revalidate: options?.revalidate });
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
