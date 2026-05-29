// src/frontend/features/competitions/championships/components/detail/ChampionshipDetailPage.tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { usePathname, useRouter } from "@/navigation";
import { LeaderboardTable } from "@/shared/components/domain";
import { ErrorMessage } from "@/shared/components/feedback";
import { Select } from "@/shared/components/forms";
import { Breadcrumb } from "@/shared/components/navigation";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants";
import { groupBy } from "@/shared/utils";

import { useCategoryNavigation, useDivisionNavigation } from "../../hooks";
import { useChampionshipDetailById } from "../../hooks/useChampionshipsDetailById";
import ChampionshipHeader from "./ChampionshipHeader";
import MatchesPanel from "./matches/MatchesPanel";
import CategoryNavigation from "./navigation/CategoryNavigation";
import DivisionNavigation from "./navigation/DivisionNavigation";

export function ChampionshipDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");
  const tPool = useTranslations("pool");

  const championshipId = Number.parseInt(params?.championshipId as string, 10);
  const poolFromQuery = searchParams.get("pool");
  const initialPoolId = poolFromQuery ? Number(poolFromQuery) : null;

  const {
    championship,
    gender,
    division,
    category,
    pools,
    leaderboards,
    selectedPoolId,
    setSelectedPoolId,
    matches,
    isLoading,
    error,
  } = useChampionshipDetailById(championshipId, initialPoolId);

  const buildRoute = (id: number) => `/championships/${id}`;

  const organizationId =
    championship?.level === CompetitionLevel.DEPARTMENTAL
      ? championship?.committeeId
      : championship?.leagueId;

  const { availableCategories, currentCategory, navigateToCategory } =
    useCategoryNavigation(
      organizationId ?? 0,
      championshipId,
      championship?.level!,
      gender,
      buildRoute,
    );

  const { availableDivisions, currentDivision, navigateToDivision } =
    useDivisionNavigation(
      organizationId ?? 0,
      championship?.level!,
      category,
      gender,
      division,
      buildRoute,
    );

  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [expandedMatchIds, setExpandedMatchIds] = useState<number[]>([]);

  const breadcrumbItems = [
    { label: tCompetitions("breadcrumb"), href: "/championships" },
    { label: championship?.name ?? "…", current: true },
  ];

  const groupedMatches = useMemo(() => {
    if (!selectedPoolId || !matches[selectedPoolId]) return {};
    return groupBy(matches[selectedPoolId], (match) => match.matchday);
  }, [selectedPoolId, matches]);

  useEffect(() => {
    const rounds = Object.keys(groupedMatches).sort(
      (a, b) => Number(a) - Number(b),
    );
    if (rounds.length > 0 && !selectedRound) {
      setSelectedRound(Number(rounds[0]));
    }
  }, [groupedMatches, selectedRound]);

  const handlePoolChange = (val: string | number | undefined) => {
    const poolId = Number(val);
    setSelectedPoolId(poolId);
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

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Text variant="caption">{tCommon("loading")}</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <ErrorMessage message={tCommon("errors.fetchChampionships")} />
      </div>
    );
  }

  if (!championship || pools.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Text variant="caption">{tCompetitions("notFound")}</Text>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row gap-6">
      <div className="w-full xl:flex-1 space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <ChampionshipHeader championship={championship} />

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

        {!!selectedPoolId && leaderboards[selectedPoolId] && (
          <LeaderboardTable
            leaderboards={leaderboards[selectedPoolId] || []}
            dropdown={
              <Select
                value={selectedPoolId}
                onChange={handlePoolChange}
                options={pools.map((pool) => ({
                  value: pool.id,
                  label: `${tPool("label")} ${pool.letter}`,
                }))}
              />
            }
          />
        )}
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
