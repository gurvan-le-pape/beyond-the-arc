// src/frontend/app/[locale]/(chrome)/(public)/championships/[championshipId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { championshipsService } from "@/features/competitions/championships/api";
import {
  ChampionshipBreadcrumb,
  ChampionshipHeader,
  ChampionshipPoolSelect,
  ChampionshipSections,
} from "@/features/competitions/championships/components";
import {
  buildCategoryNavigation,
  buildChampionshipHeading,
  buildChampionshipTitle,
  buildDivisionNavigation,
  buildGenderNavigation,
  buildLevelBelowNavigation,
  findLevelAbove,
  resolveOrganizationId,
  resolvePoolId,
} from "@/features/competitions/championships/utils";
import { leaderboardsService } from "@/features/competitions/leaderboards/api";
import { LeaderboardTable } from "@/features/competitions/leaderboards/components";
import { poolsService } from "@/features/competitions/pools/api";
import { matchesService } from "@/features/matches/api";
import { MatchesByRound } from "@/features/matches/components";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { CompetitionLevel } from "@/shared/constants";
import type { LocalePageProps, SearchParamsProps } from "@/shared/types";
import {
  handleServerError,
  parseRouteId,
  withServerErrorMetadata,
} from "@/shared/utils";

// No route directives, and none needed: reading `?pool=` is a request-time API,
// which already renders this route per request and already keeps it out of the
// prerender pass. A `force-dynamic` alongside that says nothing extra, and a
// `generateStaticParams` returning [] is never called on a route that is always
// dynamic. Caching stays where it belongs, on `request`.

async function buildMetadata({
  params,
}: LocalePageProps<{ championshipId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const championshipId = parseRouteId(routeParams.championshipId);
  const [tCommon, tCompetitions] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "competitions" }),
  ]);

  const championship = await championshipsService
    .getById(championshipId)
    .catch(handleServerError);

  // A championship has no name of its own; the document title names it in
  // full, organiser and season included.
  const name = buildChampionshipTitle(championship, {
    gender: tCommon(`gender.${championship.gender}`),
    division: tCompetitions("divisionWithValue", {
      value: championship.division,
    }),
  });

  return {
    title: name,
    description: tCompetitions("championshipMeta", { name }),
  };
}

async function ChampionshipsDetailPage({
  params,
  searchParams,
}: LocalePageProps<{ championshipId: string }> &
  SearchParamsProps<{ pool?: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const championshipId = parseRouteId(routeParams.championshipId);
  const { pool: poolParam } = await searchParams;
  setRequestLocale(locale);

  const [tCommon, tCompetitions] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "competitions" }),
  ]);

  const championship = await championshipsService
    .getById(championshipId)
    .catch(handleServerError);

  const organizationId = resolveOrganizationId(championship);
  if (!organizationId) notFound();

  const isDepartmental = championship.level === CompetitionLevel.DEPARTMENTAL;

  const [pools, { items: championships }, { items: otherLevel }] =
    await Promise.all([
      poolsService.getByChampionshipId(championshipId),
      // Its siblings: same organiser, same level.
      championshipsService.getAll({
        level: championship.level,
        ...(isDepartmental
          ? { committeeId: organizationId }
          : { leagueId: organizationId }),
        limit: 100,
      }),
      // The same category and gender at the other level of the same league:
      // regional from a departmental championship, departmental from a
      // regional one. National championships belong to no league.
      championship.level !== CompetitionLevel.NATIONAL &&
      championship.leagueId !== null
        ? championshipsService.getAll({
            level: isDepartmental
              ? CompetitionLevel.REGIONAL
              : CompetitionLevel.DEPARTMENTAL,
            leagueId: championship.leagueId,
            category: championship.category,
            gender: championship.gender,
            limit: 100,
          })
        : { items: [] },
    ]).catch(handleServerError);

  if (pools.length === 0) notFound();

  const poolId = resolvePoolId(pools, poolParam);

  // Both halves of the page are scoped to the selected pool, so they resolve
  // together once it is known.
  const [leaderboard, matches] = await Promise.all([
    leaderboardsService.getAll({ poolId }),
    matchesService.getByPoolId(poolId),
  ]).catch(handleServerError);

  const categoryLinks = buildCategoryNavigation(championships, championship);

  const genderLinks = buildGenderNavigation(
    championships,
    championship,
    (gender) => tCommon(`gender.${gender}`),
  );

  const levelAbove = isDepartmental ? findLevelAbove(otherLevel) : undefined;
  const levelBelowLinks = isDepartmental
    ? []
    : buildLevelBelowNavigation(otherLevel, locale);

  const divisionLinks = buildDivisionNavigation(
    championships,
    championship,
    (value) => tCompetitions("divisionWithValue", { value }),
  );

  return (
    <PageLayout>
      <ChampionshipSections
        header={
          <>
            <ChampionshipBreadcrumb
              name={buildChampionshipHeading(championship, {
                gender: tCommon(`gender.${championship.gender}`),
                division: tCompetitions("divisionWithValue", {
                  value: championship.division,
                }),
              })}
            />

            <ChampionshipHeader
              championship={championship}
              categoryLinks={categoryLinks}
              genderLinks={genderLinks}
              divisionLinks={divisionLinks}
              levelAboveHref={levelAbove && `/championships/${levelAbove.id}`}
              levelBelowLinks={levelBelowLinks}
              poolSelect={
                pools.length > 1 && (
                  <ChampionshipPoolSelect
                    pools={pools}
                    selectedPoolId={poolId}
                  />
                )
              }
            />
          </>
        }
        standings={<LeaderboardTable leaderboards={leaderboard} />}
        matches={<MatchesByRound key={poolId} matches={matches} />}
      />
    </PageLayout>
  );
}

export default withServerErrorState(ChampionshipsDetailPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
