// src/frontend/app/[locale]/(chrome)/(public)/matches/[matchId]/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { championshipsService } from "@/features/competitions/championships/api";
import { buildChampionshipTitle } from "@/features/competitions/championships/utils";
import { matchesService } from "@/features/matches/api";
import {
  ForfeitNotice,
  MatchBreadcrumb,
  MatchHero,
  MatchSummaryTabs,
  ResultUnavailableNotice,
  UpcomingMatchNotice,
} from "@/features/matches/components";
import {
  buildMatchTeam,
  groupShotEventsByPlayer,
} from "@/features/matches/utils";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { MatchStatus } from "@/shared/constants";
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
export async function generateStaticParams() {
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
  const [tCommon, tCompetitions] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "competitions" }),
  ]);

  const [match, playerMatchStats] = await Promise.all([
    matchesService.getById(matchId),
    matchesService.getPlayerStatsByMatchId(matchId),
  ]).catch(handleServerError);

  // The match names its championship by id only; the organisation and season
  // that make up the championship's display name come from this second fetch.
  const championship = await championshipsService
    .getById(match.pool.championship.id)
    .catch(handleServerError);

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
  const shotEventsByPlayer = groupShotEventsByPlayer(match.matchEvents);

  return (
    <PageLayout>
      <MatchBreadcrumb
        championshipId={championship.id}
        poolId={match.pool.id}
        championshipName={buildChampionshipTitle(championship, {
          gender: tCommon(`gender.${championship.gender}`),
          division: tCompetitions("divisionWithValue", {
            value: championship.division,
          }),
        })}
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

      {match.forfeit && <ForfeitNotice homeTeam={homeTeam} awayTeam={awayTeam} />}
      {match.status === MatchStatus.COMPLETED && !match.forfeit && (
        <MatchSummaryTabs
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          matchEvents={match.matchEvents}
          matchDate={match.startsAt}
          playerShots={shotEventsByPlayer}
        />
      )}
      {match.status === MatchStatus.FAILED && <ResultUnavailableNotice />}
      {(match.status === MatchStatus.SCHEDULED ||
        match.status === MatchStatus.GENERATING) && (
        <UpcomingMatchNotice startsAt={match.startsAt} />
      )}
    </PageLayout>
  );
}

export default withServerErrorState(MatchSummaryPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
