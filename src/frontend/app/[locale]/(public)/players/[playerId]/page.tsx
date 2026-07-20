// src/frontend/app/[locale]/(public)/players/[playerId]/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PlayerShotChart } from "@/features/charts/components";
import { serverMatchesService } from "@/features/matches/api";
import { serverPlayersService } from "@/features/players/api";
import {
  PlayerCareerStats,
  PlayerComparison,
  PlayerHeader,
  PlayerMatchHistoryTable,
} from "@/features/players/components";
import { PageLayout } from "@/shared/components/layout";
import { handleServerError, parseRouteId } from "@/shared/utils";

interface PlayerDetailPageProps {
  readonly params: Promise<{
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
  setRequestLocale(locale);
  const tPlayers = await getTranslations({ locale, namespace: "players" });

  const playerId = parseRouteId(playerIdStr);

  const [player, matchHistory, matchEvents] = await Promise.all([
    serverPlayersService.getById(playerId),
    serverPlayersService.getMatches(playerId),
    serverMatchesService.getEventsByPlayerId(playerId),
  ]).catch(handleServerError);

  const { matches, career } = matchHistory;

  return (
    <PageLayout>
      {/* Player Header */}
      <PlayerHeader player={player} />

      {/* Career Stats */}
      <PlayerCareerStats stats={career} />

      {/* Match History */}
      <PlayerMatchHistoryTable player={player} matches={matches} maxRows={5} />

      {/* Player Comparison */}
      <PlayerComparison player={player} />

      {/* Player Shot Chart Hotspots */}
      <PlayerShotChart
        matchEvents={matchEvents}
        title={tPlayers("playerDetail.shotchartTitle")}
        description={tPlayers("playerDetail.shotchartDescription")}
        isLoading={false}
        error={null}
      />
    </PageLayout>
  );
}
