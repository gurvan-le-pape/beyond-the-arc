// src/frontend/app/[locale]/(chrome)/not-found.tsx
"use client";

import { RouteNotFound } from "@/shared/components/feedback";

/**
 * Rendered when a chrome route calls `notFound()` — an unknown match,
 * championship, player, team, club, committee or league id. It renders inside
 * `(chrome)/layout.tsx`, so the header, footer and page background survive.
 * Before this existed those calls fell through to Next's built-in 404, which
 * has none of them, nor translations.
 *
 * Scope: everything under `(chrome)`. A URL that matches no route at all gets
 * here too, since `[...rest]/page.tsx` catches it and calls `notFound()` — a
 * boundary alone never covers those, because Next renders it when a route
 * *calls* `notFound()` and an unknown URL enters no route. What is left over is
 * paths the middleware skips, anything with a dot per its matcher: they carry
 * no locale, so they have neither a translation nor the message provider and
 * still land on Next's built-in page.
 *
 * The 404 itself lives in `RouteNotFound`, shared with the `(fullscreen)`
 * boundary — including the reason it must stay a client component.
 */
export default function NotFound() {
  return <RouteNotFound />;
}
