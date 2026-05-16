// src/frontend/features/search/components/PlayersTab.tsx
"use client";

import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { usePlayers } from "@/features/players/api";
import { PlayerCard, PlayersFilters } from "@/features/players/components";
import { usePlayersFilterState } from "@/features/players/hooks";
import type { Player } from "@/features/players/types";
import { SearchTabShell } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";

export function PlayersTab() {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    usePlayersFilterState();

  const { data, error, isLoading } = usePlayers({
    name: filters.name || undefined,
    clubId: filters.clubId,
    category: filters.category,
    gender: filters.gender,
    number: filters.number,
    teamNumber: filters.teamNumber,
    level: filters.level,
    committeeId: filters.committeeId,
    leagueId: filters.leagueId,
    page: filters.currentPage,
    limit: filters.pageSize,
  });

  const players: Player[] = data?.items ?? [];
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
      <PlayersFilters
        filters={filters}
        setters={setters}
        onReset={resetFilters}
      />

      <SearchTabShell
        isLoading={isLoading}
        error={error}
        errorMessage={tCommon("errors.fetchPlayers")}
        isEmpty={players.length === 0}
        emptyState={
          <EmptyState
            icon={<User className="w-16 h-16" />}
            title={tCommon("emptyState.players")}
            description={tPlayers("tryAdjustingFilters")}
          />
        }
        pagination={pagination}
        pageSize={filters.pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={(index) => setCurrentPage(index + 1)}
        itemLabel={tPlayers("players")}
      >
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </SearchTabShell>
    </div>
  );
}
