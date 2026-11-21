// src/frontend/app/[locale]/(chrome)/architecture/page.tsx
import { Layers } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  SystemArchitecture,
  TechStacks,
} from "@/features/site/architecture/components";
import { PageHero, PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";

/**
 * Metadata for the architecture page.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "landing" });

  return {
    title: tMeta("architecture.title"),
    description: tMeta("architecture.subtitle"),
  };
}

/**
 * The architecture page: the stack, the diagram of a page request and of the
 * match data, and three facts about how it runs.
 *
 * `params` is a Promise in Next 15 and is awaited here, so the feature
 * components below receive plain values.
 */
export default async function ArchitecturePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  return (
    <PageLayout>
      <PageHero
        title={t("architecture.title")}
        lead={t("architecture.subtitle")}
        icon={Layers}
      />

      <TechStacks />
      <SystemArchitecture />
    </PageLayout>
  );
}
