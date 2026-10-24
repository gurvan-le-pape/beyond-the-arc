// src/frontend/features/competitions/championships/components/list/tabs/ChampionshipTab.tsx
"use client";

import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { EmptyState } from "@/shared/components/feedback";
import { SearchTabShell } from "@/shared/components/navigation";
import type { CompetitionLevel } from "@/shared/constants";
import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Championship } from "../../../types";
import { ChampionshipTable } from "../ChampionshipTable";

interface ChampionshipTabProps {
  /** The tab's level, which decides the table's organiser column. */
  level: CompetitionLevel;
  /** The level-specific `<ChampionshipFilters>` element. */
  filters: React.ReactNode;
  data: PaginatedResponse<Championship> | undefined;
  error: ApiError | null;
  isLoading: boolean;
  /** Re-runs the championships query — see `ErrorMessage`'s `onRetry`. */
  onRetry: () => unknown;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  /** Receives a 0-based page index (as emitted by the pagination control). */
  onPageChange: (index: number) => void;
}

/**
 * Shared body for the National/Regional/Departmental championship tabs.
 * Each level tab owns its own filter-state and scope-data hooks (hooks must
 * be unconditional), then delegates the identical results shell here.
 */
export function ChampionshipTab({
  level,
  filters,
  data,
  error,
  isLoading,
  onRetry,
  pageSize,
  onPageSizeChange,
  onPageChange,
}: Readonly<ChampionshipTabProps>) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const championships = data?.items ?? [];
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
      {filters}
      <SearchTabShell
        isLoading={isLoading}
        error={error}
        errorMessage={tCommon("errors.fetchChampionships")}
        onRetry={onRetry}
        isEmpty={championships.length === 0}
        emptyState={
          <EmptyState
            icon={<Trophy className="w-16 h-16" />}
            title={tCommon("emptyState.championships")}
            description={tCompetitions("tryAdjustingFilters")}
          />
        }
        pagination={pagination}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        itemLabel={tCompetitions("itemLabel", {
          count: pagination?.total ?? 0,
        })}
      >
        <ChampionshipTable
          level={level}
          championships={championships}
          emptyMessage={tCommon("emptyState.championships")}
        />
      </SearchTabShell>
    </div>
  );
}
