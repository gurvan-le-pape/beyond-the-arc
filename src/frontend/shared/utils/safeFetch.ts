// src/frontend/shared/utils/safeFetch.ts
import { toApiError } from "./toApiError";

/**
 * Fetches JSON, normalising a non-2xx into an ApiError.
 *
 * Takes the `AbortSignal` TanStack Query hands its `queryFn`. Passing it is
 * what makes query-core abort a superseded request: it only calls `cancel()`
 * when the `signal` getter has been read, and otherwise lets the request run
 * to completion on the assumption that the transport cannot cancel.
 *
 * @param url - the absolute endpoint to request
 * @param signal - TanStack Query's `queryFn` signal; omitting it lets a superseded request run to completion
 * @returns the parsed JSON body — a non-2xx throws an `ApiError` instead
 */
export async function safeFetch<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw await toApiError(response);
  return response.json() as Promise<T>;
}
