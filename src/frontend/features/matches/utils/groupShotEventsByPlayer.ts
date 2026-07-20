// src/frontend/features/matches/utils/groupShotEventsByPlayer.ts
import { Role } from "@/shared/constants";

import type { MatchEvent } from "../types";

/**
 * Groups a match's shot events by the shooting player's id.
 *
 * A shot event is one that has a `shotLocation` and a player in the
 * `SHOOTER` role; other events are ignored. The returned map is keyed by
 * that shooter's player id.
 */
export function groupShotEventsByPlayer(
  events: MatchEvent[],
): Record<number, MatchEvent[]> {
  const shotEventsByPlayer: Record<number, MatchEvent[]> = {};

  for (const event of events) {
    const shooter = event.players?.find((p) => p.role === Role.SHOOTER);
    if (event.shotLocation === null || !shooter) continue;

    const playerId = shooter.player.id;
    shotEventsByPlayer[playerId] ??= [];
    shotEventsByPlayer[playerId].push(event);
  }

  return shotEventsByPlayer;
}
