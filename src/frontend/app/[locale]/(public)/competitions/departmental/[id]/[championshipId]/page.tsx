// src/frontend/app/[locale]/(public)/competitions/departmental/[id]/[championshipId]/page.tsx
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
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { committeesKeys } from "@/features/organizations/committees/api/committeesKeys";
import { CompetitionLevel } from "@/shared/constants";

interface DepartmentalChampionshipsDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
    championshipId: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

async function prefetchData(committeeId: number, championshipId: number) {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: committeesKeys.detail(committeeId),
      queryFn: () => serverCommitteesService.getById(committeeId),
    });

    await queryClient.prefetchQuery({
      queryKey: championshipsKeys.list({
        level: CompetitionLevel.DEPARTMENTAL,
        id: committeeId,
      }),
      queryFn: () =>
        serverChampionshipsService.getAll({
          level: CompetitionLevel.DEPARTMENTAL,
          id: committeeId,
        }),
    });

    await queryClient.prefetchQuery({
      queryKey: championshipsKeys.detail(championshipId),
      queryFn: () => serverChampionshipsService.getById(championshipId),
    });

    await queryClient.prefetchQuery({
      queryKey: poolsKeys.byChampionship(championshipId),
      queryFn: () => serverPoolsService.getByChampionshipId(championshipId),
    });

    return dehydrate(queryClient);
  } catch (error) {
    console.error("Error prefetching departmental championship data:", error);
    return dehydrate(queryClient);
  }
}

export default async function DepartmentalChampionshipsDetailPage({
  params,
}: DepartmentalChampionshipsDetailPageProps) {
  const { id: idStr, championshipId: championshiptIdStr } = await params;

  const committeeId = Number.parseInt(idStr, 10);
  const championshipId = Number.parseInt(championshiptIdStr, 10);

  if (
    isNaN(committeeId) ||
    committeeId <= 0 ||
    isNaN(championshipId) ||
    championshipId <= 0
  ) {
    // handle invalid params - import notFound if needed
  }

  const dehydratedState = await prefetchData(committeeId, championshipId);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ChampionshipsDetailPageGeneric level={CompetitionLevel.DEPARTMENTAL} />
    </HydrationBoundary>
  );
}

export const revalidate = 300;
