// src/frontend/app/[locale]/(chrome)/[...rest]/page.tsx
import { notFound } from "next/navigation";

/**
 * Catches every URL under `[locale]` that matches no real route, so it reaches
 * `(chrome)/not-found.tsx` — with the header, footer and translations — instead
 * of Next's built-in 404.
 *
 * A `not-found.tsx` alone does not cover this: Next renders it when a route
 * *calls* `notFound()`, and an unknown URL never enters a route at all. This
 * catch-all is next-intl's documented answer to that gap.
 *
 * Concrete routes always win over a catch-all, so nothing that exists is
 * shadowed. Requests the middleware never matches — anything with a dot in the
 * path, per its matcher — still land on Next's built-in page, since they have
 * no locale to render a translated one with.
 */
export default function CatchAllPage() {
  notFound();
}
