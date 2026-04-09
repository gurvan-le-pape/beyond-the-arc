// src/frontend/app/[locale]/(public)/organizations/leagues/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  RegionsGrid,
  TitleSection,
} from "@/features/organizations/clubs/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants/view-levels";

interface ClubsRegionsPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

export const revalidate = 86400;
// Prevent build-time rendering, but allow ISR at runtime
export const dynamic = "force-dynamic";

/** Clubs Leagues Page
 * Shows ~25 regional leagues
 * Strategy: ISR with 24-hour revalidation
 */
export default async function ClubsRegionsPage({
  params,
}: ClubsRegionsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  const regions = await serverClubsService.getStatsByRegion();

  const breadcrumbItems = [
    { label: t("breadcrumb"), href: "/organizations" },
    { label: t("leagues.label"), current: true },
  ];

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />

      <TitleSection
        viewLevel={ViewLevel.REGION}
        selectedLeague={null}
        selectedCommittee={null}
      />

      <RegionsGrid regions={regions} />
    </PageLayout>
  );
}
