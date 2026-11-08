// src/frontend/features/search/components/TeamSearchResults.tsx
"use client";

import { Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTeams } from "@/features/teams/api";
import { TeamCard, TeamsFilters } from "@/features/teams/components";
import { useTeamsFilterState } from "@/features/teams/hooks";
import type { Team } from "@/features/teams/types";
import { LIST_ENTITY_CARD_GRID } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import { SearchTabShell } from "@/shared/components/navigation";
import { hasCriteria } from "@/shared/utils";

/**
 * The teams found by the search page, under their tab: its own filter panel,
 * results grid, and pagination.
 *
 * Takes no props and owns everything — filter state, the query, and the
 * loading, error, empty and paginated states via `SearchTabShell`.
 *
 * **Pagination indices are converted here**, as in the sibling tabs: the shell
 * is zero-based, the API is one-based, and `onPageChange` bridges them.
 *
 * The three tabs are deliberately independent — each holds its own filter state,
 * so switching tabs does not carry one tab's filters into another.
 */
export function TeamSearchResults() {
  const tTeams = useTranslations("teams");
  const tCommon = useTranslations("common");
  const tSearch = useTranslations("search");

  const { filters, set, page, pageSize, setPage, setPageSize, reset } =
    useTeamsFilterState();

  const criteria = {
    clubId: filters.club,
    number: filters.number,
    category: filters.category,
    gender: filters.gender,
    level: filters.level,
    committeeId: filters.committee,
    leagueId: filters.league,
    division: filters.division,
    poolId: filters.pool,
  };
  // Nothing is listed until a filter narrows the 60k teams.
  const searching = hasCriteria(criteria);

  const { data, error, isLoading, refetch } = useTeams(
    { ...criteria, page, limit: pageSize },
    { enabled: searching },
  );

  const teams: Team[] = data?.items ?? [];
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
      <TeamsFilters filters={filters} set={set} onReset={reset} />

      <SearchTabShell
        isLoading={isLoading}
        error={error}
        errorMessage={tCommon("errors.fetchTeams")}
        onRetry={refetch}
        isEmpty={teams.length === 0}
        emptyState={
          searching ? (
            <EmptyState
              icon={<Users className="w-16 h-16" />}
              title={tCommon("emptyState.teams")}
              description={tTeams("tryAdjustingFilters")}
            />
          ) : (
            <EmptyState
              icon={<Search className="w-16 h-16" />}
              title={tSearch("prompt.title")}
              description={tSearch("prompt.teams")}
            />
          )
        }
        pagination={pagination}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={(index) => setPage(index + 1)}
        itemLabel={tTeams("itemLabel", { count: pagination?.total ?? 0 })}
      >
        <div className={LIST_ENTITY_CARD_GRID}>
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </SearchTabShell>
    </div>
  );
}
