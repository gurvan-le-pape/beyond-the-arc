// src/frontend/app/[locale]/(chrome)/(public)/championships/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ChampionshipLevelTabs } from "@/features/competitions/championships/components";
import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";

/**
 * Metadata for the championships listing.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "competitions" });

  return { title: t("title"), description: t("description") };
}

/**
 * The championships listing, split into national, regional and departmental tabs.
 *
 * `params` is a Promise in Next 15 and is awaited here, so the feature
 * components below receive plain values. The active tab lives in `?tab=`, so it survives a reload and can be linked to.
 */
export default async function ChampionshipsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "competitions" });

  return (
    <PageLayout>
      {/* The header's active section names the page, and the tabs start it;
          the heading exists so the document does not start at level 2 for a
          screen reader. It shares a wrapper with the tabs so it takes no slot
          in the column's spacing, and the tabs start where content starts on
          every other page. */}
      <div>
        <Text variant="pageTitle" className="sr-only">
          {t("title")}
        </Text>
        <ChampionshipLevelTabs />
      </div>
    </PageLayout>
  );
}
