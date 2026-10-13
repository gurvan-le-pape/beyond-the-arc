// src/frontend/features/players/hooks/usePlayerMatchHistoryColumns.tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  buildMatchDateColumn,
  buildOpponentColumn,
} from "@/shared/components/domain";
import type { TableColumn } from "@/shared/components/table";

import type { Player } from "../types/Player";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";

/**
 * Column definitions for a player's match-history table: date, opponent, then
 * the per-game stat line.
 *
 * `player` is read only for its team id, which the opponent column needs to
 * tell the other side, and the venue, from this player's point of view. **A
 * player with no team falls back to `-1`**, an id that matches nothing, so
 * every match renders as an away game against its home team rather than
 * throwing.
 *
 * Memoised on the player and locale — the returned array is a new reference
 * only when one of those changes, which is what keeps `DataTable` from
 * re-rendering every row on an unrelated parent update.
 *
 * @param player - the player the table belongs to; supplies the team id
 * @returns column definitions, stable between renders
 */
export function usePlayerMatchHistoryColumns(
  player: Player,
): TableColumn<PlayerMatchHistory>[] {
  const t = useTranslations("common");
  const locale = useLocale();

  return useMemo<TableColumn<PlayerMatchHistory>[]>(
    () => [
      buildMatchDateColumn<PlayerMatchHistory>(t("matchHistory.date"), locale),
      buildOpponentColumn<PlayerMatchHistory>(
        t("matchHistory.opponent"),
        player.team?.id ?? -1,
        (opponent, venue) =>
          venue === "home"
            ? t("matchHistory.opponentHome", { opponent })
            : t("matchHistory.opponentAway", { opponent }),
      ),
      {
        key: "pts",
        header: t("stats.points.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.points,
        numeric: true,
      },
      {
        key: "reb",
        header: t("stats.rebounds.abbr"),
        render: (match: PlayerMatchHistory) =>
          match.player.stats.rebounds.total,
        numeric: true,
      },
      {
        key: "ast",
        header: t("stats.assists.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.assists,
        numeric: true,
      },
      {
        key: "stl",
        header: t("stats.steals.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.steals,
        numeric: true,
      },
      {
        key: "blk",
        header: t("stats.blocks.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.blocks,
        numeric: true,
      },
      {
        key: "to",
        header: t("stats.turnovers.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.turnovers,
        numeric: true,
      },
      {
        key: "fl",
        header: t("stats.fouls.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.fouls,
        numeric: true,
      },
    ],
    [t, locale, player.team?.id],
  );
}

export default usePlayerMatchHistoryColumns;
