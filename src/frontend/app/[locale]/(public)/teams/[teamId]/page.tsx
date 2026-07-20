// src/frontend/app/[locale]/(public)/teams/[teamId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TeamShotChart } from "@/features/charts/components";
import { serverMatchesService } from "@/features/matches/api";
import { serverTeamsService } from "@/features/teams/api";
import {
  TeamHeader,
  TeamInfo,
  TeamMatchHistoryTable,
  TeamRoster,
} from "@/features/teams/components";
import { aggregateTeamStats, buildTeamRoster } from "@/features/teams/utils";
import { PageLayout } from "@/shared/components/layout";
import { handleServerError } from "@/shared/utils";

interface TeamDetailPageProps {
  readonly params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { teamId: teamIdStr, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "teams" });

  const teamId = Number.parseInt(teamIdStr, 10);
  if (Number.isNaN(teamId) || teamId <= 0) {
    notFound();
  }

  const [team, matches, matchEvents] = await Promise.all([
    serverTeamsService.getById(teamId),
    serverTeamsService.getMatches(teamId),
    serverMatchesService.getEventsByTeamId(teamId),
  ]).catch(handleServerError);

  // Calculate team season stats from all players
  const teamStats = aggregateTeamStats(teamId, matches);

  const rosterPlayers = buildTeamRoster(matches, teamId);

  return (
    <PageLayout>
      {/* Team Header */}
      <TeamHeader team={team} />

      {/* Team Stats */}
      <TeamInfo stats={teamStats} />

      {/* Roster */}
      <TeamRoster players={rosterPlayers} />

      {/* Match History */}
      <TeamMatchHistoryTable team={team} matches={matches} maxRows={5} />

      {/* Team Shot Chart Heatmap */}
      <TeamShotChart
        matchEvents={matchEvents}
        title={t("teamDetail.shotchartTitle")}
        description={t("teamDetail.shotchartDescription")}
        isLoading={false}
        error={null}
      />
    </PageLayout>
  );
}
