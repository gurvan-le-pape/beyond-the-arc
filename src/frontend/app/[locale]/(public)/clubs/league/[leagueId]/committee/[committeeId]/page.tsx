// src/frontend/app/[locale]/(public)/clubs/league/[leagueId]/committee/[committeeId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  Breadcrumb,
  ClubsGrid,
  MapViewButton,
  TitleSection,
} from "@/features/organizations/clubs/components";
import { getBreadcrumbItems } from "@/features/organizations/clubs/utils";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { Footer, Header } from "@/shared/components/layouts";
import { ViewLevel } from "@/shared/constants";

interface ClubsPageProps {
  params: Promise<{
    locale: string;
    leagueId: string;
    committeeId: string;
  }>;
}

/**
 * Clubs Page (Clubs List in Committee)
 * Shows ~100 clubs per committee
 * Path: /clubs/league/[leagueId]/committee/[committeeId]
 * Strategy: ISR with hourly revalidation
 */

// Don't pre-build - generate on first visit
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

export default async function ClubsPage({ params }: ClubsPageProps) {
  const {
    leagueId: leagueIdStr,
    committeeId: committeeIdStr,
    locale,
  } = await params;
  const t = await getTranslations({ locale, namespace: "clubs" });

  const leagueId = Number.parseInt(leagueIdStr, 10);
  const committeeId = Number.parseInt(committeeIdStr, 10);

  if (
    isNaN(leagueId) ||
    leagueId <= 0 ||
    isNaN(committeeId) ||
    committeeId <= 0
  ) {
    notFound();
  }

  let clubs, committee, league;

  try {
    [clubs, committee, league] = await Promise.all([
      serverClubsService.getAll({ committeeId: committeeId }),
      serverCommitteesService.getById(committeeId),
      serverLeaguesService.getById(leagueId),
    ]);

    if (!clubs || clubs.length === 0) {
      notFound();
    }
  } catch (error) {
    console.error(
      `Error fetching clubs for league ${leagueId}, committee ${committeeId}:`,
      error,
    );
    notFound();
  }

  const breadcrumbItems = getBreadcrumbItems(
    { league, committee },
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
            viewLevel={ViewLevel.CLUBS}
            selectedLeague={league}
            selectedCommittee={committee}
          />

          <ClubsGrid
            clubs={clubs}
            leagueId={league.id}
            committeeId={committee.id}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
