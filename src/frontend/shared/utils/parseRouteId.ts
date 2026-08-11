// src/frontend/shared/utils/parseRouteId.ts
import { notFound } from "next/navigation";

/**
 * PostgreSQL `int4` upper bound. Every `@id` in `schema.prisma` is a Prisma
 * `Int`, so an id above this cannot identify a row.
 *
 * This mirrors `MAX_ENTITY_ID` in the backend's `ParseEntityIdPipe` on purpose:
 * there is no mechanism for sharing a constant across the two applications, and
 * the two guards have to agree or one of them decides the status code. Change
 * both together.
 */
const MAX_ROUTE_ID = 2_147_483_647;

/**
 * Parses a dynamic route segment into a positive integer id.
 *
 * Triggers Next's `notFound()` (which throws) for non-numeric, non-positive or
 * out-of-range values, so callers can treat the returned value as a
 * guaranteed-valid id.
 *
 * The upper bound is what keeps an unroutable id a 404 rather than a 500. The
 * backend answers 400 for these (`ParseEntityIdPipe`, added in #443), and
 * `handleServerError` maps only 404 to the not-found boundary — so without this
 * check `/players/2147483648` rendered the error boundary and reported a
 * Sentry event for what is just a bad URL.
 */
export function parseRouteId(idStr: string): number {
  const id = Number.parseInt(idStr, 10);
  if (Number.isNaN(id) || id <= 0 || id > MAX_ROUTE_ID) notFound();
  return id;
}
