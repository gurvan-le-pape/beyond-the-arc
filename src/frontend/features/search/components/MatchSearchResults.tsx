// src/frontend/features/search/components/MatchSearchResults.tsx
"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { useMatches } from "@/features/matches/api";
import { MatchesCard, MatchesFilters } from "@/features/matches/components";
import { useMatchesFilterState } from "@/features/matches/hooks";
import type { Match } from "@/features/matches/types";
import { LIST_ENTITY_CARD_GRID } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import { SearchTabShell } from "@/shared/components/navigation";
import { hasCriteria } from "@/shared/utils";

/**
 * The matches found by the search page, under their tab: its own filter panel,
 * results grid, and pagination.
 *
 * Takes no props and owns everything — filter state, the query, and the
 * loading, error, empty and paginated states via `SearchTabShell`.
 *
 * **Pagination indices are converted here**, as in the sibling tabs: the shell
 * is zero-based, the API is one-based, and `onPageChange` bridges them.
 *
 * Carries the deepest filter set of the three — division, pool and matchday on
 * top of the shared level and location cascade — so its query has the most
 * parameters that must stay in step with `useMatchesFilterState`.
 */
export function MatchSearchResults() {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  const tSearch = useTranslations("search");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useMatchesFilterState();

  const criteria = {
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
  };
  // Nothing is listed until something narrows the 600k matches.
  const searching = hasCriteria(criteria);

  const { data, error, isLoading, refetch } = useMatches(
    { ...criteria, page: filters.currentPage, limit: filters.pageSize },
    { enabled: searching },
  );

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
        onRetry={refetch}
        isEmpty={matches.length === 0}
        emptyState={
          searching ? (
            <EmptyState
              icon={<Search className="w-16 h-16" />}
              title={tMatches("noResults")}
              description={tMatches("tryAdjustingFilters")}
            />
          ) : (
            <EmptyState
              icon={<Search className="w-16 h-16" />}
              title={tSearch("prompt.title")}
              description={tSearch("prompt.matches")}
            />
          )
        }
        pagination={pagination}
        pageSize={filters.pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={(index) => setCurrentPage(index + 1)}
        itemLabel={tMatches("itemLabel", { count: pagination?.total ?? 0 })}
      >
        <div className={LIST_ENTITY_CARD_GRID}>
          {matches.map((match) => (
            <MatchesCard key={match.id} match={match} />
          ))}
        </div>
      </SearchTabShell>
    </div>
  );
}
