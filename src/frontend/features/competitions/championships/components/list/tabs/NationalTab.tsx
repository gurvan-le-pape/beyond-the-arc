// src/frontend/features/competitions/championships/components/list/tabs/NationalTab.tsx
"use client";

import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import { useNationalFilterState } from "@/features/competitions/championships/hooks";
import { SearchTabShell } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import { CompetitionLevel } from "@/shared/constants";

import type { Championship } from "../../../types";
import { ChampionshipCard } from "../ChampionshipCard";
import { NationalFilters } from "../filters/NationalFilters";

export function NationalTab() {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useNationalFilterState();

  const { data, error, isLoading } = useChampionships({
    level: CompetitionLevel.NATIONAL,
    category: filters.category,
    gender: filters.gender,
    page: filters.currentPage,
    limit: filters.pageSize,
  });

  const championships: Championship[] = data?.items ?? [];
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
      <NationalFilters
        filters={filters}
        setters={setters}
        onReset={resetFilters}
      />
      <SearchTabShell
        isLoading={isLoading}
        error={error}
        errorMessage={tCommon("errors.fetchChampionships")}
        isEmpty={championships.length === 0}
        emptyState={
          <EmptyState
            icon={<Trophy className="w-16 h-16" />}
            title={tCommon("emptyState.championships")}
            description={tCompetitions("tryAdjustingFilters")}
          />
        }
        pagination={pagination}
        pageSize={filters.pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={(index) => setCurrentPage(index + 1)}
        itemLabel={tCompetitions("championships")}
      >
        {championships.map((c) => (
          <ChampionshipCard key={c.id} championship={c} />
        ))}
      </SearchTabShell>
    </div>
  );
}
