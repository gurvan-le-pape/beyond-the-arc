// src/frontend/app/[locale]/(chrome)/(public)/matches/[matchId]/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api/championships.server";
import { buildChampionshipTitle } from "@/features/competitions/championships/utils";
import { serverMatchesService } from "@/features/matches/api/matches.server";
import {
  MatchBreadcrumb,
  MatchMeta,
  MatchSummaryTabs,
  UpcomingMatchNotice,
} from "@/features/matches/components";
import {
  buildTeam,
  groupShotEventsByPlayer,
  teamInfoMatchupSide,
} from "@/features/matches/utils";
import { Matchup } from "@/shared/components/domain";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
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

async function MatchSummaryPage({
  params,
}: LocalePageProps<{ matchId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const matchId = parseRouteId(routeParams.matchId);
  setRequestLocale(locale);
  const [tMatches, tCommon, tCompetitions] = await Promise.all([
    getTranslations({ locale, namespace: "matches" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "competitions" }),
  ]);

  const [match, playerMatchStats] = await Promise.all([
    serverMatchesService.getById(matchId),
    serverMatchesService.getPlayerStatsByMatchId(matchId),
  ]).catch(handleServerError);

  // The match names its championship by id only; the organisation and season
  // that make up the championship's display name come from this second fetch.
  const championship = await serverChampionshipsService
    .getById(match.pool.championship.id)
    .catch(handleServerError);

  const { stats, homeTeamStats, awayTeamStats } = playerMatchStats;
  const homeTeam = buildTeam(
    match.homeTeam,
    match.homeTeamScore,
    stats,
    homeTeamStats,
  );
  const awayTeam = buildTeam(
    match.awayTeam,
    match.awayTeamScore,
    stats,
    awayTeamStats,
  );
  const isPlayed = match.homeTeamScore !== null && match.awayTeamScore !== null;

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

      {/* The score card is the visible title; this is the document's heading. */}
      <Text variant="pageTitle" className="sr-only">
        {tMatches("matchTitle", {
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
        })}
      </Text>

      <Card variant="highlighted" padding="lg" className="space-y-4">
        <MatchMeta
          startsAt={match.startsAt}
          matchday={match.matchday}
          poolLetter={match.pool.letter}
        />
        <Matchup
          home={teamInfoMatchupSide(homeTeam)}
          away={teamInfoMatchupSide(awayTeam)}
          size="hero"
          linked
        />
      </Card>

      {isPlayed ? (
        <MatchSummaryTabs
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          matchEvents={match.matchEvents}
          matchDate={match.startsAt}
          playerShots={shotEventsByPlayer}
        />
      ) : (
        <UpcomingMatchNotice startsAt={match.startsAt} />
      )}
    </PageLayout>
  );
}

export default withServerErrorState(MatchSummaryPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
