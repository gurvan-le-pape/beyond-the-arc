// src/frontend/features/players/hooks/usePlayerMatchHistoryColumns.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { formatMatchDateTime } from "@/shared/utils/helpers/date-helpers";

import type { Player } from "../types/Player";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";

export function usePlayerMatchHistoryColumns(player: Player) {
  const t = useTranslations("common");

  return useMemo(() => {
    const renderTeam = (teamName: string, teamId: number) =>
      player.team?.id === teamId ? (
        <span className="font-bold">{teamName}</span>
      ) : (
        <span>{teamName}</span>
      );

    return [
      {
        key: "date",
        header: t("matchHistory.date"),
        render: (match: PlayerMatchHistory) => formatMatchDateTime(match.date),
        align: "left" as const,
        className: "px-6 py-3 text-left text-sm font-semibold",
      },
      {
        key: "match",
        header: t("matchHistory.match"),
        render: (match: PlayerMatchHistory) => (
          <>
            {renderTeam(match.homeTeam.club.name ?? "", match.homeTeam.id)}
            {" vs "}
            {renderTeam(match.awayTeam.club.name ?? "", match.awayTeam.id)}
          </>
        ),
        align: "left" as const,
        className: "px-6 py-3 text-left text-sm font-semibold",
      },
      {
        key: "pts",
        header: t("statAbbreviations.pts"),
        render: (match: PlayerMatchHistory) => match.player.stats.points,
        align: "center" as const,
        className: "px-6 py-3 text-center text-sm font-semibold",
      },
      {
        key: "reb",
        header: t("statAbbreviations.reb"),
        render: (match: PlayerMatchHistory) =>
          match.player.stats.rebounds.total,
        align: "center" as const,
        className: "px-6 py-3 text-center text-sm",
      },
      {
        key: "ast",
        header: t("statAbbreviations.ast"),
        render: (match: PlayerMatchHistory) => match.player.stats.assists,
        align: "center" as const,
        className: "px-6 py-3 text-center text-sm",
      },
      {
        key: "stl",
        header: t("statAbbreviations.stl"),
        render: (match: PlayerMatchHistory) => match.player.stats.steals,
        align: "center" as const,
        className: "px-6 py-3 text-center text-sm",
      },
      {
        key: "blk",
        header: t("statAbbreviations.blk"),
        render: (match: PlayerMatchHistory) => match.player.stats.blocks,
        align: "center" as const,
        className: "px-6 py-3 text-center text-sm",
      },
      {
        key: "to",
        header: t("statAbbreviations.to"),
        render: (match: PlayerMatchHistory) => match.player.stats.turnovers,
        align: "center" as const,
        className: "px-6 py-3 text-center text-sm",
      },
      {
        key: "fl",
        header: t("statAbbreviations.fl"),
        render: (match: PlayerMatchHistory) => match.player.stats.fouls,
        align: "center" as const,
        className: "px-6 py-3 text-center text-sm",
      },
    ];
  }, [t, player.team?.id]);
}

export default usePlayerMatchHistoryColumns;
