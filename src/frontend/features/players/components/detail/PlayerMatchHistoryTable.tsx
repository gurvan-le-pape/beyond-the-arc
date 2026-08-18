// src/frontend/features/players/components/detail/PlayerMatchHistoryTable.tsx
// PlayerMatchHistoryTable.tsx
"use client";

import { useTranslations } from "next-intl";

import { MatchHistoryTable } from "@/features/matches/components";

import { usePlayerMatchHistoryColumns } from "../../hooks";
import type { Player } from "../../types/Player";
import type { PlayerMatchHistory } from "../../types/PlayerMatchHistory";

interface PlayerMatchHistoryTableProps {
  readonly player: Player;
  readonly matches: PlayerMatchHistory[];
  readonly maxRows?: number;
}

/**
 * A player's recent matches with their stat line for each.
 *
 * `player` is not rendered — it configures the columns, supplying the team id
 * the matchup column needs to work out which side this player was on. The rows
 * come entirely from `matches`.
 *
 * Shows `maxRows` (5 by default) behind a show-all toggle, so passing the full
 * history is expected rather than wasteful.
 */
export function PlayerMatchHistoryTable({
  player,
  matches,
  maxRows = 5,
}: PlayerMatchHistoryTableProps) {
  const tCommon = useTranslations("common");
  const tPlayers = useTranslations("players");

  const columns = usePlayerMatchHistoryColumns(player);

  return (
    <MatchHistoryTable
      title={tPlayers("playerDetail.matchHistoryTitle")}
      matches={matches}
      columns={columns}
      emptyMessage={tCommon("matchHistory.noMatches")}
      showAllLabel={tCommon("matchHistory.seeAllMatches", {
        count: matches.length,
      })}
      showLessLabel={tCommon("seeLess")}
      maxRows={maxRows}
      density="cozy"
    />
  );
}
