// src/frontend/features/matches/utils/groupShotEventsByPlayer.ts
import { Role } from "@/shared/constants";

import type { MatchEvent, Shot } from "../types";

/**
 * Groups a match's shots by the shooting player's id, keeping of each event
 * only what a shot chart reads: its location and type.
 *
 * A shot event is one that has a `shotLocation` and a player who took the
 * shot: `SHOOTER` on a made or missed shot, `BLOCKED` on a blocked one. Other
 * events are ignored. The returned map is keyed by that player's id.
 *
 * @param events - every event in the match; non-shots are skipped
 * @returns shots (location and type) keyed by shooter id — a player who took none has no key at all
 */
export function groupShotEventsByPlayer(
  events: MatchEvent[],
): Record<number, Shot[]> {
  const shotEventsByPlayer: Record<number, Shot[]> = {};

  for (const event of events) {
    const shooter = event.players?.find(
      (p) => p.role === Role.SHOOTER || p.role === Role.BLOCKED,
    );
    if (event.shotLocation === null || !shooter) continue;

    const playerId = shooter.player.id;
    shotEventsByPlayer[playerId] ??= [];
    shotEventsByPlayer[playerId].push({
      x: event.shotLocation.x,
      y: event.shotLocation.y,
      eventType: event.eventType,
    });
  }

  return shotEventsByPlayer;
}
