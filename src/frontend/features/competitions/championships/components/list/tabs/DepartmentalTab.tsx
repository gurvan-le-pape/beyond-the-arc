// src/frontend/features/competitions/championships/components/list/tabs/DepartmentalTab.tsx
"use client";

import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import { useDepartmentalFilterState } from "@/features/competitions/championships/hooks";
import { useCommittees } from "@/features/organizations/committees/api";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipFilters } from "../filters/ChampionshipFilters";
import { ChampionshipTab } from "./ChampionshipTab";

/**
 * The departmental tab of the championships page.
 *
 * Takes no props and owns everything — filter state, the query, and the list,
 * error and pagination states through `ChampionshipTab`.
 *
 * Fetches the committee list itself to populate the scope select, and surfaces
 * that lookup's own error and retry separately from the championship query's.
 *
 * **Pagination indices are converted here** — `ChampionshipTab` reports a
 * zero-based page index while the API counts from one, so `onPageChange` adds
 * the offset, as in the search tabs.
 *
 * The three level tabs hold independent filter state, so switching tabs does
 * not carry one level's category or gender into another.
 */
export function DepartmentalTab() {
  const tCommon = useTranslations("common");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useDepartmentalFilterState();

  const {
    data: committees = [],
    error: committeesError,
    refetch: refetchCommittees,
  } = useCommittees();

  const { data, error, isLoading, refetch } = useChampionships({
    level: CompetitionLevel.DEPARTMENTAL,
    committeeId: Number(filters.committeeId) || undefined,
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
          level="departmental"
          category={filters.category}
          gender={filters.gender}
          onCategoryChange={setters.setCategory}
          onGenderChange={setters.setGender}
          onReset={resetFilters}
          scopeError={
            committeesError ? tCommon("errors.fetchCommittees") : undefined
          }
          onScopeRetry={refetchCommittees}
          scope={{
            label: tCommon("filters.committees"),
            allLabel: tCommon("filters.allCommittees"),
            value: filters.committeeId,
            onChange: setters.setCommitteeId,
            options: committees,
          }}
        />
      }
    />
  );
}
