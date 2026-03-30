// src/frontend/app/[locale]/(public)/clubs/league/[leagueId]/committee/[committeeId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  ClubsGrid,
  MapViewButton,
  TitleSection,
} from "@/features/organizations/clubs/components";
import { getBreadcrumbItems } from "@/features/organizations/clubs/utils";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";
import { handleServerError } from "@/shared/utils/handleServerError";

interface ClubsPageProps {
  readonly params: Promise<{
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
    Number.isNaN(leagueId) ||
    leagueId <= 0 ||
    Number.isNaN(committeeId) ||
    committeeId <= 0
  ) {
    notFound();
  }

  const [clubs, committee, league] = await Promise.all([
    serverClubsService.getAll({ committeeId }),
    serverCommitteesService.getById(committeeId),
    serverLeaguesService.getById(leagueId),
  ]).catch(handleServerError);

  const breadcrumbItems = getBreadcrumbItems(
    { league, committee },
    { france: t("france") },
  );

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
