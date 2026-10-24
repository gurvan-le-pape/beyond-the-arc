// src/frontend/features/matches/utils/transformShotEvents.ts
import { EventCategory } from "@/shared/constants";
import type { ShotEvent } from "@/shared/types";

import { eventConfig } from "../constants";
import type { Shot } from "../types";

/**
 * Turns shots into the plain made/missed points a chart plots.
 *
 * Whether a shot counts as made is read from the event taxonomy's category
 * (`eventConfig`), not from the event-type *name*: the "and-one" family
 * (`3_point_and_1`, `2_point_int_and_1`, `2_point_ext_and_1`) are made
 * baskets whose names do not begin with "made".
 *
 * @param shots - the shots to plot, each with its location and event type
 * @returns one point per shot, in input order
 */
export function transformToShotEvents(shots: Shot[]): ShotEvent[] {
  return shots.map((shot) => ({
    x: shot.x,
    y: shot.y,
    made: eventConfig[shot.eventType]?.eventCategory === EventCategory.MADE,
  }));
}
