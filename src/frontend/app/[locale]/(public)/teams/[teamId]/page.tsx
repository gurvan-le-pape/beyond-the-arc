// src/frontend/app/[locale]/(public)/teams/[teamId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverMatchesService } from "@/features/matches/api";
import type { PlayerMatchHistoryEntry } from "@/features/players/types/PlayerMatchHistory";
import { serverTeamsService } from "@/features/teams/api";
import { TeamHeader, TeamInfo, TeamRoster } from "@/features/teams/components";
import { TeamMatchHistoryTable } from "@/features/teams/components/detail/TeamMatchHistoryTable";
import { aggregateTeamStats } from "@/features/teams/utils/statsAggregation";
import { TeamShotChart } from "@/shared/components/charts";
import { PageLayout } from "@/shared/components/layout";
import { handleServerError } from "@/shared/utils/handleServerError";

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

  const rosterPlayers: PlayerMatchHistoryEntry[][] = Object.values(
    matches.reduce<Record<number, PlayerMatchHistoryEntry[]>>((acc, match) => {
      match.players
        .filter((p) => p.player.teamId === teamId)
        .forEach((p) => {
          if (!acc[p.player.id]) acc[p.player.id] = [];
          acc[p.player.id].push(p);
        });
      return acc;
    }, {}),
  );

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
