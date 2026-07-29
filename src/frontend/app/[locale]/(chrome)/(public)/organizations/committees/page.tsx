// src/frontend/app/[locale]/(chrome)/(public)/organizations/committees/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverCommitteesService } from "@/features/organizations/committees/api";
import { CommitteesGrid } from "@/features/organizations/committees/components";
import { TitleSection } from "@/features/organizations/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Rendered per request: the image build has no backend to prerender against.
// The committee list itself is cached for 24h by fetchApi, so a render here is
// a cache read, not a query.
export const dynamic = "force-dynamic";

/**
 * Committees Page
 * Shows all departmental committees
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return {
    title: tMeta("committees.label"),
    description: tMeta("committees.description"),
  };
}

export default async function CommitteesPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  const committees = await serverCommitteesService
    .getAll()
    .catch(handleServerError);

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("breadcrumb"), href: "/organizations" },
          { label: t("committees.label"), current: true },
        ]}
      />
      <TitleSection viewLevel={ViewLevel.DEPARTMENT} />
      <CommitteesGrid committees={committees} />
    </PageLayout>
  );
}
