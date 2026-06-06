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
import { Breadcrumb } from "@/shared/components/navigation";
import { Card } from "@/shared/components/primitives";
import type { Category } from "@/shared/constants";
import { groupBy } from "@/shared/utils";

import type { Leaderboard } from "../../../leaderboards/types";
import type { Pool } from "../../../pools/types";
import { useCategoryNavigation, useDivisionNavigation } from "../../hooks";
import type { Championship } from "../../types";
import ChampionshipHeader from "./ChampionshipHeader";
import MatchesPanel from "./matches/MatchesPanel";
import CategoryNavigation from "./navigation/CategoryNavigation";
import DivisionNavigation from "./navigation/DivisionNavigation";

interface CategoryNav {
  categoryMap: Record<Category, number>;
  availableCategories: Category[];
  currentCategory: Category | undefined;
}

interface DivisionNav {
  divisionMap: Record<number, number>;
  availableDivisions: number[];
  currentDivision: number | undefined;
}

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
  const tCompetitions = useTranslations("competitions");
  const tPool = useTranslations("pool");

  const selectedPoolId = Number(searchParams.get("pool")) || initialPoolId;

  const buildRoute = (id: number) => `/championships/${id}`;

  const { navigateToCategory } = useCategoryNavigation(
    categoryNav.categoryMap,
    buildRoute,
  );

  const { navigateToDivision } = useDivisionNavigation(
    divisionNav.divisionMap,
    buildRoute,
  );

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

  const breadcrumbItems = [
    { label: tCompetitions("breadcrumb"), href: "/championships" },
    { label: championship.name, current: true },
  ];

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
        <Breadcrumb items={breadcrumbItems} />

        <ChampionshipHeader championship={championship} />

        <Card variant="highlighted" padding="md">
          <div className="space-y-4">
            <CategoryNavigation
              availableCategories={categoryNav.availableCategories}
              currentCategory={categoryNav.currentCategory}
              onNavigate={navigateToCategory}
            />
            <DivisionNavigation
              availableDivisions={divisionNav.availableDivisions}
              currentDivision={divisionNav.currentDivision}
              onNavigate={navigateToDivision}
            />
          </div>
        </Card>

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
