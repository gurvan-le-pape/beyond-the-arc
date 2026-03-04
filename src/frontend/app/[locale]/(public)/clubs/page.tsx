// src/frontend/app/[locale]/(public)/clubs/page.tsx
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  Breadcrumb,
  MapViewButton,
  RegionsGrid,
  TitleSection,
} from "@/features/organizations/clubs/components";
import { Footer, Header } from "@/shared/components/layouts";
import { ViewLevel } from "@/shared/constants/view-levels";

/**
 * Clubs Regions Page (League List)
 * Shows ~25 regional leagues
 * Strategy: SSG with daily revalidation
 */
export default async function ClubsRegionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clubs" });

  const regions = await serverClubsService.getStatsByRegion().catch((error) => {
    console.error("Error fetching regions:", error);
    return [];
  });

  const breadcrumbItems = [
    {
      label: t("france"),
      current: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <MapViewButton label={t("mapView")} />

          <Breadcrumb items={breadcrumbItems} />

          <TitleSection
            viewLevel={ViewLevel.REGION}
            selectedLeague={null}
            selectedCommittee={null}
          />

          <RegionsGrid regions={regions} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Revalidate once per day (leagues rarely change)
export const revalidate = 86400;
