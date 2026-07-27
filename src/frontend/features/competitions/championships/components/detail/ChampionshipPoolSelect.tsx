// src/frontend/features/competitions/championships/components/detail/ChampionshipPoolSelect.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useMatchesPrefetch } from "@/features/matches/api";
import { usePathname, useRouter } from "@/navigation";
import { Select } from "@/shared/components/forms";

import type { Pool } from "../../../pools/types";

interface ChampionshipPoolSelectProps {
  readonly pools: Pool[];
  readonly selectedPoolId: number;
}

/**
 * Pool picker for the championship detail page.
 *
 * The selected pool lives in the `?pool=` query param, and the page is
 * force-dynamic — so changing it re-renders the server page, which is what
 * refreshes the leaderboard. This component only writes the URL.
 */
export function ChampionshipPoolSelect({
  pools,
  selectedPoolId,
}: ChampionshipPoolSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tPool = useTranslations("pool");
  const prefetch = useMatchesPrefetch();

  const handlePoolChange = (val: string | number | undefined) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("pool", String(Number(val)));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <Select
      value={selectedPoolId}
      onChange={handlePoolChange}
      options={pools.map((pool) => ({
        value: pool.id,
        label: `${tPool("label")} ${pool.letter}`,
        // The matches panel still fetches client-side, so warming its query
        // on hover keeps the round list instant after the pool switch.
        onMouseEnter: () => prefetch.byPool(pool.id),
      }))}
    />
  );
}

export default ChampionshipPoolSelect;
