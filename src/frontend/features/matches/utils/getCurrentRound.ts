// src/frontend/features/matches/utils/getCurrentRound.ts
import type { Match } from "@/features/matches/types";

import { getSortedRounds } from "./getSortedRounds";

/**
 * The round a visitor most likely wants to see: the latest one with at least
 * one result, so a weekend in progress shows its played and pending games
 * together. Before the first result it is the first round, and with no rounds
 * at all it is `null`.
 *
 * Played-ness comes from the scores, not from the clock, so the server and the
 * browser pick the same round.
 *
 * @param groupedMatches - The pool's matches keyed by matchday
 * @returns The matchday to select, or `null` when there is none
 */
export function getCurrentRound(
  groupedMatches: Record<number, Match[]>,
): number | null {
  const rounds = getSortedRounds(groupedMatches);
  const played = rounds.filter((round) =>
    groupedMatches[round].some((match) => match.homeTeamScore !== null),
  );

  return played[played.length - 1] ?? rounds[0] ?? null;
}
