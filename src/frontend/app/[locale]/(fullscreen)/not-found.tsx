// src/frontend/app/[locale]/(fullscreen)/not-found.tsx
"use client";

import { RouteNotFound } from "@/shared/components/feedback";

/**
 * Boundary for the full-viewport routes. Sibling route groups do not share
 * boundaries, so without this a `notFound()` under `/map` would skip the
 * `(chrome)` one next door and land on Next's built-in page — no header, no
 * translations — exactly the gap `(fullscreen)/error.tsx` exists to close for
 * errors.
 *
 * Nothing under `(fullscreen)` calls `notFound()` today. This is here so the
 * group cannot quietly lose the styled 404 the moment something does.
 */
export default function FullscreenNotFound() {
  return <RouteNotFound />;
}
