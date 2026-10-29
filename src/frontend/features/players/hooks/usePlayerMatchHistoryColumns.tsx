// src/frontend/features/players/hooks/usePlayerMatchHistoryColumns.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { useMatchHistoryColumns } from "@/features/matches/hooks";
import type { TableColumn } from "@/shared/components/table";

import type { Player } from "../types/Player";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";

/**
 * Column definitions for a player's match-history table: date, opponent, then
 * the per-game stat line. On a phone the line keeps only points, so the table
 * fits the screen instead of scrolling past the other six.
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
  const matchColumns = useMatchHistoryColumns<PlayerMatchHistory>(
    player.team?.id ?? -1,
  );

  return useMemo<TableColumn<PlayerMatchHistory>[]>(
    () => [
      ...matchColumns,
      {
        key: "pts",
        header: t("stats.points.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.points,
        numeric: true,
      },
      {
        key: "reb",
        from: "sm",
        header: t("stats.rebounds.abbr"),
        render: (match: PlayerMatchHistory) =>
          match.player.stats.rebounds.total,
        numeric: true,
      },
      {
        key: "ast",
        from: "sm",
        header: t("stats.assists.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.assists,
        numeric: true,
      },
      {
        key: "stl",
        from: "sm",
        header: t("stats.steals.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.steals,
        numeric: true,
      },
      {
        key: "blk",
        from: "sm",
        header: t("stats.blocks.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.blocks,
        numeric: true,
      },
      {
        key: "to",
        from: "sm",
        header: t("stats.turnovers.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.turnovers,
        numeric: true,
      },
      {
        key: "fl",
        from: "sm",
        header: t("stats.fouls.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.fouls,
        numeric: true,
      },
    ],
    [t, matchColumns],
  );
}
