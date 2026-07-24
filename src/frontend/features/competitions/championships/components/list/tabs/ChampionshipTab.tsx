// src/frontend/features/competitions/championships/components/list/tabs/ChampionshipTab.tsx
"use client";

import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { SearchTabShell } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Championship } from "../../../types";
import { ChampionshipCard } from "../ChampionshipCard";

interface ChampionshipTabProps {
  /** The level-specific `<ChampionshipFilters>` element. */
  filters: React.ReactNode;
  data: PaginatedResponse<Championship> | undefined;
  error: ApiError | null;
  isLoading: boolean;
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
  filters,
  data,
  error,
  isLoading,
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
