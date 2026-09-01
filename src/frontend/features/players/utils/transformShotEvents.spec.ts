// src/frontend/features/players/utils/transformShotEvents.spec.ts
import { describe, expect, it } from "vitest";

import type { MatchEvent } from "@/features/matches/types";

import { transformToShotEvents } from "./transformShotEvents";

/**
 * Builds a minimal located shot event. The payload fields other than
 * `eventType` and `shotLocation` are irrelevant to the transform, so they are
 * filled with the smallest valid values the DTO accepts.
 */
function shotEvent(
  eventType: MatchEvent["eventType"],
  shotLocation: { x: number; y: number } | null,
): MatchEvent {
  return {
    id: 1,
    matchId: 2,
    eventType,
    occurredAt: "2024-02-05T19:02:00.000Z",
    description: null,
    players: [],
    shotLocation,
  } as MatchEvent;
}

describe("transformToShotEvents", () => {
  it("drops events without a shot location", () => {
    const result = transformToShotEvents([
      shotEvent("tip_off", null),
      shotEvent("made_layup", { x: 1.5, y: 1.0 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ x: 1.5, y: 1.0, made: true });
  });

  it("classifies the made_* family as makes", () => {
    const result = transformToShotEvents([
      shotEvent("made_layup", { x: 3.0, y: 2.0 }),
      shotEvent("made_step_back_three", { x: 4.0, y: 8.0 }),
      shotEvent("free_throw_made", { x: 7.5, y: 5.8 }),
    ]);

    expect(result.map((s) => s.made)).toEqual([true, true, true]);
  });

  it("classifies missed shots as misses", () => {
    const result = transformToShotEvents([
      shotEvent("missed_layup", { x: 3.0, y: 2.0 }),
      shotEvent("free_throw_missed", { x: 7.5, y: 5.8 }),
    ]);

    expect(result.map((s) => s.made)).toEqual([false, false]);
  });

  it("classifies the and-one family as makes despite the name not starting with 'made'", () => {
    // The old `eventType.startsWith("made")` check silently plotted these as
    // misses; they are made baskets.
    const result = transformToShotEvents([
      shotEvent("3_point_and_1", { x: 2.0, y: 7.0 }),
      shotEvent("2_point_int_and_1", { x: 6.0, y: 2.0 }),
      shotEvent("2_point_ext_and_1", { x: 10.0, y: 2.0 }),
    ]);

    expect(result.map((s) => s.made)).toEqual([true, true, true]);
  });

  it("keeps input order", () => {
    const result = transformToShotEvents([
      shotEvent("missed_layup", { x: 3.0, y: 2.0 }),
      shotEvent("made_dunk", { x: 7.0, y: 1.5 }),
    ]);

    expect(result.map((s) => s.made)).toEqual([false, true]);
  });
});
