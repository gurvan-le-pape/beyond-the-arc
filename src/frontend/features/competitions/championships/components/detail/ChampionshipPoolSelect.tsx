// src/frontend/features/competitions/championships/components/detail/ChampionshipPoolSelect.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

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
 * The selected pool lives in the `?pool=` query param. Reading a search param is
 * what makes the page render per request, so writing a new one re-renders the
 * server page — and that is what refreshes the leaderboard. This component only
 * writes the URL.
 */
export function ChampionshipPoolSelect({
  pools,
  selectedPoolId,
}: ChampionshipPoolSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tTeams = useTranslations("teams");

  const handlePoolChange = (val: string | number | undefined) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("pool", String(Number(val)));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <Select
      label={tTeams("pool")}
      hideLabel
      value={selectedPoolId}
      onChange={handlePoolChange}
      options={pools.map((pool) => ({
        value: pool.id,
        label: tTeams("poolLabel", { letter: pool.letter }),
      }))}
    />
  );
}

export default ChampionshipPoolSelect;
