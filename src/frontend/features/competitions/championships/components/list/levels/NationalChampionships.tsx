// src/frontend/features/competitions/championships/components/list/levels/NationalChampionships.tsx
"use client";

import { useChampionships } from "@/features/competitions/championships/api";
import { useChampionshipsFilterState } from "@/features/competitions/championships/hooks";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipFilters } from "../ChampionshipFilters";
import { ChampionshipList } from "./ChampionshipList";

/**
 * The national championships, listed under their tab of the championships page.
 *
 * Takes no props and owns everything — filter state, the query, and the list,
 * error and pagination states through `ChampionshipList`.
 *
 * Unlike its siblings it fetches no scope list, because a national championship
 * has no league or committee above it to filter by.
 *
 * **Pagination indices are converted here** — `ChampionshipList` reports a
 * zero-based page index while the API counts from one, so `onPageChange` adds
 * the offset, as in the search tabs.
 *
 * The filters live in the query string, so a filtered list survives a reload
 * and the back button; switching tabs clears them.
 */
export function NationalChampionships() {
  const { filters, set, page, pageSize, setPage, setPageSize, reset } =
    useChampionshipsFilterState();

  const { data, error, isLoading, refetch } = useChampionships({
    level: CompetitionLevel.NATIONAL,
    category: filters.category,
    gender: filters.gender,
    page,
    limit: pageSize,
  });

  return (
    <ChampionshipList
      level={CompetitionLevel.NATIONAL}
      data={data}
      error={error}
      isLoading={isLoading}
      onRetry={refetch}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      onPageChange={(index) => setPage(index + 1)}
      filters={
        <ChampionshipFilters
          level="national"
          category={filters.category}
          gender={filters.gender}
          onCategoryChange={(category) => set({ category })}
          onGenderChange={(gender) => set({ gender })}
          onReset={reset}
        />
      }
    />
  );
}
