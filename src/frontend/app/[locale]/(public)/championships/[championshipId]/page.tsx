// src/frontend/app/[locale]/(public)/championships/[championshipId]/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { championshipsKeys, serverChampionshipsService } from "@/features/competitions/championships/api";
import { ChampionshipDetailPage } from "@/features/competitions/championships/components";
import { poolsKeys, serverPoolsService } from "@/features/competitions/pools/api";
import { PageLayout } from "@/shared/components/layout";

interface ChampionshipDetailPageProps {
  readonly params: Promise<{
    championshipId: string;
  }>;
}

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 300;
export const dynamic = "force-dynamic";

async function prefetchData(championshipId: number) {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: championshipsKeys.detail(championshipId),
      queryFn: () => serverChampionshipsService.getById(championshipId),
    });

    await queryClient.prefetchQuery({
      queryKey: poolsKeys.byChampionship(championshipId),
      queryFn: () => serverPoolsService.getByChampionshipId(championshipId),
    });
  } catch {
    // prefetch failed — client will fetch on mount
  }

  return dehydrate(queryClient);
}

export default async function ChampionshipsDetailPage({
  params,
}: ChampionshipDetailPageProps) {
  const { championshipId: championshipIdStr } = await params;
  const championshipId = Number.parseInt(championshipIdStr, 10);

  if (Number.isNaN(championshipId) || championshipId <= 0) {
    notFound();
  }

  const dehydratedState = await prefetchData(championshipId);

  return (
    <PageLayout contentClassName="max-w-[1800px]">
      <HydrationBoundary state={dehydratedState}>
        <ChampionshipDetailPage />
      </HydrationBoundary>
    </PageLayout>
  );
}
