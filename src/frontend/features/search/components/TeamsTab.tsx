// src/frontend/features/search/components/TeamsTab.tsx
"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { useTeams } from "@/features/teams/api";
import { TeamCard, TeamsFilters } from "@/features/teams/components";
import { useTeamsFilterState } from "@/features/teams/hooks";
import type { Team } from "@/features/teams/types";
import {
  LIST_ENTITY_CARD_GRID,
  SearchTabShell,
} from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";

export function TeamsTab() {
  const tTeams = useTranslations("teams");
  const tCommon = useTranslations("common");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useTeamsFilterState();

  const { data, error, isLoading } = useTeams({
    clubId: filters.clubId,
    number: filters.number,
    category: filters.category,
    gender: filters.gender,
    level: filters.level,
    committeeId: filters.committeeId,
    leagueId: filters.leagueId,
    division: filters.division,
    poolLetter: filters.pool,
    page: filters.currentPage,
    limit: filters.pageSize,
  });

  const teams: Team[] = data?.items ?? [];
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
      <TeamsFilters
        filters={filters}
        setters={setters}
        onReset={resetFilters}
      />

      <SearchTabShell
        isLoading={isLoading}
        error={error}
        errorMessage={tCommon("errors.fetchTeams")}
        isEmpty={teams.length === 0}
        emptyState={
          <EmptyState
            icon={<Users className="w-16 h-16" />}
            title={tCommon("emptyState.teams")}
            description={tTeams("tryAdjustingFilters")}
          />
        }
        pagination={pagination}
        pageSize={filters.pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={(index) => setCurrentPage(index + 1)}
        itemLabel={tTeams("teams")}
      >
        <div className={LIST_ENTITY_CARD_GRID}>
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </SearchTabShell>
    </div>
  );
}
