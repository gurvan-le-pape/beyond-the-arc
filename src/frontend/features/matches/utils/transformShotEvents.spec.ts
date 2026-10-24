// src/frontend/features/matches/utils/transformShotEvents.spec.ts
import { describe, expect, it } from "vitest";

import type { Shot } from "../types";
import { transformToShotEvents } from "./transformShotEvents";

/** Builds a shot of the given type at the given spot. */
function shotEvent(
  eventType: Shot["eventType"],
  location: { x: number; y: number },
): Shot {
  return { eventType, ...location };
}

describe("transformToShotEvents", () => {
  it("keeps the location and reads made from the event type", () => {
    const result = transformToShotEvents([
      shotEvent("made_layup", { x: 1.5, y: 1.0 }),
    ]);

    expect(result).toEqual([{ x: 1.5, y: 1.0, made: true }]);
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
    // Made baskets whose names do not begin with "made".
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
