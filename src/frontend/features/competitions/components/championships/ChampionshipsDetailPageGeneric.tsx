// src/frontend/features/competitions/components/championships/ChampionshipsDetailPageGeneric.tsx
"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import type { Match } from "@/features/matches/types/Match";
import { LeaderboardTable } from "@/shared/components/entity";
import { Footer, Header } from "@/shared/components/layouts";
import { Card, ErrorMessage } from "@/shared/components/ui";
import type { LocalCompetitionLevel } from "@/shared/constants";

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
}

export function ChampionshipsDetailPageGeneric({
  level,
}: ChampionshipsDetailPageProps) {
  const params = useParams();
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");

  const idStr = params?.id as string;
  const championshipIdStr = params?.championshipId as string;

  const id = Number.parseInt(idStr, 10);
  const championshipId = Number.parseInt(championshipIdStr, 10);

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
  } = useChampionshipsDetail(id, championshipId, level);

  // Navigation hooks
  const { availableCategories, currentCategory, navigateToCategory } =
    useCategoryNavigation(id, championshipId, level, gender);

  const { availableDivisions, currentDivision, navigateToDivision } =
    useDivisionNavigation(id, level, category, gender, division);

  const { switchGender } = useGenderNavigation(id, level, gender);

  // Local state
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [expandedMatchIds, setExpandedMatchIds] = useState<number[]>([]);

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
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-body text-gray-600 dark:text-gray-400">
            {tCommon("loading")}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // ============================================================================
  // Error State
  // ============================================================================
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} />
        </main>
        <Footer />
      </div>
    );
  }

  // ============================================================================
  // Not Found State
  // ============================================================================
  if (!championship) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-body text-gray-600 dark:text-gray-400">
            {tCompetitions("notFound")}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // ============================================================================
  // Main Render
  // ============================================================================
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        {/* Wider container for this page - adapts to large screens */}
        <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row gap-6">
          {/* Left Section - Championship Details & Leaderboard */}
          <div className="w-full xl:flex-1 space-y-6">
            {/* Championship Header */}
            <ChampionshipHeader
              regionName={name}
              championshipName={championship.name}
              gender={gender}
              onSwitchGender={switchGender}
            />

            {/* Navigation Card */}
            <Card padding="md">
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
            {selectedPoolId && leaderboards[selectedPoolId] && (
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
      </main>

      <Footer />
    </div>
  );
}

export default ChampionshipsDetailPageGeneric;
