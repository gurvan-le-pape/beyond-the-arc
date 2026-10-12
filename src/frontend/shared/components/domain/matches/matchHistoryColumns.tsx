// src/frontend/shared/components/domain/matches/matchHistoryColumns.tsx
import type { ReactNode } from "react";

import type { TableColumn } from "@/shared/components/table";
import { formatMatchDateTime } from "@/shared/utils";

interface MatchWithTeams {
  startsAt: Date | string;
  homeTeam: { id: number; club: { name: string } };
  awayTeam: { id: number; club: { name: string } };
}

/**
 * Shared "starts at" column for match-history tables, built the same way across
 * teams/players/matches features.
 */
export function buildMatchDateColumn<T extends MatchWithTeams>(
  header: ReactNode,
  locale: string,
): TableColumn<T> {
  return {
    key: "startsAt",
    header,
    render: (match: T) => formatMatchDateTime(match.startsAt, locale),
    align: "center",
  };
}

/**
 * Shared "opponent" column for match-history tables scoped to one team — a
 * team's own history, or a player's.
 *
 * Every row involves that team, so naming it again on each row only pushes the
 * stat columns off a phone screen. The column names the other side and which
 * side hosted: `describe` is the caller's translator, since "vs"/"at" (or
 * "contre"/"chez") is user-facing text.
 */
export function buildOpponentColumn<T extends MatchWithTeams>(
  header: ReactNode,
  currentTeamId: number,
  describe: (opponent: string, venue: "home" | "away") => string,
): TableColumn<T> {
  return {
    key: "opponent",
    header,
    render: (match: T) =>
      match.homeTeam.id === currentTeamId
        ? describe(match.awayTeam.club.name, "home")
        : describe(match.homeTeam.club.name, "away"),
    align: "left",
  };
}
