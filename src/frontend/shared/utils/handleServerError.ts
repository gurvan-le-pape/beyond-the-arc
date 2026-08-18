// src/frontend/shared/utils/handleServerError.ts
import { notFound } from "next/navigation";

import { ApiError } from "@/shared/types";

import { logger } from "./logger";

/**
 * The single place a server-side fetch failure is handled, and therefore the
 * single place it is logged.
 *
 * A 404 is an expected outcome on a detail route — it is handled by rendering
 * the not-found boundary, so it is not an error-level event. Anything else
 * propagates to the segment's `error.tsx`, and is logged here once on the way
 * past rather than at every layer it crosses.
 *
 * @param error - whatever the server-side fetch rejected with
 * @returns never — a 404 throws into the not-found boundary, anything else rethrows
 */
export function handleServerError(error: unknown): never {
  if (error instanceof ApiError && error.statusCode === 404) notFound();

  logger.error(error, buildContext(error));
  throw error;
}

/**
 * The id goes in the *message*, not just on the error object.
 *
 * `logger.error` is a `console.error` wrapper, so an own property of the error
 * would only appear in the trailing block `util.inspect` prints after the
 * stack — and Promtail ships each of those as its own log line, unattached to
 * anything searchable. Putting it in the first line is what makes
 * `{service="frontend"} |= "<id>"` and `{service="backend"} | json | req_id="<id>"`
 * name the same request.
 *
 * @param error - the failure being logged; an `ApiError` contributes its request id
 * @returns the log message's first line, with the id inline where there is one
 */
function buildContext(error: unknown): string {
  const requestId = error instanceof ApiError ? error.requestId : undefined;

  return requestId
    ? `Server fetch failed x-request-id=${requestId}`
    : "Server fetch failed";
}
