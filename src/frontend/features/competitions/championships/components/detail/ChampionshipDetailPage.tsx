// src/frontend/features/competitions/championships/components/detail/ChampionshipDetailPage.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { useLeaderboard } from "@/features/competitions/leaderboards/api";
import { useMatchesByPool, useMatchesPrefetch } from "@/features/matches/api";
import { usePathname, useRouter } from "@/navigation";
import { LeaderboardTable } from "@/shared/components/domain";
import { Select } from "@/shared/components/forms";
import { groupBy } from "@/shared/utils";

import type { Leaderboard } from "../../../leaderboards/types";
import type { Pool } from "../../../pools/types";
import type { CategoryNav, Championship, DivisionNav } from "../../types";
import { ChampionshipBreadcrumb } from "./championship-breadcrumb/_ChampionshipBreadcrumb";
import ChampionshipHeader from "./championship-header/_ChampionshipHeader";
import MatchesPanel from "./championship-matches/_ChampionshipMatches";
import { ChampionshipNavigation } from "./championship-navigation/_ChampionshipNavigation";

interface ChampionshipDetailPageProps {
  readonly championship: Championship;
  readonly pools: Pool[];
  readonly initialPoolId: number;
  readonly initialLeaderboard: Leaderboard[];
  readonly categoryNav: CategoryNav;
  readonly divisionNav: DivisionNav;
}

export function ChampionshipDetailPage({
  championship,
  pools,
  initialPoolId,
  initialLeaderboard,
  categoryNav,
  divisionNav,
}: ChampionshipDetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tPool = useTranslations("pool");

  const selectedPoolId = Number(searchParams.get("pool")) || initialPoolId;

  const { data: leaderboard = [] } = useLeaderboard(
    { poolId: selectedPoolId },
    {
      initialData:
        selectedPoolId === initialPoolId ? initialLeaderboard : undefined,
    },
  );

  const { data: matches = [] } = useMatchesByPool(selectedPoolId);

  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [expandedMatchIds, setExpandedMatchIds] = useState<number[]>([]);

  const groupedMatches = useMemo(
    () => groupBy(matches, (match) => match.matchday),
    [matches],
  );

  useEffect(() => {
    const rounds = Object.keys(groupedMatches)
      .map(Number)
      .sort((a, b) => a - b);
    if (rounds.length > 0 && selectedRound === null) {
      setSelectedRound(rounds[0]);
    }
  }, [groupedMatches, selectedRound]);

  const prefetch = useMatchesPrefetch();

  const handlePoolChange = (val: string | number | undefined) => {
    const poolId = Number(val);
    setSelectedRound(null);
    const next = new URLSearchParams(searchParams.toString());
    next.set("pool", String(poolId));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const toggleExpand = (matchId: number) => {
    setExpandedMatchIds((prev) =>
      prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId],
    );
  };

  return (
    <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row gap-6">
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
            <Select
              value={selectedPoolId}
              onChange={handlePoolChange}
              options={pools.map((pool) => ({
                value: pool.id,
                label: `${tPool("label")} ${pool.letter}`,
                onMouseEnter: () => prefetch.byPool(pool.id),
              }))}
            />
          }
        />
      </div>

      <div className="w-full xl:w-[500px] 2xl:w-[600px]">
        <MatchesPanel
          groupedMatches={groupedMatches}
          selectedRound={selectedRound}
          onSelectRound={setSelectedRound}
          expandedMatchIds={expandedMatchIds}
          onToggleExpand={toggleExpand}
        />
      </div>
    </div>
  );
}

export default ChampionshipDetailPage;
