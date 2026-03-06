// src/frontend/app/[locale]/(public)/players/[playerId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { serverMatchesService } from "@/features/matches/api";
import { serverPlayersService } from "@/features/players/api";
import {
  PlayerCareerStats,
  PlayerComparison,
  PlayerHeader,
  PlayerMatchHistoryTable,
} from "@/features/players/components";
import type { Player } from "@/features/players/types/Player";
import type { PlayerMatchHistory } from "@/features/players/types/PlayerMatchHistory";
import { aggregateStats } from "@/features/players/utils/statsAggregation";
import { transformToShotEvents } from "@/features/players/utils/transformShotEvents";
import { PlayerShotChart } from "@/shared/components/charts";
import { Footer, Header } from "@/shared/components/layouts";

interface PlayerDetailPageProps {
  params: Promise<{
    locale: string;
    playerId: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { playerId: playerIdStr, locale } = await params;
  const tPlayers = await getTranslations({ locale, namespace: "players" });

  const playerId = Number.parseInt(playerIdStr, 10);
  if (Number.isNaN(playerId) || playerId <= 0) {
    notFound();
  }

  let player: Player;
  let matches: PlayerMatchHistory[];

  try {
    player = await serverPlayersService.getById(playerId);
    if (!player) notFound();

    const [matchesData, rawEvents] = await Promise.all([
      serverPlayersService.getMatches(playerId),
      serverMatchesService.getEventsByPlayerId(playerId),
    ]);

    matches = matchesData;
    const shotEvents = transformToShotEvents(rawEvents);
    const playerCareerStats = aggregateStats(
      matches.map((m) => m.player.stats),
    );

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8" role="main">
          <div className="max-w-7xl mx-auto space-y-6">
            <PlayerHeader player={player} />
            <PlayerCareerStats stats={playerCareerStats} />
            <PlayerMatchHistoryTable
              player={player}
              matches={matches}
              maxRows={5}
            />
            <PlayerComparison player={player} />
            <PlayerShotChart
              shots={shotEvents}
              title={tPlayers("playerDetail.shotchartTitle")}
              description={tPlayers("playerDetail.shotchartDescription")}
              isLoading={false}
              error={null}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error(`Error fetching player ${playerId}:`, error);
    notFound();
  }
}
