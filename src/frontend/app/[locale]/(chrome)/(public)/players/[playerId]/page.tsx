// src/frontend/app/[locale]/(chrome)/(public)/players/[playerId]/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PlayerShotChart } from "@/features/charts/components";
import { serverMatchesService } from "@/features/matches/api";
import { serverPlayersService } from "@/features/players/api";
import {
  PlayerComparison,
  PlayerHeader,
  PlayerMatchHistoryTable,
} from "@/features/players/components";
import { PerGameStatsPanel } from "@/shared/components/domain";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

// Don't pre-build - hundreds of thousands of licensed players
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function PlayerDetailPage({
  params,
}: LocalePageProps<{ playerId: string }>) {
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
      <PerGameStatsPanel stats={career} />

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
