// src/frontend/app/[locale]/(public)/organizations/clubs/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ClubsView } from "@/features/organizations/clubs/components";
import { TitleSection } from "@/features/organizations/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";

export const revalidate = 86400;
export const dynamic = "force-dynamic";

/**
 * Clubs Page
 * Shows all clubs
 * Strategy: ISR with 24-hour revalidation
 */
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
