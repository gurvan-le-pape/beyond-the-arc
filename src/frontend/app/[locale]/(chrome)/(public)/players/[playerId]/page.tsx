// src/frontend/app/[locale]/(chrome)/(public)/players/[playerId]/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { matchesService } from "@/features/matches/api";
import { transformToShotEvents } from "@/features/matches/utils";
import { playersService } from "@/features/players/api";
import {
  PlayerComparison,
  PlayerHeader,
  PlayerMatchHistoryTable,
} from "@/features/players/components";
import { PlayerShotChart } from "@/features/shot-chart/components";
import { PerGameStatsPanel } from "@/features/stats/components";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import type { LocalePageProps } from "@/shared/types";
import {
  formatTeamName,
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

  const player = await playersService
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
  const [tPlayers, tOrganizations] = await Promise.all([
    getTranslations({ locale, namespace: "players" }),
    getTranslations({ locale, namespace: "organizations" }),
  ]);

  const [player, matchHistory, shots] = await Promise.all([
    playersService.getById(playerId),
    playersService.getMatches(playerId),
    matchesService.getShotsByPlayerId(playerId),
  ]).catch(handleServerError);

  const { matches, career } = matchHistory;

  return (
    <PageLayout>
      {/* A player belongs to a team and the team to its club, so the trail
          continues the club's and then the team's. */}
      <Breadcrumb
        items={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("clubs.label"),
            href: "/organizations/clubs",
          },
          {
            label: player.team.club.name,
            href: `/organizations/clubs/${player.team.club.id}`,
          },
          {
            label: formatTeamName(player.team.club.name, player.team.number),
            href: `/teams/${player.team.id}`,
          },
          { label: player.name, current: true },
        ]}
      />
      <PlayerHeader player={player} />

      <PerGameStatsPanel stats={career} />

      <PlayerMatchHistoryTable player={player} matches={matches} maxRows={5} />

      {/* career is passed down rather than refetched: the same
          /players/{id}/matches response is already on screen above. */}
      <PlayerComparison player={player} careerStats={career} />

      <PlayerShotChart
        shots={transformToShotEvents(shots)}
        title={tPlayers("playerDetail.shotchartTitle")}
        description={tPlayers("playerDetail.shotchartDescription")}
      />
    </PageLayout>
  );
}

export default withServerErrorState(PlayerDetailPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
