// src/frontend/app/[locale]/(public)/competitions/regional/[id]/[championshipId]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import { championshipsKeys } from "@/features/competitions/championships/api/championshipsKeys";
import { ChampionshipsDetailPageGeneric } from "@/features/competitions/components";
import { serverPoolsService } from "@/features/competitions/pools/api/pools.server";
import { poolsKeys } from "@/features/competitions/pools/api/poolsKeys";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { leaguesKeys } from "@/features/organizations/leagues/api/leaguesKeys";
import { CompetitionLevel } from "@/shared/constants";

interface RegionalChampionshipsDetailPageProps {
  params: Promise<{
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
  } catch (error) {
    console.error("Error prefetching regional championship data:", error);
    return dehydrate(queryClient);
  }
}

export default async function RegionalChampionshipsDetailPage({
  params,
}: RegionalChampionshipsDetailPageProps) {
  const { leagueId: leagueIdStr, championshipId: championshiptIdStr } =
    await params;

  const leagueId = Number.parseInt(leagueIdStr, 10);
  const championshipId = Number.parseInt(championshiptIdStr, 10);

  const dehydratedState = await prefetchData(leagueId, championshipId);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ChampionshipsDetailPageGeneric level={CompetitionLevel.REGIONAL} />
    </HydrationBoundary>
  );
}

// Enable ISR with 5 minute revalidation
export const revalidate = 300;
