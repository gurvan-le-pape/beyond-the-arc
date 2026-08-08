// src/frontend/features/competitions/championships/components/list/tabs/RegionalTab.tsx
"use client";

import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import { useRegionalFilterState } from "@/features/competitions/championships/hooks";
import { useLeagues } from "@/features/organizations/leagues/api";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipFilters } from "../filters/ChampionshipFilters";
import { ChampionshipTab } from "./ChampionshipTab";

export function RegionalTab() {
  const tCommon = useTranslations("common");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useRegionalFilterState();

  const { data: leagues = [], error: leaguesError } = useLeagues();

  const { data, error, isLoading } = useChampionships({
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
