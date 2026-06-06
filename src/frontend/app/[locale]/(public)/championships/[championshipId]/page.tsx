// src/frontend/app/[locale]/(public)/championships/[championshipId]/page.tsx
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import { ChampionshipDetailPage } from "@/features/competitions/championships/components";
import {
  buildCategoryNavigation,
  buildDivisionNavigation,
} from "@/features/competitions/championships/utils";
import { serverLeaderboardsService } from "@/features/competitions/leaderboards/api";
import { serverPoolsService } from "@/features/competitions/pools/api";
import { PageLayout } from "@/shared/components/layout";
import { CompetitionLevel } from "@/shared/constants";

interface ChampionshipDetailPageProps {
  readonly params: Promise<{ championshipId: string; locale: string }>;
  readonly searchParams: Promise<{ pool?: string }>;
}

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export default async function ChampionshipsDetailPage({
  params,
  searchParams,
}: ChampionshipDetailPageProps) {
  const { championshipId: championshipIdStr, locale } = await params;
  const { pool: poolParam } = await searchParams;
  setRequestLocale(locale);

  const championshipId = Number.parseInt(championshipIdStr, 10);
  if (Number.isNaN(championshipId) || championshipId <= 0) notFound();

  const championship = await serverChampionshipsService.getById(championshipId);
  if (!championship) notFound();

  const organizationId =
    championship.level === CompetitionLevel.DEPARTMENTAL
      ? championship.committeeId
      : championship.leagueId;

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

  const initialPoolId = poolParam
    ? pools.find((p) => p.id === Number(poolParam))?.id ?? pools[0].id
    : pools[0].id;

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
