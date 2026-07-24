// src/frontend/app/[locale]/(public)/matches/[matchId]/page.tsx
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { serverMatchesService } from "@/features/matches/api";
import { MatchScoreCard, MatchSummaryTabs } from "@/features/matches/components";
import { buildTeam, groupShotEventsByPlayer } from "@/features/matches/utils";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

// Don't pre-build - one page per fixture, far too many to enumerate
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function MatchSummaryPage({
  params,
}: LocalePageProps<{ matchId: string }>) {
  const { matchId: matchIdStr, locale } = await params;
  setRequestLocale(locale);

  const matchId = parseRouteId(matchIdStr);

  const [match, playerMatchStats] = await Promise.all([
    serverMatchesService.getById(matchId),
    serverMatchesService.getPlayerStatsByMatchId(matchId),
  ]).catch(handleServerError);

  const { homeTeamId, awayTeamId, stats, homeTeamStats, awayTeamStats } =
    playerMatchStats;
  const homeTeam = buildTeam(stats, homeTeamId, match.homeTeam.club, homeTeamStats);
  const awayTeam = buildTeam(stats, awayTeamId, match.awayTeam.club, awayTeamStats);

  if (!homeTeam || !awayTeam) {
    notFound();
  }

  const shotEventsByPlayer = groupShotEventsByPlayer(match.matchEvents);

  return (
    <PageLayout>
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
