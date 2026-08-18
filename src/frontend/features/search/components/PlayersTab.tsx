// src/frontend/features/search/components/PlayersTab.tsx
"use client";

import { User } from "lucide-react";
import { useTranslations } from "next-intl";

import { usePlayers } from "@/features/players/api";
import { PlayerCard, PlayersFilters } from "@/features/players/components";
import { usePlayersFilterState } from "@/features/players/hooks";
import type { Player } from "@/features/players/types";
import {
  LIST_ENTITY_CARD_GRID,
  SearchTabShell,
} from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";

/**
 * The players tab of the search page: its own filter panel, results grid, and
 * pagination.
 *
 * Takes no props and owns everything — filter state, the query, and the
 * loading, error, empty and paginated states via `SearchTabShell`. Mounting it
 * is the whole integration.
 *
 * **Pagination indices are converted here.** The shell reports a zero-based page
 * index while the API counts from one, so `onPageChange` adds the offset. Wiring
 * a page control straight to the API param would be off by one, silently, and
 * only on page two onward.
 *
 * An empty search box is sent as `undefined` rather than an empty string, so the
 * parameter is omitted from the request instead of filtering on nothing.
 */
export function PlayersTab() {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");

  const { filters, setters, setCurrentPage, setPageSize, resetFilters } =
    usePlayersFilterState();

  const { data, error, isLoading, refetch } = usePlayers({
    search: filters.name || undefined,
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
        onRetry={refetch}
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
        itemLabel={tPlayers("itemLabel", { count: pagination?.total ?? 0 })}
      >
        <div className={LIST_ENTITY_CARD_GRID}>
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </SearchTabShell>
    </div>
  );
}
