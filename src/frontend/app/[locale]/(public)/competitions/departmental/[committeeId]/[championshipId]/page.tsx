// src/frontend/app/[locale]/(public)/competitions/departmental/[committeeId]/[championshipId]/page.tsx
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
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { committeesKeys } from "@/features/organizations/committees/api/committeesKeys";
import { PageLayout } from "@/shared/components/layouts/PageLayout";
import { CompetitionLevel } from "@/shared/constants";

interface DepartmentalChampionshipsDetailPageProps {
  readonly params: Promise<{
    locale: string;
    committeeId: string;
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
  } catch {
    // prefetch failed — client will fetch on mount
  }
}

export default async function DepartmentalChampionshipsDetailPage({
  params,
}: DepartmentalChampionshipsDetailPageProps) {
  const { committeeId: committeeIdStr, championshipId: championshipIdStr } =
    await params;

  const committeeId = Number.parseInt(committeeIdStr, 10);
  const championshipId = Number.parseInt(championshipIdStr, 10);

  if (
    Number.isNaN(committeeId) ||
    committeeId <= 0 ||
    Number.isNaN(championshipId) ||
    championshipId <= 0
  ) {
    notFound();
  }

  const dehydratedState = await prefetchData(committeeId, championshipId);

  return (
    <PageLayout contentClassName="max-w-[1800px]">
      <HydrationBoundary state={dehydratedState}>
        <ChampionshipsDetailPageGeneric
          level={CompetitionLevel.DEPARTMENTAL}
          organizationId={committeeId}
        />
      </HydrationBoundary>
    </PageLayout>
  );
}

export const revalidate = 300;
