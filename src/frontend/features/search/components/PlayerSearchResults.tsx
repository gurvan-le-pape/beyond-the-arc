// src/frontend/features/search/components/PlayerSearchResults.tsx
"use client";

import { Search, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { usePlayers } from "@/features/players/api";
import { PlayerCard, PlayersFilters } from "@/features/players/components";
import { usePlayersFilterState } from "@/features/players/hooks";
import type { Player } from "@/features/players/types";
import { LIST_ENTITY_CARD_GRID } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import { PaginatedResults } from "@/shared/components/navigation";
import { hasCriteria } from "@/shared/utils";

/**
 * The players found by the search page, under their tab: its own filter panel,
 * results grid, and pagination.
 *
 * Takes no props and owns everything — filter state, the query, and the
 * loading, error, empty and paginated states via `PaginatedResults`. Mounting it
 * is the whole integration.
 *
 * An empty search box is sent as `undefined` rather than an empty string, so the
 * parameter is omitted from the request instead of filtering on nothing.
 */
export function PlayerSearchResults() {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const tSearch = useTranslations("search");

  const { filters, set, page, pageSize, setPage, setPageSize, reset } =
    usePlayersFilterState();

  const criteria = {
    search: filters.q,
    clubId: filters.club,
    category: filters.category,
    gender: filters.gender,
    number: filters.number,
    teamNumber: filters.teamNumber,
    level: filters.level,
    committeeId: filters.committee,
    leagueId: filters.league,
  };
  // Nothing is listed until something narrows the 722k players: an
  // unfiltered page is an alphabetical slice that answers no question.
  const searching = hasCriteria(criteria);

  const query = usePlayers(
    { ...criteria, page, limit: pageSize },
    { enabled: searching },
  );

  const players: Player[] = query.data?.items ?? [];

  return (
    <div className="space-y-6">
      <PlayersFilters filters={filters} set={set} onReset={reset} />

      <PaginatedResults
        query={query}
        errorMessage={tCommon("errors.fetchPlayers")}
        emptyState={
          searching ? (
            <EmptyState
              icon={<User className="w-16 h-16" />}
              title={tCommon("emptyState.players")}
              description={tPlayers("tryAdjustingFilters")}
            />
          ) : (
            <EmptyState
              icon={<Search className="w-16 h-16" />}
              title={tSearch("prompt.title")}
              description={tSearch("prompt.players")}
            />
          )
        }
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={setPage}
        itemLabel={tPlayers("itemLabel", { count: query.data?.total ?? 0 })}
      >
        <div className={LIST_ENTITY_CARD_GRID}>
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </PaginatedResults>
    </div>
  );
}
