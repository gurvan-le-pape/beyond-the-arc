// src/frontend/features/competitions/championships/components/list/tabs/RegionalTab.tsx
"use client";

import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import { useRegionalFilterState } from "@/features/competitions/championships/hooks";
import { useLeagues } from "@/features/organizations/leagues/api";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipFilters } from "../filters/ChampionshipFilters";
import { ChampionshipTab } from "./ChampionshipTab";

/**
 * The regional tab of the championships page.
 *
 * Takes no props and owns everything — filter state, the query, and the list,
 * error and pagination states through `ChampionshipTab`.
 *
 * Fetches the league list itself to populate the scope select, and surfaces
 * that lookup's own error and retry separately from the championship query's.
 *
 * **Pagination indices are converted here** — `ChampionshipTab` reports a
 * zero-based page index while the API counts from one, so `onPageChange` adds
 * the offset, as in the search tabs.
 *
 * The three level tabs hold independent filter state, so switching tabs does
 * not carry one level's category or gender into another.
 */
export function RegionalTab() {
  const tCommon = useTranslations("common");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useRegionalFilterState();

  const {
    data: leagues = [],
    error: leaguesError,
    refetch: refetchLeagues,
  } = useLeagues();

  const { data, error, isLoading, refetch } = useChampionships({
    level: CompetitionLevel.REGIONAL,
    id: Number(filters.leagueId) || undefined,
    category: filters.category,
    gender: filters.gender,
    page: filters.currentPage,
    limit: filters.pageSize,
  });

  return (
    <ChampionshipTab
      data={data}
      error={error}
      isLoading={isLoading}
      onRetry={refetch}
      pageSize={filters.pageSize}
      onPageSizeChange={setPageSize}
      onPageChange={(index) => setCurrentPage(index + 1)}
      filters={
        <ChampionshipFilters
          level="regional"
          category={filters.category}
          gender={filters.gender}
          onCategoryChange={setters.setCategory}
          onGenderChange={setters.setGender}
          onReset={resetFilters}
          scopeError={leaguesError ? tCommon("errors.fetchLeagues") : undefined}
          onScopeRetry={refetchLeagues}
          scope={{
            label: tCommon("filters.leagues"),
            allLabel: tCommon("filters.allLeagues"),
            value: filters.leagueId,
            onChange: setters.setLeagueId,
            options: leagues,
          }}
        />
      }
    />
  );
}
