// src/frontend/app/[locale]/(chrome)/(public)/organizations/clubs/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ClubsView } from "@/features/organizations/clubs/components";
import { TitleSection } from "@/features/organizations/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";

/**
 * Clubs Page
 * Shows all clubs
 *
 * Fetches nothing server-side — ClubsView is a client component on TanStack
 * Query — so the shell is static and needs no caching directives.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return {
    title: tMeta("clubs.label"),
    description: tMeta("clubs.description"),
  };
}

export default async function ClubsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("breadcrumb"), href: "/organizations" },
          { label: t("clubs.label"), current: true },
        ]}
      />
      <TitleSection
        viewLevel={ViewLevel.CLUBS}
        selectedLeague={null}
        selectedCommittee={null}
      />
      <ClubsView />
    </PageLayout>
  );
}
