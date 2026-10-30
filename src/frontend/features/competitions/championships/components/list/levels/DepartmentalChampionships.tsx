// src/frontend/features/competitions/championships/components/list/levels/DepartmentalChampionships.tsx
"use client";

import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import { useChampionshipsFilterState } from "@/features/competitions/championships/hooks";
import { useCommittees } from "@/features/organizations/committees/api";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipFilters } from "../ChampionshipFilters";
import { ChampionshipList } from "./ChampionshipList";

/**
 * The departmental championships, listed under their tab of the championships page.
 *
 * Takes no props and owns everything — filter state, the query, and the list,
 * error and pagination states through `ChampionshipList`.
 *
 * Fetches the committee list itself to populate the scope select, and surfaces
 * that lookup's own error and retry separately from the championship query's.
 *
 * **Pagination indices are converted here** — `ChampionshipList` reports a
 * zero-based page index while the API counts from one, so `onPageChange` adds
 * the offset, as in the search tabs.
 *
 * The filters live in the query string, so a filtered list survives a reload
 * and the back button; switching tabs clears them.
 */
export function DepartmentalChampionships() {
  const tCommon = useTranslations("common");

  const { filters, set, page, pageSize, setPage, setPageSize, reset } =
    useChampionshipsFilterState();

  const {
    data: committees = [],
    error: committeesError,
    refetch: refetchCommittees,
  } = useCommittees();

  const { data, error, isLoading, refetch } = useChampionships({
    level: CompetitionLevel.DEPARTMENTAL,
    committeeId: filters.committee,
    category: filters.category,
    gender: filters.gender,
    page,
    limit: pageSize,
  });

  return (
    <ChampionshipList
      level={CompetitionLevel.DEPARTMENTAL}
      data={data}
      error={error}
      isLoading={isLoading}
      onRetry={refetch}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      onPageChange={(index) => setPage(index + 1)}
      filters={
        <ChampionshipFilters
          level="departmental"
          category={filters.category}
          gender={filters.gender}
          onCategoryChange={(category) => set({ category })}
          onGenderChange={(gender) => set({ gender })}
          onReset={reset}
          scopeError={
            committeesError ? tCommon("errors.fetchCommittees") : undefined
          }
          onScopeRetry={refetchCommittees}
          scope={{
            label: tCommon("filters.committees"),
            allLabel: tCommon("filters.allCommittees"),
            value: filters.committee,
            onChange: (committee) => set({ committee }),
            options: committees,
          }}
        />
      }
    />
  );
}
