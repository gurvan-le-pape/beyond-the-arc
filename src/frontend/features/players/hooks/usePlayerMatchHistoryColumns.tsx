// src/frontend/features/players/hooks/usePlayerMatchHistoryColumns.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { MatchTeamLabel } from "@/shared/components/domain";
import { formatMatchDateTime } from "@/shared/utils";

import type { Player } from "../types/Player";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";

export function usePlayerMatchHistoryColumns(player: Player) {
  const t = useTranslations("common");

  return useMemo(
    () => [
      {
        key: "date",
        header: t("matchHistory.date"),
        render: (match: PlayerMatchHistory) => formatMatchDateTime(match.date),
        align: "center" as const,
      },
      {
        key: "match",
        header: t("matchHistory.match"),
        render: (match: PlayerMatchHistory) => (
          <>
            <MatchTeamLabel
              name={match.homeTeam.club.name}
              teamId={match.homeTeam.id}
              currentTeamId={player.team?.id ?? -1}
            />
            {" vs "}
            <MatchTeamLabel
              name={match.awayTeam.club.name}
              teamId={match.awayTeam.id}
              currentTeamId={player.team?.id ?? -1}
            />
          </>
        ),
        align: "center" as const,
      },
      {
        key: "pts",
        header: t("stats.points.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.points,
        align: "center" as const,
      },
      {
        key: "reb",
        header: t("stats.rebounds.abbr"),
        render: (match: PlayerMatchHistory) =>
          match.player.stats.rebounds.total,
        align: "center" as const,
      },
      {
        key: "ast",
        header: t("stats.assists.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.assists,
        align: "center" as const,
      },
      {
        key: "stl",
        header: t("stats.steals.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.steals,
        align: "center" as const,
      },
      {
        key: "blk",
        header: t("stats.blocks.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.blocks,
        align: "center" as const,
      },
      {
        key: "to",
        header: t("stats.turnovers.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.turnovers,
        align: "center" as const,
      },
      {
        key: "fl",
        header: t("stats.fouls.abbr"),
        render: (match: PlayerMatchHistory) => match.player.stats.fouls,
        align: "center" as const,
      },
    ],
    [t, player.team?.id],
  );
}

export default usePlayerMatchHistoryColumns;
