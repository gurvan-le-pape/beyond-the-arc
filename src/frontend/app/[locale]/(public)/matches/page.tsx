// src/frontend/app/[locale]/(public)/matches/page.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useChampionships } from "@/features/competitions/championships/api";
import { usePoolsByChampionshipIds } from "@/features/competitions/pools/api/use-pools";
import { useMatches } from "@/features/matches/api/use-matches";
import { MatchesCard, MatchesFilters } from "@/features/matches/components";
import type { Match } from "@/features/matches/types/Match";
import { useCommittees } from "@/features/organizations/committees/api/use-committees";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";
import { useRouter } from "@/navigation";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
} from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Card } from "@/shared/components/primitives";
import { Pagination } from "@/shared/components/table";
import type { Gender } from "@/shared/constants";
import { Category, CompetitionLevel } from "@/shared/constants";
import type { Pagination as PaginationType } from "@/shared/types";

export default function MatchesPage() {
  const router = useRouter();
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  // State
  // Filters
  const [level, setLevel] = useState<CompetitionLevel | undefined>(undefined);
  const [division, setDivision] = useState<number | undefined>(undefined);
  const [committeeId, setCommitteeId] = useState<number | undefined>(undefined);
  const [leagueId, setLeagueId] = useState<number | undefined>(undefined);
  const [poolId, setPoolId] = useState<number | undefined>(undefined);
  const [matchday, setMatchday] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage, setMatchesPerPage] = useState(50);

  // Fetch committees and leagues
  const { data: committees = [] } = useCommittees();
  const { data: leagues = [] } = useLeagues();

  const isDepartmental =
    level === CompetitionLevel.DEPARTMENTAL && committeeId !== undefined;
  const isRegional =
    level === CompetitionLevel.REGIONAL && leagueId !== undefined;

  let championshipsFilter: { level: CompetitionLevel; id: number } | undefined;
  if (isDepartmental) {
    championshipsFilter = {
      level: CompetitionLevel.DEPARTMENTAL,
      id: committeeId,
    };
  } else if (isRegional) {
    championshipsFilter = { level: CompetitionLevel.REGIONAL, id: leagueId };
  }

  const { data: championships = [] } = useChampionships(championshipsFilter, {
    enabled: isDepartmental || isRegional,
  });

  const championshipIdsForDivision = championships
    .filter((c) => String(c.division) === String(division))
    .map((c) => c.id);

  const { data: pools = [] } = usePoolsByChampionshipIds(
    division ? championshipIdsForDivision : [],
  );

  const {
    data: matchesData,
    error: matchesError,
    isLoading: matchesLoading,
  } = useMatches({
    page: currentPage,
    limit: matchesPerPage,
    level: level ?? undefined,
    division: division ?? undefined,
    committeeId,
    leagueId,
    poolId,
    matchday: matchday ?? undefined,
    category: category ?? undefined,
    gender: gender ?? undefined,
    date: dateFilter || undefined,
    search: search || undefined,
  });

  const matches = matchesData?.items ?? [];
  const pagination: PaginationType | null = matchesData
    ? {
        total: matchesData.total,
        page: matchesData.page,
        limit: matchesData.limit,
        totalPages: matchesData.totalPages,
      }
    : null;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    level,
    division,
    committeeId,
    leagueId,
    category,
    gender,
    search,
    poolId,
    matchday,
    dateFilter,
  ]);

  // Reset dependent filters when parent changes
  useEffect(() => {
    setCommitteeId(undefined);
    setLeagueId(undefined);
    setDivision(undefined);
    setPoolId(undefined);
  }, [level]);

  useEffect(() => {
    setDivision(undefined);
    setPoolId(undefined);
  }, [committeeId, leagueId]);

  useEffect(() => {
    setPoolId(undefined);
    setMatchday(undefined);
  }, [division]);

  // Handle reset filters
  const handleReset = () => {
    setLevel(CompetitionLevel.ALL);
    setDivision(undefined);
    setCommitteeId(undefined);
    setLeagueId(undefined);
    setPoolId(undefined);
    setMatchday(undefined);
    setCategory(Category.ALL);
    setGender(undefined);
    setSearch("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const errorMessage = matchesError ? tCommon("errors.fetchMatches") : null;

  return (
    <PageLayout>
      {/* Page Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
        {tMatches("searchTitle")}
      </h1>

      {/* Filters Section */}
      <MatchesFilters
        search={search}
        setSearch={setSearch}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        category={category}
        setCategory={setCategory}
        gender={gender}
        setGender={setGender}
        level={level}
        setLevel={setLevel}
        committeeId={committeeId}
        setCommitteeId={setCommitteeId}
        leagueId={leagueId}
        setLeagueId={setLeagueId}
        committees={committees}
        leagues={leagues}
        division={division}
        setDivision={setDivision}
        poolId={poolId}
        setPoolId={setPoolId}
        matchday={matchday}
        setMatchday={setMatchday}
        championships={championships}
        pools={pools}
        onReset={handleReset}
      />

      {/* Loading State */}
      {matchesLoading && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {errorMessage && !matchesLoading && (
        <ErrorMessage message={errorMessage} />
      )}

      {/* Results */}
      {!matchesLoading && !errorMessage && (
        <>
          {/* Empty State */}
          {matches.length === 0 ? (
            <Card padding="lg">
              <EmptyState
                icon={<MagnifyingGlassIcon className="w-16 h-16" />}
                title={tMatches("noResults")}
                description={tMatches("tryAdjustingFilters")}
              />
            </Card>
          ) : (
            <>
              {/* Matches List */}
              <div className="space-y-4 mb-6">
                {matches.map((match: Match) => (
                  <MatchesCard
                    key={match.id}
                    match={match}
                    onClick={(matchId) => router.push(`/matches/${matchId}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  pagination={pagination}
                  pageSize={matchesPerPage}
                  setPageSize={(size: number) => {
                    setMatchesPerPage(size);
                    setCurrentPage(1);
                  }}
                  setPageIndex={(index: number) => setCurrentPage(index + 1)}
                  label={tMatches("itemLabelPlural")}
                />
              )}
            </>
          )}
        </>
      )}
    </PageLayout>
  );
}
