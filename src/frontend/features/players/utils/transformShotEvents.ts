// src/frontend/features/players/utils/transformShotEvents.ts
import type { MatchEvent } from "@/features/matches/types";
import type { ShotEvent } from "@/shared/types";

/**
 * Narrows raw match events down to the shots a chart can plot.
 *
 * **Lossy on purpose** — events with no `shotLocation` are dropped, so the
 * result is shorter than the input and indices do not line up between the two.
 * Never zip them together.
 *
 * Whether a shot counts as made is decided by the `eventType` string starting
 * with `"made"`. That couples this to the event-type naming convention rather
 * than to a field: rename those constants and every shot silently reads as
 * missed, with no type error anywhere.
 *
 * @param events - raw match events, shots and non-shots alike
 * @returns one entry per located shot, in input order
 */
export function transformToShotEvents(events: MatchEvent[]): ShotEvent[] {
  return events
    .filter((e) => e.shotLocation !== null)
    .map((e) => ({
      x: e.shotLocation!.x,
      y: e.shotLocation!.y,
      made: e.eventType.startsWith("made"),
    }));
}
