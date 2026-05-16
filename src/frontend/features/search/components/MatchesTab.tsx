// src/frontend/features/search/components/MatchesTab.tsx
"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { useMatches } from "@/features/matches/api";
import { MatchesCard, MatchesFilters } from "@/features/matches/components";
import { useMatchesFilterState } from "@/features/matches/hooks";
import type { Match } from "@/features/matches/types";
import { SearchTabShell } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";

export function MatchesTab() {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useMatchesFilterState();

  const { data, error, isLoading } = useMatches({
    search: filters.search || undefined,
    date: filters.dateFilter || undefined,
    category: filters.category,
    gender: filters.gender,
    level: filters.level,
    division: filters.division,
    committeeId: filters.committeeId,
    leagueId: filters.leagueId,
    poolId: filters.poolId,
    matchday: filters.matchday,
    page: filters.currentPage,
    limit: filters.pageSize,
  });

  const matches: Match[] = data?.items ?? [];
  const pagination = data
    ? {
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
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
            icon={<Search className="w-16 h-16" />}
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
        {matches.map((match) => (
          <MatchesCard key={match.id} match={match} />
        ))}
      </SearchTabShell>
    </div>
  );
}
