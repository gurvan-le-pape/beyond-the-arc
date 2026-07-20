// src/frontend/features/competitions/championships/components/list/tabs/NationalTab.tsx
"use client";

import { useChampionships } from "@/features/competitions/championships/api";
import { useNationalFilterState } from "@/features/competitions/championships/hooks";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipFilters } from "../filters/ChampionshipFilters";
import { ChampionshipTab } from "./ChampionshipTab";

export function NationalTab() {
  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useNationalFilterState();

  const { data, error, isLoading } = useChampionships({
    level: CompetitionLevel.NATIONAL,
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
