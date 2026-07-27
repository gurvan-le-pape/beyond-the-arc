// src/frontend/features/players/hooks/usePlayerMatchHistoryColumns.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import {
  buildMatchDateColumn,
  buildMatchupColumn,
} from "@/shared/components/domain";
import type { TableColumn } from "@/shared/components/table";

import type { Player } from "../types/Player";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";

export function usePlayerMatchHistoryColumns(
  player: Player,
): TableColumn<PlayerMatchHistory>[] {
  const t = useTranslations("common");

  return useMemo<TableColumn<PlayerMatchHistory>[]>(
    () => [
      buildMatchDateColumn<PlayerMatchHistory>(t("matchHistory.date")),
      buildMatchupColumn<PlayerMatchHistory>(
        t("matchHistory.match"),
        player.team?.id ?? -1,
      ),
      {
        key: "pts",
        header: t("stats.points.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.points,
        align: "center",
      },
      {
        key: "reb",
        header: t("stats.rebounds.abbr"),
        render: (match: PlayerMatchHistory) =>
          match.player.stats.rebounds.total,
        align: "center",
      },
      {
        key: "ast",
        header: t("stats.assists.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.assists,
        align: "center",
      },
      {
        key: "stl",
        header: t("stats.steals.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.steals,
        align: "center",
      },
      {
        key: "blk",
        header: t("stats.blocks.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.blocks,
        align: "center",
      },
      {
        key: "to",
        header: t("stats.turnovers.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.turnovers,
        align: "center",
      },
      {
        key: "fl",
        header: t("stats.fouls.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.fouls,
        align: "center",
      },
    ],
    [t, player.team?.id],
  );
}

export default usePlayerMatchHistoryColumns;
