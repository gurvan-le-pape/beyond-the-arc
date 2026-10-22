// src/frontend/features/competitions/championships/components/list/tabs/NationalTab.tsx
"use client";

import { useChampionships } from "@/features/competitions/championships/api";
import { useNationalFilterState } from "@/features/competitions/championships/hooks";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipFilters } from "../ChampionshipFilters";
import { ChampionshipTab } from "./ChampionshipTab";

/**
 * The national tab of the championships page.
 *
 * Takes no props and owns everything — filter state, the query, and the list,
 * error and pagination states through `ChampionshipTab`.
 *
 * Unlike its siblings it fetches no scope list, because a national championship
 * has no league or committee above it to filter by.
 *
 * **Pagination indices are converted here** — `ChampionshipTab` reports a
 * zero-based page index while the API counts from one, so `onPageChange` adds
 * the offset, as in the search tabs.
 *
 * The three level tabs hold independent filter state, so switching tabs does
 * not carry one level's category or gender into another.
 */
export function NationalTab() {
  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useNationalFilterState();

  const { data, error, isLoading, refetch } = useChampionships({
    level: CompetitionLevel.NATIONAL,
    category: filters.category,
    gender: filters.gender,
    page: filters.currentPage,
    limit: filters.pageSize,
  });

  return (
    <ChampionshipTab
      level={CompetitionLevel.NATIONAL}
      data={data}
      error={error}
      isLoading={isLoading}
      onRetry={refetch}
      pageSize={filters.pageSize}
      onPageSizeChange={setPageSize}
      onPageChange={(index) => setCurrentPage(index + 1)}
      filters={
        <ChampionshipFilters
          level="national"
          category={filters.category}
          gender={filters.gender}
          onCategoryChange={setters.setCategory}
          onGenderChange={setters.setGender}
          onReset={resetFilters}
        />
      }
    />
  );
}
