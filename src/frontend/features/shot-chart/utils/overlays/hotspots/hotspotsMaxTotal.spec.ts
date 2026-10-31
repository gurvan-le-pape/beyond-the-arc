// src/frontend/features/shot-chart/utils/overlays/hotspots/hotspotsMaxTotal.spec.ts
import { describe, expect, it } from "vitest";

import {
  COURT_WIDTH,
  HALF_COURT_HEIGHT,
} from "@/features/shot-chart/constants";

import { hotspotsMaxTotal } from "./hotspotsMaxTotal";
import { getPaintZones } from "./zones/shotZonesPaint";

// Two points in different paint zones, found from the zones themselves.
const [first, second] = getPaintZones();
const pointIn = (contains: (x: number, y: number) => boolean) => {
  for (let x = 0; x < COURT_WIDTH; x += 0.1)
    for (let y = 0; y < HALF_COURT_HEIGHT; y += 0.1)
      if (contains(x, y)) return { x, y };
  throw new Error("zone contains no grid point");
};
const a = pointIn(first.contains);
const b = pointIn(second.contains);

describe("hotspotsMaxTotal", () => {
  it("is the total of the busiest zone", () => {
    const shots = [
      { ...a, made: true },
      { ...a, made: false },
      { ...a, made: false },
      { ...b, made: true },
    ];
    expect(hotspotsMaxTotal(shots)).toBe(3);
  });

  it("is 1 with no shots", () => {
    expect(hotspotsMaxTotal([])).toBe(1);
  });
});
