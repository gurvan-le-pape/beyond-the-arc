// src/frontend/app/[locale]/(public)/clubs/league/[leagueId]/committee/[committeeId]/club/[clubId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  ClubHeader,
  ClubInfo,
  ClubTeams,
} from "@/features/organizations/clubs/components";
import type { ClubTeamInfo } from "@/features/organizations/clubs/types/ClubDetailed";
import { getBreadcrumbItems } from "@/features/organizations/clubs/utils";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import type { Gender } from "@/shared/constants";
import { handleServerError } from "@/shared/utils/handleServerError";
import { groupTeamsByGender } from "@/shared/utils/helpers/team-helpers";

interface ClubPageProps {
  readonly params: Promise<{
    locale: string;
    leagueId: string;
    committeeId: string;
    clubId: string;
  }>;
}

/**
 * Club Detail Page
 * Shows individual club information and teams
 * Path: /clubs/league/[leagueId]/committee/[committeeId]/club/[clubId]
 * Strategy: ISR with hourly revalidation
 */

// Don't pre-build - too many clubs (25,000+)
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

export default async function ClubPage({ params }: ClubPageProps) {
  const {
    leagueId: leagueIdStr,
    committeeId: committeeIdStr,
    clubId: clubIdStr,
    locale,
  } = await params;
  const t = await getTranslations({ locale, namespace: "clubs" });

  const leagueId = Number.parseInt(leagueIdStr, 10);
  const committeeId = Number.parseInt(committeeIdStr, 10);
  const clubId = Number.parseInt(clubIdStr, 10);

  if (
    Number.isNaN(leagueId) ||
    leagueId <= 0 ||
    Number.isNaN(committeeId) ||
    committeeId <= 0 ||
    Number.isNaN(clubId) ||
    clubId <= 0
  ) {
    notFound();
  }

  const [club, committee, league] = await Promise.all([
    serverClubsService.getById(clubId),
    serverCommitteesService.getById(committeeId),
    serverLeaguesService.getById(leagueId),
  ]).catch(handleServerError);

  const teamsByGender: Record<Gender, ClubTeamInfo[]> =
    club.teams && club.teams.length > 0
      ? groupTeamsByGender(club.teams)
      : ({} as Record<Gender, ClubTeamInfo[]>);

  const breadcrumbItems = getBreadcrumbItems(
    { league, committee, club },
    { france: t("france") },
  );

  return (
    <PageLayout ariaLabel={t("detail.page", { clubName: club.name })}>
      <Breadcrumb items={breadcrumbItems} />
      <ClubHeader club={club} />
      <ClubInfo club={club} />
      <ClubTeams club={club} teamsByGender={teamsByGender} />
    </PageLayout>
  );
}
