// src/frontend/app/[locale]/(chrome)/(public)/championships/[championshipId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api/championships.server";
import {
  ChampionshipBreadcrumb,
  ChampionshipHeader,
  ChampionshipMatches,
  ChampionshipNavigation,
  ChampionshipPoolSelect,
} from "@/features/competitions/championships/components";
import {
  buildCategoryNavigation,
  buildChampionshipHeading,
  buildChampionshipTitle,
  buildDivisionNavigation,
  resolveOrganizationId,
  resolvePoolId,
} from "@/features/competitions/championships/utils";
import { serverLeaderboardsService } from "@/features/competitions/leaderboards/api/leaderboards.server";
import { serverPoolsService } from "@/features/competitions/pools/api/pools.server";
import { serverMatchesService } from "@/features/matches/api/matches.server";
import { LeaderboardTable } from "@/shared/components/domain";
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
// dynamic. Caching stays where it belongs, on `fetchApi`.

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

  const championship = await serverChampionshipsService
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

  const championship = await serverChampionshipsService
    .getById(championshipId)
    .catch(handleServerError);

  const organizationId = resolveOrganizationId(championship);
  if (!organizationId) notFound();

  const [pools, { items: championships }] = await Promise.all([
    serverPoolsService.getByChampionshipId(championshipId),
    // Its siblings: same organiser, same level.
    serverChampionshipsService.getAll({
      level: championship.level,
      ...(championship.level === CompetitionLevel.DEPARTMENTAL
        ? { committeeId: organizationId }
        : { leagueId: organizationId }),
      limit: 100,
    }),
  ]).catch(handleServerError);

  if (pools.length === 0) notFound();

  const poolId = resolvePoolId(pools, poolParam);

  // Both halves of the page are scoped to the selected pool, so they resolve
  // together once it is known.
  const [leaderboard, matches] = await Promise.all([
    serverLeaderboardsService.getAll({ poolId }),
    serverMatchesService.getByPoolId(poolId),
  ]).catch(handleServerError);

  const categoryLinks = buildCategoryNavigation(championships, championship);

  const divisionLinks = buildDivisionNavigation(
    championships,
    championship,
    (value) => tCompetitions("divisionWithValue", { value }),
  );

  return (
    <PageLayout contentClassName="max-w-[1800px]">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:flex-1 space-y-6">
          <ChampionshipBreadcrumb
            name={buildChampionshipHeading(championship, {
              gender: tCommon(`gender.${championship.gender}`),
              division: tCompetitions("divisionWithValue", {
                value: championship.division,
              }),
            })}
          />

          <ChampionshipHeader championship={championship}>
            <ChampionshipNavigation
              categoryLinks={categoryLinks}
              divisionLinks={divisionLinks}
            />
          </ChampionshipHeader>

          <LeaderboardTable
            leaderboards={leaderboard}
            dropdown={
              <ChampionshipPoolSelect pools={pools} selectedPoolId={poolId} />
            }
          />
        </div>

        <div className="w-full xl:w-[500px] 2xl:w-[600px]">
          <ChampionshipMatches key={poolId} matches={matches} />
        </div>
      </div>
    </PageLayout>
  );
}

export default withServerErrorState(ChampionshipsDetailPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
