// src/frontend/app/[locale]/(public)/competitions/regional/[leagueId]/[championshipId]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import { championshipsKeys } from "@/features/competitions/championships/api/championshipsKeys";
import { ChampionshipsDetailPageGeneric } from "@/features/competitions/components";
import { serverPoolsService } from "@/features/competitions/pools/api/pools.server";
import { poolsKeys } from "@/features/competitions/pools/api/poolsKeys";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { leaguesKeys } from "@/features/organizations/leagues/api/leaguesKeys";
import { PageLayout } from "@/shared/components/layout";
import { CompetitionLevel } from "@/shared/constants";

interface RegionalChampionshipsDetailPageProps {
  readonly params: Promise<{
    locale: string;
    leagueId: string;
    championshipId: string;
  }>;
}

/**
 * Generate static paths for regional championships.
 */
export async function generateStaticParams() {
  return [];
}

/**
 * Prefetch data on the server for better performance and SEO.
 */
async function prefetchData(leagueId: number, championshipId: number) {
  const queryClient = new QueryClient();

  try {
    // Prefetch league data
    await queryClient.prefetchQuery({
      queryKey: leaguesKeys.detail(leagueId),
      queryFn: () => serverLeaguesService.getById(leagueId),
    });

    // Prefetch championships for this league
    await queryClient.prefetchQuery({
      queryKey: championshipsKeys.list({
        level: CompetitionLevel.REGIONAL,
        id: leagueId,
      }),
      queryFn: () =>
        serverChampionshipsService.getAll({
          level: CompetitionLevel.REGIONAL,
          id: leagueId,
        }),
    });

    // Prefetch championship detail
    await queryClient.prefetchQuery({
      queryKey: championshipsKeys.detail(championshipId),
      queryFn: () => serverChampionshipsService.getById(championshipId),
    });

    // Prefetch pools for this championship
    await queryClient.prefetchQuery({
      queryKey: poolsKeys.byChampionship(championshipId),
      queryFn: () => serverPoolsService.getByChampionshipId(championshipId),
    });

    return dehydrate(queryClient);
  } catch {
    // prefetch failed — client will fetch on mount
  }
}

export default async function RegionalChampionshipsDetailPage({
  params,
}: RegionalChampionshipsDetailPageProps) {
  const { leagueId: leagueIdStr, championshipId: championshipIdStr } =
    await params;

  const leagueId = Number.parseInt(leagueIdStr, 10);
  const championshipId = Number.parseInt(championshipIdStr, 10);

  if (
    Number.isNaN(leagueId) ||
    leagueId <= 0 ||
    Number.isNaN(championshipId) ||
    championshipId <= 0
  ) {
    notFound();
  }

  const dehydratedState = await prefetchData(leagueId, championshipId);

  return (
    <PageLayout contentClassName="max-w-[1800px]">
      <HydrationBoundary state={dehydratedState}>
        <ChampionshipsDetailPageGeneric
          level={CompetitionLevel.REGIONAL}
          organizationId={leagueId}
        />
      </HydrationBoundary>
    </PageLayout>
  );
}

// Enable ISR with 5 minute revalidation
export const revalidate = 300;
