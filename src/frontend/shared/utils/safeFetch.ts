// src/frontend/shared/utils/safeFetch.ts
import { parseApiError } from "./parseApiError";

/**
 * Fetches JSON, normalising a non-2xx into an ApiError.
 *
 * Takes the `AbortSignal` TanStack Query hands its `queryFn`. Passing it is
 * what makes query-core abort a superseded request: it only calls `cancel()`
 * when the `signal` getter has been read, and otherwise lets the request run
 * to completion on the assumption that the transport cannot cancel.
 */
export async function safeFetch<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok)
    throw parseApiError(new Error(`${response.status} ${response.statusText}`));
  return response.json() as Promise<T>;
}
