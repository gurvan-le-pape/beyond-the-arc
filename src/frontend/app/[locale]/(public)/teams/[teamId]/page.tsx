// src/frontend/app/[locale]/(public)/teams/[teamId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { serverMatchesService } from "@/features/matches/api";
import type { MatchEvent } from "@/features/matches/types";
import type { PlayerMatchHistoryEntry } from "@/features/players/types/PlayerMatchHistory";
import { serverTeamsService } from "@/features/teams/api";
import { TeamHeader, TeamInfo, TeamRoster } from "@/features/teams/components";
import { TeamMatchHistoryTable } from "@/features/teams/components/detail/TeamMatchHistoryTable";
import type { TeamDetail } from "@/features/teams/types/TeamDetail";
import type { TeamMatchHistory } from "@/features/teams/types/TeamMatchHistory";
import { TeamShotChart } from "@/shared/components/charts";
import { Footer, Header } from "@/shared/components/layouts";

interface TeamDetailPageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { teamId: teamIdStr, locale } = await params;
  const t = await getTranslations({ locale, namespace: "teams" });

  const teamId = Number.parseInt(teamIdStr, 10);
  if (Number.isNaN(teamId) || teamId <= 0) {
    notFound();
  }

  let team: TeamDetail, matches: TeamMatchHistory[], matchEvents: MatchEvent[];

  try {
    team = await serverTeamsService.getById(teamId);
    if (!team) {
      notFound();
    }

    [matches, matchEvents] = await Promise.all([
      serverTeamsService.getMatches(teamId),
      serverMatchesService.getEventsByTeamId(teamId),
    ]);
  } catch (error) {
    console.error(`Error fetching team ${teamId}:`, error);
    notFound();
  }

  // Calculate team season stats from all players
  const teamStats = team.players?.reduce(
    (
      acc: {
        totalGames: number;
        players: number;
        points: number;
        rebounds: number;
        assists: number;
        steals: number;
        blocks: number;
      },
      player: any,
    ) => {
      const playerTotals = player.stats?.reduce(
        (pAcc: any, stat: any) => ({
          gamesPlayed: pAcc.gamesPlayed + 1,
          points: pAcc.points + stat.points,
          rebounds:
            pAcc.rebounds + (stat.reboundsOffensive + stat.reboundsDefensive),
          assists: pAcc.assists + stat.assists,
          steals: pAcc.steals + stat.steals,
          blocks: pAcc.blocks + stat.blocks,
        }),
        {
          gamesPlayed: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
        },
      );
      return {
        totalGames: Math.max(acc.totalGames, playerTotals?.gamesPlayed || 0),
        players: acc.players + 1,
        points: acc.points + (playerTotals?.points || 0),
        rebounds: acc.rebounds + (playerTotals?.rebounds || 0),
        assists: acc.assists + (playerTotals?.assists || 0),
        steals: acc.steals + (playerTotals?.steals || 0),
        blocks: acc.blocks + (playerTotals?.blocks || 0),
      };
    },
    {
      totalGames: 0,
      players: 0,
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
    },
  ) ?? {
    totalGames: 0,
    players: 0,
    points: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
  };

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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8" role="main">
        <div className="max-w-7xl mx-auto space-y-6">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Revalidate every hour (team stats may update)
export const revalidate = 3600;
