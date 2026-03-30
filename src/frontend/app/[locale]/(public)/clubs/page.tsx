// src/frontend/app/[locale]/(public)/clubs/page.tsx
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  MapViewButton,
  RegionsGrid,
  TitleSection,
} from "@/features/organizations/clubs/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants/view-levels";

interface ClubsRegionsPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

/**
 * Clubs Regions Page (League List)
 * Shows ~25 regional leagues
 * Strategy: SSG with daily revalidation
 */
export default async function ClubsRegionsPage({
  params,
}: ClubsRegionsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clubs" });

  const regions = await serverClubsService.getStatsByRegion();

  const breadcrumbItems = [
    {
      label: t("france"),
      current: true,
    },
  ];

  return (
    <PageLayout>
      <MapViewButton label={t("mapView")} />

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

// Revalidate once per day (leagues rarely change)
export const revalidate = 86400;
