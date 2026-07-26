// src/frontend/app/[locale]/(chrome)/not-found.tsx
import { getTranslations } from "next-intl/server";

import { ErrorCard } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";

/**
 * Rendered when a page calls `notFound()` — an unknown match, championship,
 * player, team, club, committee or league id. Until this existed those calls
 * fell through to Next's built-in 404, which has no header, footer, surface
 * or translations.
 *
 * Scope: `notFound()` inside the chrome routes. A URL that matches no route at
 * all is still Next's built-in page, because the boundary for those is
 * `app/not-found.tsx`, which sits outside `[locale]` and so has neither a
 * locale nor the message provider the chrome needs.
 */
export default async function NotFound() {
  const t = await getTranslations("common");

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
