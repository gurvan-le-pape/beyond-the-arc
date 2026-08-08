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
 */
export function handleServerError(error: unknown): never {
  if (error instanceof ApiError && error.statusCode === 404) notFound();

  logger.error(error, "Server fetch failed");
  throw error;
}
