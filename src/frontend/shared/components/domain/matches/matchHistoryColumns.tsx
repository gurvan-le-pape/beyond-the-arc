// src/frontend/shared/components/domain/matches/matchHistoryColumns.tsx
import type { ReactNode } from "react";

import type { TableColumn } from "@/shared/components/table";
import { formatMatchDateTime } from "@/shared/utils";

import { MatchTeamLabel } from "./MatchTeamLabel";

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
 * Shared "home vs away" matchup column for match-history tables. `currentTeamId`
 * lets MatchTeamLabel highlight whichever side the table is scoped to.
 *
 * `separator` is the caller's string — the "vs" between the two club names is
 * visible user-facing text, so it is resolved by the caller's translator, not
 * hardcoded here in one language.
 */
export function buildMatchupColumn<T extends MatchWithTeams>(
  header: ReactNode,
  currentTeamId: number,
  separator: string,
): TableColumn<T> {
  return {
    key: "match",
    header,
    render: (match: T) => (
      <>
        <MatchTeamLabel
          name={match.homeTeam.club.name}
          teamId={match.homeTeam.id}
          currentTeamId={currentTeamId}
        />
        {separator}
        <MatchTeamLabel
          name={match.awayTeam.club.name}
          teamId={match.awayTeam.id}
          currentTeamId={currentTeamId}
        />
      </>
    ),
    align: "center",
  };
}
