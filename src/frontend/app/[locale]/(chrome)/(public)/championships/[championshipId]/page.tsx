// src/frontend/app/[locale]/(chrome)/(public)/championships/[championshipId]/page.tsx
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import { ChampionshipDetailPage } from "@/features/competitions/championships/components";
import {
  buildCategoryNavigation,
  buildDivisionNavigation,
  resolveInitialPoolId,
  resolveOrganizationId,
} from "@/features/competitions/championships/utils";
import { serverLeaderboardsService } from "@/features/competitions/leaderboards/api";
import { serverPoolsService } from "@/features/competitions/pools/api";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps, SearchParamsProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

// Don't pre-build - the page reads ?pool= and is force-dynamic below
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";

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
  ]);

  if (pools.length === 0) notFound();

  const initialPoolId = resolveInitialPoolId(pools, poolParam);

  const initialLeaderboard = await serverLeaderboardsService.getAll({
    poolId: initialPoolId,
  });

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
      <ChampionshipDetailPage
        championship={championship}
        pools={pools}
        initialPoolId={initialPoolId}
        initialLeaderboard={initialLeaderboard}
        categoryNav={categoryNav}
        divisionNav={divisionNav}
      />
    </PageLayout>
  );
}
