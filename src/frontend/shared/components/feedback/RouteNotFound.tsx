// src/frontend/shared/components/feedback/RouteNotFound.tsx
"use client";

import { useTranslations } from "next-intl";

import { PageLayout } from "@/shared/components/layout";

import { ErrorCard } from "./ErrorCard";

/**
 * Body shared by every `not-found.tsx` in the app: the translated 404 card and
 * the way out of it, rendered inside whichever route-group layout sits above.
 *
 * **A client component on purpose.** Next renders a not-found boundary while
 * generating a route's static shell, so it runs in a static context, where
 * `getTranslations()` falls back to `headers()` and throws. The first version
 * of this UI was an async server component and took every route carrying
 * `revalidate` down with it — a 500 on each detail page, whether or not the id
 * existed. `useTranslations` reads from the provider and needs no request.
 *
 * Each route group still needs its own `not-found.tsx` pointing here: Next only
 * applies the nearest one, and sibling groups do not share boundaries.
 */
export function RouteNotFound() {
  const tCommon = useTranslations("common");

  return (
    <PageLayout centered>
      <ErrorCard
        tone="neutral"
        title={tCommon("errors.notFound")}
        description={tCommon("errors.notFoundDescription")}
        link={{ label: tCommon("backToHome"), href: "/" }}
      />
    </PageLayout>
  );
}

export default RouteNotFound;
