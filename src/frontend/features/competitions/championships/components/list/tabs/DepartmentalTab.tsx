// src/frontend/features/competitions/championships/components/list/tabs/DepartmentalTab.tsx
"use client";

import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import { useDepartmentalFilterState } from "@/features/competitions/championships/hooks";
import { useCommittees } from "@/features/organizations/committees/api";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipFilters } from "../filters/ChampionshipFilters";
import { ChampionshipTab } from "./ChampionshipTab";

export function DepartmentalTab() {
  const tCommon = useTranslations("common");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useDepartmentalFilterState();

  const { data: committees = [] } = useCommittees();

  const { data, error, isLoading } = useChampionships({
    level: CompetitionLevel.DEPARTMENTAL,
    id: Number(filters.committeeId) || undefined,
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
          level="departmental"
          category={filters.category}
          gender={filters.gender}
          onCategoryChange={setters.setCategory}
          onGenderChange={setters.setGender}
          onReset={resetFilters}
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
