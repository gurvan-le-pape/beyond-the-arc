// src/frontend/features/search/components/MatchesTab.tsx
"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { useMatches } from "@/features/matches/api";
import { MatchesCard, MatchesFilters } from "@/features/matches/components";
import { useMatchesFilterState } from "@/features/matches/hooks";
import type { Match } from "@/features/matches/types";
import { useRouter } from "@/navigation";
import { SearchTabShell } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";

export function MatchesTab() {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useMatchesFilterState();

  const {
    data: matchesData,
    error,
    isLoading,
  } = useMatches({
    page: filters.currentPage,
    limit: filters.pageSize,
    level: filters.level,
    division: filters.division,
    committeeId: filters.committeeId,
    leagueId: filters.leagueId,
    poolId: filters.poolId,
    matchday: filters.matchday,
    category: filters.category,
    gender: filters.gender,
    date: filters.dateFilter || undefined,
    search: filters.search || undefined,
  });

  const matches = matchesData?.items ?? [];
  const pagination = matchesData
    ? {
        total: matchesData.total,
        page: matchesData.page,
        limit: matchesData.limit,
        totalPages: matchesData.totalPages,
      }
    : null;

  return (
    <div className="space-y-6">
      <MatchesFilters
        filters={filters}
        setters={setters}
        onReset={resetFilters}
      />

      <SearchTabShell
        isLoading={isLoading}
        error={error}
        errorMessage={tCommon("errors.fetchMatches")}
        isEmpty={matches.length === 0}
        emptyState={
          <EmptyState
            icon={<MagnifyingGlassIcon className="w-16 h-16" />}
            title={tMatches("noResults")}
            description={tMatches("tryAdjustingFilters")}
          />
        }
        pagination={pagination}
        pageSize={filters.pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={(index) => setCurrentPage(index + 1)}
        itemLabel={tMatches("itemLabelPlural")}
      >
        {matches.map((match: Match) => (
          <MatchesCard
            key={match.id}
            match={match}
            onClick={(id) => router.push(`/matches/${id}`)}
          />
        ))}
      </SearchTabShell>
    </div>
  );
}
