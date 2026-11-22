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
import { PaginatedResults } from "@/shared/components/navigation";
import { hasCriteria } from "@/shared/utils";

/**
 * The matches found by the search page, under their tab: its own filter panel,
 * results grid, and pagination.
 *
 * Takes no props and owns everything — filter state, the query, and the
 * loading, error, empty and paginated states via `PaginatedResults`.
 *
 * Carries the deepest filter set of the three — division, pool and matchday on
 * top of the shared level and location cascade — so its query has the most
 * parameters that must stay in step with `useMatchesFilterState`.
 */
export function MatchSearchResults() {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  const tSearch = useTranslations("search");

  const { filters, set, page, pageSize, setPage, setPageSize, reset } =
    useMatchesFilterState();

  const criteria = {
    search: filters.q,
    date: filters.date,
    category: filters.category,
    gender: filters.gender,
    level: filters.level,
    division: filters.division,
    committeeId: filters.committee,
    leagueId: filters.league,
    poolId: filters.pool,
    matchday: filters.matchday,
  };
  // Nothing is listed until something narrows the 600k matches.
  const searching = hasCriteria(criteria);

  const query = useMatches(
    { ...criteria, page, limit: pageSize },
    { enabled: searching },
  );

  const matches: Match[] = query.data?.items ?? [];

  return (
    <div className="space-y-6">
      <MatchesFilters filters={filters} set={set} onReset={reset} />

      <PaginatedResults
        query={query}
        errorMessage={tCommon("errors.fetchMatches")}
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
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={setPage}
        itemLabel={tMatches("itemLabel", { count: query.data?.total ?? 0 })}
      >
        <div className={LIST_ENTITY_CARD_GRID}>
          {matches.map((match) => (
            <MatchesCard key={match.id} match={match} />
          ))}
        </div>
      </PaginatedResults>
    </div>
  );
}
