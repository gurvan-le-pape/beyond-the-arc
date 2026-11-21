// src/frontend/app/[locale]/(chrome)/docs/page.tsx
"use client";

import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import { DocsChapters, DocsQuickLinks } from "@/features/site/docs/components";
import { PageHero, PageLayout } from "@/shared/components/layout";

/**
 * The documentation page: quick links and the collapsible chapters.
 *
 * A **client component**, so its metadata lives in the sibling `layout.tsx`: a
 * client component cannot export `generateMetadata`.
 */
export default function DocsPage() {
  const t = useTranslations("landing");

  return (
    <PageLayout>
      <PageHero
        title={t("docs.title")}
        lead={t("docs.intro")}
        icon={BookOpen}
      />

      <DocsQuickLinks />
      <DocsChapters />
    </PageLayout>
  );
}
