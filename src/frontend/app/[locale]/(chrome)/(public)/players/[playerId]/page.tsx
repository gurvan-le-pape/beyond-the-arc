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

/**
 * Pre-build list for player detail — always empty.
 *
 * Hundreds of thousands of licensed players. But the export must stay: returning `[]` is what
 * opts the route into ISR, and without it `dynamicParams` and `revalidate`
 * below are inert. See docs/frontend.md, "What each route directive is for".
 */
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
// 60s because the match-history and events fetches are `ServerRevalidate.LIVE`
// and the lowest revalidate in a route sets the frequency for the whole route.
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

  const [player, matchHistory, shots] = await Promise.all([
    serverPlayersService.getById(playerId),
    serverPlayersService.getMatches(playerId),
    serverMatchesService.getShotsByPlayerId(playerId),
  ]).catch(handleServerError);

  const { matches, career } = matchHistory;

  return (
    <PageLayout>
      <PlayerHeader player={player} />

      <PerGameStatsPanel stats={career} />

      <PlayerMatchHistoryTable player={player} matches={matches} maxRows={5} />

      {/* career is passed down rather than refetched: the same
          /players/{id}/matches response is already on screen above. */}
      <PlayerComparison player={player} careerStats={career} />

      <PlayerShotChart
        shots={shots}
        title={tPlayers("playerDetail.shotchartTitle")}
        description={tPlayers("playerDetail.shotchartDescription")}
      />
    </PageLayout>
  );
}

export default withServerErrorState(PlayerDetailPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
