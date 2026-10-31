// src/frontend/shared/utils/logger.ts
import * as Sentry from "@sentry/nextjs";

import { ApiError } from "@/shared/types";

export const logger = {
  /**
   * Reports a failure: to the console, which the server's log shipping and a
   * developer's devtools read, and to Sentry, which is the only place a
   * failure in a visitor's browser is ever seen.
   *
   * Capturing here is safe on paths that also capture: Sentry marks an
   * exception object once it is sent and skips it after, so an error that
   * `handleServerError` logs and `withServerErrorState` then captures is one
   * event.
   *
   * @param error - the failure, ideally the thrown object itself so Sentry
   * keeps its stack
   * @param context - where it happened; the console line's prefix, and a
   * `logger` context on the Sentry event
   */
  error: (error: unknown, context?: string): void => {
    if (context) console.error(`[${context}]`, error);
    else console.error(error);
    // The backend's id as a tag, so `request_id:<id>` in Sentry and
    // `req_id="<id>"` in Loki find the same request.
    const requestId = error instanceof ApiError ? error.requestId : undefined;
    Sentry.captureException(error, {
      contexts: context ? { logger: { context } } : undefined,
      tags: requestId ? { request_id: requestId } : undefined,
    });
  },
  /**
   * A recoverable-but-unusual condition (e.g. a centroid that could not be
   * computed) that is not a failure. Console only.
   *
   * @param message - what happened
   * @param details - anything that explains it
   */
  warn: (message: string, ...details: unknown[]): void => {
    if (details.length > 0) console.warn(message, ...details);
    else console.warn(message);
  },
};
