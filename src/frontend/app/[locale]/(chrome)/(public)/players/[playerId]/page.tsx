// src/frontend/app/[locale]/(chrome)/(public)/players/[playerId]/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PlayerShotChart } from "@/features/charts/components";
import { serverMatchesService } from "@/features/matches/api/matches.server";
import { serverPlayersService } from "@/features/players/api/players.server";
import {
  PlayerComparison,
  PlayerHeader,
  PlayerMatchHistoryTable,
} from "@/features/players/components";
import { PerGameStatsPanel } from "@/shared/components/domain";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";
import {
  handleServerError,
  parseRouteId,
  withServerErrorMetadata,
} from "@/shared/utils";

// Don't pre-build - hundreds of thousands of licensed players
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
// 60s, not the hour this once declared: the match-history and events fetches are
// `ServerRevalidate.LIVE`, and the lowest revalidate in a route wins — so 60 has
// always been what was in force, whatever the number above it said.
export const revalidate = 60;

async function buildMetadata({
  params,
}: LocalePageProps<{ playerId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const playerId = parseRouteId(routeParams.playerId);
  const tMeta = await getTranslations({ locale, namespace: "players" });

  const player = await serverPlayersService
    .getById(playerId)
    .catch(handleServerError);

  return {
    title: player.name,
    description: tMeta("meta", { name: player.name }),
  };
}

async function PlayerDetailPage({
  params,
}: LocalePageProps<{ playerId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const playerId = parseRouteId(routeParams.playerId);
  setRequestLocale(locale);
  const tPlayers = await getTranslations({ locale, namespace: "players" });

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
      {/* career is passed down rather than refetched: the same
          /players/{id}/matches response is already on screen above. */}
      <PlayerComparison player={player} careerStats={career} />

      {/* Player Shot Chart Hotspots */}
      <PlayerShotChart
        matchEvents={matchEvents}
        title={tPlayers("playerDetail.shotchartTitle")}
        description={tPlayers("playerDetail.shotchartDescription")}
      />
    </PageLayout>
  );
}

export default withServerErrorState(PlayerDetailPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
