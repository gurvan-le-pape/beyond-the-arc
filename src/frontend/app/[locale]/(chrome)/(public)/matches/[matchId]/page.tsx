// src/frontend/app/[locale]/(chrome)/(public)/matches/[matchId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverMatchesService } from "@/features/matches/api/matches.server";
import {
  MatchScoreCard,
  MatchSummaryTabs,
} from "@/features/matches/components";
import { buildTeam, groupShotEventsByPlayer } from "@/features/matches/utils";
import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

// Don't pre-build - one page per fixture, far too many to enumerate
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: LocalePageProps<{ matchId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const matchId = parseRouteId(routeParams.matchId);
  const tMeta = await getTranslations({ locale, namespace: "matches" });

  const match = await serverMatchesService
    .getById(matchId)
    .catch(handleServerError);

  const teams = {
    homeTeam: match.homeTeam.club.name,
    awayTeam: match.awayTeam.club.name,
  };

  return {
    title: tMeta("matchTitle", teams),
    description: tMeta("meta", teams),
  };
}

export default async function MatchSummaryPage({
  params,
}: LocalePageProps<{ matchId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const matchId = parseRouteId(routeParams.matchId);
  setRequestLocale(locale);
  const tMatches = await getTranslations({ locale, namespace: "matches" });

  const [match, playerMatchStats] = await Promise.all([
    serverMatchesService.getById(matchId),
    serverMatchesService.getPlayerStatsByMatchId(matchId),
  ]).catch(handleServerError);

  const { homeTeamId, awayTeamId, stats, homeTeamStats, awayTeamStats } =
    playerMatchStats;
  const homeTeam = buildTeam(
    stats,
    homeTeamId,
    match.homeTeam.club,
    homeTeamStats,
  );
  const awayTeam = buildTeam(
    stats,
    awayTeamId,
    match.awayTeam.club,
    awayTeamStats,
  );

  if (!homeTeam || !awayTeam) {
    notFound();
  }

  const shotEventsByPlayer = groupShotEventsByPlayer(match.matchEvents);

  return (
    <PageLayout>
      {/* The score card is the visible title; this is the document's heading. */}
      <Text variant="pageTitle" className="sr-only">
        {tMatches("matchTitle", {
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
        })}
      </Text>

      <MatchScoreCard homeTeam={homeTeam} awayTeam={awayTeam} />

      <MatchSummaryTabs
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        matchEvents={match.matchEvents}
        matchDate={match.date}
        playerShots={shotEventsByPlayer}
      />
    </PageLayout>
  );
}
