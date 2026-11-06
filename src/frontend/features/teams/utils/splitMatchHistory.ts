// src/frontend/features/teams/utils/splitMatchHistory.ts
import { MatchStatus } from "@/shared/constants";

import type { TeamMatchHistory } from "../types/TeamMatchHistory";

/**
 * Splits a team's season into the matches that are over and those still to
 * come.
 *
 * A failed match is over: it will not be played, so it goes with the results,
 * where its row says the result is unavailable. Past matches keep the backend's
 * order, latest first; upcoming ones are reversed so the next match comes
 * first. Mixing the two would bury results under fixtures, since a season in
 * progress has its furthest fixtures at the top of a latest-first list.
 *
 * @param matches - the team's matches, latest first, as `/teams/:id/matches` returns them
 * @returns past matches latest first, upcoming matches soonest first
 */
export function splitMatchHistory(matches: TeamMatchHistory[]): {
  past: TeamMatchHistory[];
  upcoming: TeamMatchHistory[];
} {
  const isUpcoming = (match: TeamMatchHistory) =>
    match.status === MatchStatus.SCHEDULED ||
    match.status === MatchStatus.GENERATING;

  return {
    past: matches.filter((match) => !isUpcoming(match)),
    upcoming: matches.filter(isUpcoming).reverse(),
  };
}
