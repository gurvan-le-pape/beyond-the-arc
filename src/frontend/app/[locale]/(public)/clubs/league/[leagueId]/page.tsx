// src/frontend/app/[locale]/(public)/clubs/league/[leagueId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  Breadcrumb,
  DepartmentsGrid,
  MapViewButton,
  TitleSection,
} from "@/features/organizations/clubs/components";
import { getBreadcrumbItems } from "@/features/organizations/clubs/utils";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { Footer, Header } from "@/shared/components/layouts";
import { ViewLevel } from "@/shared/constants";

interface ClubsCommitteesPageProps {
  params: Promise<{
    locale: string;
    leagueId: string;
  }>;
}

/**
 * Clubs Committees Page (Departments List)
 * Shows ~10 committees per league
 * Path: /clubs/league/[leagueId]
 * Strategy: ISR with hourly revalidation
 */

// Don't pre-build - generate on first visit
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

export default async function ClubsCommitteesPage({
  params,
}: ClubsCommitteesPageProps) {
  const { leagueId: leagueIdStr, locale } = await params;

  const t = await getTranslations({ locale, namespace: "clubs" });

  const leagueId = Number.parseInt(leagueIdStr, 10);

  if (isNaN(leagueId) || leagueId <= 0) {
    notFound();
  }

  let league, departments;

  try {
    [league, departments] = await Promise.all([
      serverLeaguesService.getById(leagueId),
      serverClubsService.getStatsByDepartment(leagueId),
    ]);

    if (!league) {
      notFound();
    }
  } catch (error) {
    console.error(`Error fetching committees for league ${leagueId}:`, error);
    notFound();
  }

  const breadcrumbItems = getBreadcrumbItems(
    { league },
    { france: t("france") },
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <MapViewButton label={t("mapView")} />

          <Breadcrumb items={breadcrumbItems} />

          <TitleSection
            viewLevel={ViewLevel.DEPARTMENT}
            selectedLeague={league}
            selectedCommittee={null}
          />

          <DepartmentsGrid departments={departments} leagueId={league.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
