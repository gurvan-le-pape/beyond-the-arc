// src/frontend/features/teams/utils/buildTeamRoster.ts
import type { PlayerMatchHistoryEntry } from "@/features/players/types";

import type { TeamMatchHistory } from "../types/TeamMatchHistory";

/**
 * Groups a team's match participations by player: one entry list per player
 * who belongs to the given team across the provided matches. Used to render
 * the team roster from its match history.
 */
export function buildTeamRoster(
  matches: TeamMatchHistory[],
  teamId: number,
): PlayerMatchHistoryEntry[][] {
  const byPlayerId: Record<number, PlayerMatchHistoryEntry[]> = {};

  for (const match of matches) {
    for (const participant of match.players) {
      if (participant.player.teamId !== teamId) continue;

      const playerId = participant.player.id;
      byPlayerId[playerId] ??= [];
      byPlayerId[playerId].push(participant);
    }
  }

  return Object.values(byPlayerId);
}
