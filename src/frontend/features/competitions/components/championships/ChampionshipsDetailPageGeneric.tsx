// src/frontend/features/competitions/components/championships/ChampionshipsDetailPageGeneric.tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import type { Match } from "@/features/matches/types/Match";
import { usePathname, useRouter } from "@/navigation";
import { LeaderboardTable } from "@/shared/components/domain";
import { ErrorMessage } from "@/shared/components/feedback";
import { Breadcrumb } from "@/shared/components/navigation";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import type { LocalCompetitionLevel } from "@/shared/constants";
import { CompetitionLevel } from "@/shared/constants";

import {
  useCategoryNavigation,
  useChampionshipsDetail,
  useDivisionNavigation,
  useGenderNavigation,
} from "../../hooks";
import MatchesPanel from "../matches/MatchesPanel";
import CategoryNavigation from "../navigation/CategoryNavigation";
import DivisionNavigation from "../navigation/DivisionNavigation";
import PoolDropdown from "../navigation/PoolDropdown";
import ChampionshipHeader from "./ChampionshipHeader";

interface ChampionshipsDetailPageProps {
  readonly level: LocalCompetitionLevel;
  readonly organizationId: number;
}

export function ChampionshipsDetailPageGeneric({
  level,
  organizationId,
}: ChampionshipsDetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");

  const championshipIdStr = params?.championshipId as string;
  const championshipId = Number.parseInt(championshipIdStr, 10);

  const poolFromQuery = searchParams.get("pool");
  const initialPoolId = poolFromQuery ? Number(poolFromQuery) : null;

  // Data hook - using React Query under the hood
  const {
    championship,
    name,
    category,
    gender,
    division,
    pools,
    leaderboards,
    selectedPoolId,
    setSelectedPoolId,
    matches,
    isLoading,
    error,
  } = useChampionshipsDetail(
    organizationId,
    championshipId,
    level,
    initialPoolId,
  );

  // Navigation hooks
  const { availableCategories, currentCategory, navigateToCategory } =
    useCategoryNavigation(organizationId, championshipId, level, gender);

  const { availableDivisions, currentDivision, navigateToDivision } =
    useDivisionNavigation(organizationId, level, category, gender, division);

  const { switchGender } = useGenderNavigation(organizationId, level, gender);

  // Local state
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [expandedMatchIds, setExpandedMatchIds] = useState<number[]>([]);

  // Breadcrumb
  const isRegional = level === CompetitionLevel.REGIONAL;
  const levelLabel = isRegional
    ? tCompetitions("regional.label")
    : tCompetitions("departmental.label");
  const levelPath = isRegional
    ? `/competitions/${CompetitionLevel.REGIONAL}`
    : `/competitions/${CompetitionLevel.DEPARTMENTAL}`;
  const orgPath = `${levelPath}/${organizationId}`;

  const breadcrumbItems = [
    { label: tCompetitions("breadcrumb"), href: "/competitions" },
    { label: levelLabel, href: levelPath },
    { label: name ?? "…", href: orgPath },
    { label: championship?.name ?? "…", current: true },
  ];

  // Group matches by round (memoized)
  const groupedMatches = useMemo(() => {
    if (!selectedPoolId || !matches[selectedPoolId]) {
      return {};
    }

    const matchArr = Array.isArray(matches[selectedPoolId])
      ? matches[selectedPoolId]
      : [];

    return matchArr.reduce((acc, match: Match) => {
      const round = match.matchday || 0;

      if (!acc[round]) acc[round] = [];
      acc[round].push(match);

      return acc;
    }, {} as Record<number, Match[]>);
  }, [selectedPoolId, matches]);

  // Auto-select first round when grouped matches change
  useEffect(() => {
    const rounds = Object.keys(groupedMatches).sort(
      (a, b) => Number(a) - Number(b),
    );
    if (rounds.length > 0 && !selectedRound) {
      setSelectedRound(Number(rounds[0]));
    }
  }, [groupedMatches, selectedRound]);

  // Handlers
  const handlePoolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const poolId = Number.parseInt(event.target.value);
    setSelectedPoolId(poolId);

    // keep URL in sync so sharing/refreshing preserves selection
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

  // ============================================================================
  // Loading State
  // ============================================================================
  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Text variant="caption">{tCommon("loading")}</Text>
      </div>
    );
  }

  // ============================================================================
  // Error State
  // ============================================================================
  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <ErrorMessage message={tCommon("errors.fetchChampionships")} />
      </div>
    );
  }

  // ============================================================================
  // Not Found State
  // ============================================================================
  if (!championship || pools.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Text variant="caption">{tCompetitions("notFound")}</Text>
      </div>
    );
  }

  // ============================================================================
  // Main Render
  // ============================================================================
  return (
    <>
      {/* Wider container for this page - adapts to large screens */}
      <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row gap-6">
        {/* Left Section - Championship Details & Leaderboard */}
        <div className="w-full xl:flex-1 space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Championship Header */}
          <ChampionshipHeader
            regionName={name}
            championshipName={championship.name}
            gender={gender}
            onSwitchGender={switchGender}
          />

          {/* Navigation Card */}
          <Card variant="highlighted" padding="md">
            <div className="space-y-4">
              <CategoryNavigation
                availableCategories={availableCategories}
                currentCategory={currentCategory}
                onNavigate={navigateToCategory}
              />

              <DivisionNavigation
                availableDivisions={availableDivisions}
                currentDivision={currentDivision}
                onNavigate={navigateToDivision}
              />
            </div>
          </Card>

          {/* Leaderboard Table */}
          {!!selectedPoolId && leaderboards[selectedPoolId] && (
            <LeaderboardTable
              leaderboards={leaderboards[selectedPoolId] || []}
              dropdown={
                <PoolDropdown
                  pools={pools}
                  selectedPoolId={selectedPoolId}
                  onChange={handlePoolChange}
                />
              }
            />
          )}
        </div>

        {/* Right Section - Rounds & Matches */}
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
    </>
  );
}

export default ChampionshipsDetailPageGeneric;
