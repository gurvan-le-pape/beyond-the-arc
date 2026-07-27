// src/frontend/app/[locale]/(chrome)/(public)/championships/[championshipId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import {
  ChampionshipBreadcrumb,
  ChampionshipHeader,
  ChampionshipMatches,
  ChampionshipNavigation,
  ChampionshipPoolSelect,
} from "@/features/competitions/championships/components";
import {
  buildCategoryNavigation,
  buildChampionshipTitle,
  buildDivisionNavigation,
  resolveOrganizationId,
  resolvePoolId,
} from "@/features/competitions/championships/utils";
import { serverLeaderboardsService } from "@/features/competitions/leaderboards/api";
import { serverPoolsService } from "@/features/competitions/pools/api";
import { LeaderboardTable } from "@/shared/components/domain";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps, SearchParamsProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

// No route directives, and none needed: reading `?pool=` is a request-time API,
// which already renders this route per request and already keeps it out of the
// prerender pass. A `force-dynamic` alongside that says nothing extra, and a
// `generateStaticParams` returning [] is never called on a route that is always
// dynamic. Caching stays where it belongs, on `fetchApi`.

export async function generateMetadata({
  params,
}: LocalePageProps<{ championshipId: string }>): Promise<Metadata> {
  const { championshipId: championshipIdStr, locale } = await params;
  const [tCommon, tCompetitions] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "competitions" }),
  ]);

  const championship = await serverChampionshipsService
    .getById(parseRouteId(championshipIdStr))
    .catch(handleServerError);

  // The same one-liner the page uses as its heading — a championship has no
  // name of its own.
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

export default async function ChampionshipsDetailPage({
  params,
  searchParams,
}: LocalePageProps<{ championshipId: string }> &
  SearchParamsProps<{ pool?: string }>) {
  const { championshipId: championshipIdStr, locale } = await params;
  const { pool: poolParam } = await searchParams;
  setRequestLocale(locale);

  const championshipId = parseRouteId(championshipIdStr);

  const championship = await serverChampionshipsService
    .getById(championshipId)
    .catch(handleServerError);

  const organizationId = resolveOrganizationId(championship);
  if (!organizationId) notFound();

  const [pools, { items: championships }] = await Promise.all([
    serverPoolsService.getByChampionshipId(championshipId),
    serverChampionshipsService.getAll({
      level: championship.level,
      id: organizationId,
      limit: 100,
    }),
  ]).catch(handleServerError);

  if (pools.length === 0) notFound();

  const poolId = resolvePoolId(pools, poolParam);

  const leaderboard = await serverLeaderboardsService
    .getAll({ poolId })
    .catch(handleServerError);

  const categoryNav = buildCategoryNavigation(
    championships,
    championshipId,
    championship.gender,
  );

  const divisionNav = buildDivisionNavigation(
    championships,
    championship.level,
    championship.category,
    championship.gender,
    championship.division,
  );

  return (
    <PageLayout contentClassName="max-w-[1800px]">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:flex-1 space-y-6">
          <ChampionshipBreadcrumb name={championship.name} />

          <ChampionshipHeader championship={championship} />

          <ChampionshipNavigation
            categoryNav={categoryNav}
            divisionNav={divisionNav}
          />

          <LeaderboardTable
            leaderboards={leaderboard}
            dropdown={
              <ChampionshipPoolSelect pools={pools} selectedPoolId={poolId} />
            }
          />
        </div>

        <div className="w-full xl:w-[500px] 2xl:w-[600px]">
          <ChampionshipMatches key={poolId} poolId={poolId} />
        </div>
      </div>
    </PageLayout>
  );
}
