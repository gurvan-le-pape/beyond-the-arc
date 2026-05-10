// src/frontend/features/search/components/PlayersTab.tsx
"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { usePlayers } from "@/features/players/api/use-players";
import { PlayerCard, PlayersFilters } from "@/features/players/components";
import { usePlayersFilterState } from "@/features/players/hooks/usePlayersFilterState";
import type { Player } from "@/features/players/types/Player";
import { useRouter } from "@/navigation";
import { SearchTabShell } from "@/shared/components/domain/search/SearchTabShell";
import { EmptyState } from "@/shared/components/feedback";

export function PlayersTab() {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    usePlayersFilterState();

  const {
    data: playersData,
    error: playersError,
    isLoading,
  } = usePlayers({
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

  const players: Player[] = playersData?.items ?? [];
  const pagination = playersData
    ? {
        total: playersData.total,
        page: playersData.page,
        limit: playersData.limit,
        totalPages: playersData.totalPages,
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
        error={playersError}
        errorMessage={tCommon("errors.fetchPlayers")}
        isEmpty={players.length === 0}
        emptyState={
          <EmptyState
            icon={<UserIcon className="w-16 h-16" />}
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
        {players.map((player: Player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onClick={(id) => router.push(`/players/${id}`)}
          />
        ))}
      </SearchTabShell>
    </div>
  );
}
