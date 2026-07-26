// src/frontend/app/[locale]/(chrome)/(public)/championships/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ChampionshipLevelTabs } from "@/features/competitions/championships/components";
import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "competitions" });

  return { title: t("title"), description: t("description") };
}

export default async function ChampionshipsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "competitions" });

  return (
    <PageLayout>
      {/* The tabs carry the page identity visually; the heading exists so the
          document does not start at level 2 for a screen reader. */}
      <Text variant="pageTitle" className="sr-only">
        {t("title")}
      </Text>

      <ChampionshipLevelTabs />
    </PageLayout>
  );
}
