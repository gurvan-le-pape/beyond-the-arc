// src/frontend/shared/components/domain/matches/matchHistoryColumns.tsx
import type { ReactNode } from "react";

import { formatMatchDateTime } from "@/shared/utils";

import { MatchTeamLabel } from "./MatchTeamLabel";

interface MatchWithTeams {
  date: Date | string;
  homeTeam: { id: number; club: { name: string } };
  awayTeam: { id: number; club: { name: string } };
}

/**
 * Shared "date" column for match-history tables, built the same way across
 * teams/players/matches features.
 */
export function buildMatchDateColumn<T extends MatchWithTeams>(
  header: ReactNode,
) {
  return {
    key: "date",
    header,
    render: (match: T) => formatMatchDateTime(match.date),
    align: "center" as const,
  };
}

/**
 * Shared "home vs away" matchup column for match-history tables. `currentTeamId`
 * lets MatchTeamLabel highlight whichever side the table is scoped to.
 */
export function buildMatchupColumn<T extends MatchWithTeams>(
  header: ReactNode,
  currentTeamId: number,
) {
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
        {" vs "}
        <MatchTeamLabel
          name={match.awayTeam.club.name}
          teamId={match.awayTeam.id}
          currentTeamId={currentTeamId}
        />
      </>
    ),
    align: "center" as const,
  };
}
