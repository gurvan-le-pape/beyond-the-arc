// src/frontend/features/players/utils/transformShotEvents.ts
import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import type { ShotEvent } from "@/shared/types/ShotEvent";

export function transformToShotEvents(events: MatchEvent[]): ShotEvent[] {
  return events
    .filter((e) => e.shotLocation !== null)
    .map((e) => ({
      x: e.shotLocation!.x,
      y: e.shotLocation!.y,
      made: e.eventType.startsWith("made"),
    }));
}
