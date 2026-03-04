// src/frontend/app/[locale]/(public)/matches/[matchId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { serverMatchesService } from "@/features/matches/api";
import {
  MatchEvents,
  MatchScoreCard,
  PlayerMatchStats,
  TeamStatsComparison,
} from "@/features/matches/components";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/matches/components/detail/Tabs";
import type {
  MatchEvent,
  MatchEventPlayer,
} from "@/features/matches/types/MatchEvent";
import { buildTeam } from "@/features/matches/utils/buildTeam";
import { Footer, Header } from "@/shared/components/layouts";
import { Role } from "@/shared/constants";

interface MatchSummaryPageProps {
  params: Promise<{
    locale: string;
    matchId: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function MatchSummaryPage({
  params,
}: MatchSummaryPageProps) {
  const { matchId: matchIdStr, locale } = await params;
  const tMatches = await getTranslations({ locale, namespace: "matches" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const matchId = Number.parseInt(matchIdStr, 10);
  if (isNaN(matchId) || matchId <= 0) {
    notFound();
  }

  let match, playerMatchStats;

  try {
    match = await serverMatchesService.getById(matchId);
    if (!match) {
      notFound();
    }

    playerMatchStats = await serverMatchesService.getPlayerStatsByMatchId(
      matchId,
    );
  } catch (error) {
    console.error(`Error fetching match ${matchId}:`, error);
    notFound();
  }

  const { homeTeamId, awayTeamId, stats } = playerMatchStats;
  const homeTeam = buildTeam(stats, homeTeamId);
  const awayTeam = buildTeam(stats, awayTeamId);

  if (!homeTeam || !awayTeam) {
    notFound();
  }

  // Extract shot events per player
  const shotEventsByPlayer: Record<number, MatchEvent[]> = {};
  for (const event of match.matchEvents) {
    const shooterObj = event.players?.find(
      (p: MatchEventPlayer) => p.role === Role.SHOOTER,
    );
    if (
      event.shotLocation !== null &&
      shooterObj &&
      shooterObj.player?.id !== null
    ) {
      const playerId = shooterObj.player.id;
      if (!shotEventsByPlayer[playerId]) shotEventsByPlayer[playerId] = [];
      shotEventsByPlayer[playerId].push(event);
    }
  }

  const statCategories = [
    { key: "fieldGoals", label: tCommon("stats.fieldGoals") },
    { key: "threePointers", label: tCommon("stats.threePointers") },
    { key: "freeThrows", label: tCommon("stats.freeThrows") },
    { key: "reboundsTotal", label: tCommon("stats.reboundsTotal") },
    { key: "reboundsOffensive", label: tCommon("stats.reboundsOffensive") },
    { key: "reboundsDefensive", label: tCommon("stats.reboundsDefensive") },
    { key: "assists", label: tCommon("stats.assists") },
    { key: "blocks", label: tCommon("stats.blocks") },
    { key: "steals", label: tCommon("stats.steals") },
    { key: "turnovers", label: tCommon("stats.turnovers") },
    { key: "pointsInPaint", label: tCommon("stats.pointsInPaint") },
    { key: "fouls", label: tCommon("stats.fouls") },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-title md:text-display font-bold text-primary-600 dark:text-primary-400">
            {tMatches("matchSummary.title")}
          </h1>

          <MatchScoreCard homeTeam={homeTeam} awayTeam={awayTeam} />

          <Tabs defaultValue="stats">
            <TabsList>
              <TabsTrigger value="stats">
                {tMatches("matchSummary.tabs.teamStats")}
              </TabsTrigger>
              <TabsTrigger value="home">{homeTeam.name}</TabsTrigger>
              <TabsTrigger value="away">{awayTeam.name}</TabsTrigger>
              <TabsTrigger value="events">
                {tMatches("matchSummary.tabs.matchEvents")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <TeamStatsComparison
                homeStats={homeTeam.stats}
                awayStats={awayTeam.stats}
                categories={statCategories}
                title={tMatches("matchSummary.teamMatchStatsTitle")}
              />
            </TabsContent>

            <TabsContent value="home">
              <PlayerMatchStats
                team={homeTeam}
                isHomeTeam={true}
                opponent={awayTeam}
                playerShots={shotEventsByPlayer}
              />
            </TabsContent>

            <TabsContent value="away">
              <PlayerMatchStats
                team={awayTeam}
                isHomeTeam={false}
                opponent={homeTeam}
                playerShots={shotEventsByPlayer}
              />
            </TabsContent>

            <TabsContent value="events">
              <MatchEvents
                events={match.matchEvents}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const revalidate = false;
