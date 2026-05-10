// src/frontend/features/search/components/TeamsTab.tsx
"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { useTeams } from "@/features/teams/api/use-teams";
import TeamCard from "@/features/teams/components/list/TeamsCard";
import TeamsFilters from "@/features/teams/components/list/TeamsFilters";
import { useTeamsFilterState } from "@/features/teams/hooks/useTeamsFilterState";
import type { Team } from "@/features/teams/types/Team";
import { useRouter } from "@/navigation";
import { SearchTabShell } from "@/shared/components/domain/search/SearchTabShell";
import { EmptyState } from "@/shared/components/feedback";

export function TeamsTab() {
  const tTeams = useTranslations("teams");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    useTeamsFilterState();

  const {
    data: teamsData,
    error: teamsError,
    isLoading,
  } = useTeams({
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

  const teams: Team[] = teamsData?.items ?? [];
  const pagination = teamsData
    ? {
        total: teamsData.total,
        page: teamsData.page,
        limit: teamsData.limit,
        totalPages: teamsData.totalPages,
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
        error={teamsError}
        errorMessage={tCommon("errors.fetchTeams")}
        isEmpty={teams.length === 0}
        emptyState={
          <EmptyState
            icon={<UserGroupIcon className="w-16 h-16" />}
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
        {teams.map((team: Team) => (
          <TeamCard
            key={team.id}
            team={team}
            onClick={(id) => router.push(`/teams/${id}`)}
          />
        ))}
      </SearchTabShell>
    </div>
  );
}
