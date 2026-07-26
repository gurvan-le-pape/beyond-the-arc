// src/frontend/app/[locale]/(chrome)/not-found.tsx
"use client";

import { useTranslations } from "next-intl";

import { ErrorCard } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";

/**
 * Rendered when a page calls `notFound()` — an unknown match, championship,
 * player, team, club, committee or league id. Before this existed those calls
 * fell through to Next's built-in 404, which has no header, footer, surface
 * or translations.
 *
 * **A client component on purpose.** Next renders this boundary while
 * generating a route's static shell, so it runs in a static context, where
 * `getTranslations()` falls back to `headers()` and throws. The first version
 * of this file was an async server component and took every route carrying
 * `revalidate` down with it — a 500 on each detail page, whether or not the id
 * existed. `useTranslations` reads from the provider and needs no request.
 *
 * Scope: `notFound()` inside the chrome routes. A URL that matches no route at
 * all is still Next's built-in page, because the boundary for those is
 * `app/not-found.tsx`, which sits outside `[locale]` and so has neither a
 * locale nor the message provider the chrome needs.
 */
export default function NotFound() {
  const t = useTranslations("common");

  return (
    <PageLayout centered>
      <ErrorCard
        title={t("errors.notFound")}
        description={t("errors.notFoundDescription")}
        link={{ label: t("backToHome"), href: "/" }}
      />
    </PageLayout>
  );
}
