// src/frontend/shared/utils/parseRouteId.ts
import { notFound } from "next/navigation";

/**
 * Parses a dynamic route segment into a positive integer id.
 *
 * Triggers Next's `notFound()` (which throws) for non-numeric or non-positive
 * values, so callers can treat the returned value as a guaranteed-valid id.
 */
export function parseRouteId(idStr: string): number {
  const id = Number.parseInt(idStr, 10);
  if (Number.isNaN(id) || id <= 0) notFound();
  return id;
}
