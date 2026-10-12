// src/frontend/features/teams/utils/splitMatchHistory.ts
import type { TeamMatchHistory } from "../types/TeamMatchHistory";

/**
 * Splits a team's season into the matches already played and those still to
 * come.
 *
 * A match is played once it has a score. Played matches keep the backend's
 * order, latest first; upcoming ones are reversed so the next match comes
 * first. Mixing the two would bury results under fixtures, since a season in
 * progress has its furthest fixtures at the top of a latest-first list.
 *
 * @param matches - the team's matches, latest first, as `/teams/:id/matches` returns them
 * @returns played matches latest first, upcoming matches soonest first
 */
export function splitMatchHistory(matches: TeamMatchHistory[]): {
  played: TeamMatchHistory[];
  upcoming: TeamMatchHistory[];
} {
  const played = matches.filter((match) => match.homeTeamScore !== null);
  const upcoming = matches
    .filter((match) => match.homeTeamScore === null)
    .reverse();
  return { played, upcoming };
}
