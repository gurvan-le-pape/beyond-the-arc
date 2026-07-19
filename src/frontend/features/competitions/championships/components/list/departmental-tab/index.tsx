// src/frontend/features/competitions/championships/components/list/departmental-tab/index.tsx
"use client";

import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import { useDepartmentalFilterState } from "@/features/competitions/championships/hooks";
import { useCommittees } from "@/features/organizations/committees/api";
import { SearchTabShell } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import { CompetitionLevel } from "@/shared/constants";

import type { Championship } from "../../../types";
import { ChampionshipCard } from "../ChampionshipCard";
import { DepartmentalFilters } from "./DepartmentalFilters";

export function DepartmentalTab() {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

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
      <DepartmentalFilters
        filters={filters}
        setters={setters}
        committees={committees}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {championships.map((c) => (
            <ChampionshipCard key={c.id} championship={c} />
          ))}
        </div>
      </SearchTabShell>
    </div>
  );
}
