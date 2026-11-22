// src/frontend/app/[locale]/(chrome)/(public)/matches/[matchId]/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { matchesService } from "@/features/matches/api";
import {
  MatchBody,
  MatchBreadcrumb,
  MatchHero,
} from "@/features/matches/components";
import { buildMatchTeam } from "@/features/matches/utils";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";
import {
  handleServerError,
  parseRouteId,
  withServerErrorMetadata,
} from "@/shared/utils";

/**
 * Pre-build list for match detail — always empty.
 *
 * One page per fixture, far too many to enumerate. But the export must stay: returning `[]` is what
 * opts the route into ISR, and without it `dynamicParams` and `revalidate`
 * below are inert. See docs/frontend.md, "What each route directive is for".
 */
export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
// 60s because every fetch here is `ServerRevalidate.LIVE` and the lowest
// revalidate in a route sets the frequency for the whole route.
export const revalidate = 60;

async function buildMetadata({
  params,
}: LocalePageProps<{ matchId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const matchId = parseRouteId(routeParams.matchId);
  const tMeta = await getTranslations({ locale, namespace: "matches" });

  const match = await matchesService.getById(matchId).catch(handleServerError);

  const teams = {
    homeTeam: match.homeTeam.club.name,
    awayTeam: match.awayTeam.club.name,
  };

  return {
    title: tMeta("matchTitle", teams),
    description: tMeta("meta", teams),
  };
}

async function MatchSummaryPage({
  params,
}: LocalePageProps<{ matchId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const matchId = parseRouteId(routeParams.matchId);
  setRequestLocale(locale);

  const [match, playerMatchStats] = await Promise.all([
    matchesService.getById(matchId),
    matchesService.getPlayerStatsByMatchId(matchId),
  ]).catch(handleServerError);

  const { stats, homeTeamStats, awayTeamStats } = playerMatchStats;
  const homeTeam = buildMatchTeam(
    match.homeTeam,
    match.homeTeamScore,
    stats,
    homeTeamStats,
  );
  const awayTeam = buildMatchTeam(
    match.awayTeam,
    match.awayTeamScore,
    stats,
    awayTeamStats,
  );

  return (
    <PageLayout>
      <MatchBreadcrumb
        pool={match.pool}
        matchName={`${homeTeam.name} – ${awayTeam.name}`}
      />

      <MatchHero
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        status={match.status}
        startsAt={match.startsAt}
        matchday={match.matchday}
        poolLetter={match.pool.letter}
        forfeit={match.forfeit}
      />

      <MatchBody match={match} homeTeam={homeTeam} awayTeam={awayTeam} />
    </PageLayout>
  );
}

export default withServerErrorState(MatchSummaryPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
