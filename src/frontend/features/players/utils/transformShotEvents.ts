// src/frontend/features/players/utils/transformShotEvents.ts
import { eventConfig } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import { EventCategory } from "@/shared/constants";
import type { ShotEvent } from "@/shared/types";

/**
 * Narrows raw match events down to the shots a chart can plot.
 *
 * **Lossy on purpose** — events with no `shotLocation` are dropped, so the
 * result is shorter than the input and indices do not line up between the two.
 * Never zip them together.
 *
 * Whether a shot counts as made is read from the event taxonomy's category
 * (`eventConfig`), not from the event-type *name*: the old
 * `eventType.startsWith("made")` check silently plotted the "and-one" family
 * (`3_point_and_1`, `2_point_int_and_1`, `2_point_ext_and_1`) as misses,
 * because those names do not begin with "made".
 *
 * @param events - raw match events, shots and non-shots alike
 * @returns one entry per located shot, in input order
 */
export function transformToShotEvents(events: MatchEvent[]): ShotEvent[] {
  return events.flatMap((e) => {
    const location = e.shotLocation;
    if (!location) return [];

    return [
      {
        x: location.x,
        y: location.y,
        made: eventConfig[e.eventType]?.eventCategory === EventCategory.MADE,
      },
    ];
  });
}
