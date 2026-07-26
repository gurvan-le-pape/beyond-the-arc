// src/frontend/app/[locale]/(chrome)/(public)/search/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SearchTabs } from "@/features/search/components";
import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });

  return { title: t("title"), description: t("description") };
}

export default async function SearchPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "search" });

  return (
    <PageLayout>
      {/* The tabs carry the page identity visually; the heading exists so the
          document does not start at level 2 for a screen reader. */}
      <Text variant="pageTitle" className="sr-only">
        {t("title")}
      </Text>

      <SearchTabs />
    </PageLayout>
  );
}
