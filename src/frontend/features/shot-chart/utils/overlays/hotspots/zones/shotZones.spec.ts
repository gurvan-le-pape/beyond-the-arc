// src/frontend/features/shot-chart/utils/overlays/hotspots/zones/shotZones.spec.ts
import { describe, expect, it } from "vitest";

import { ARC_Y, PAINT_HEIGHT } from "@/features/shot-chart/constants";
import {
  binShotsByZones,
  getAboveWingZones,
  getApexStripeZone,
  getArcApexSidelineZones,
  getArcZones,
  getCorner3Zones,
  getPaintZones,
  getTopKeyZone,
  getWingZones,
  type Zone,
} from "@/features/shot-chart/utils";

/**
 * The zone system's contract, stated in `binShotsByZones` and every zone
 * getter: the `polygon` a zone draws and the `contains` predicate it hit-tests
 * with must describe the same region. These tests sample points inside each
 * drawn polygon and assert the predicate accepts them (and rejects outside
 * points) — the regression this guards against is the one where five zones'
 * `contains` required `y ∈ [PAINT_HEIGHT, ARC_Y)`, an interval that is empty
 * because `ARC_Y ≈ 2.99 < PAINT_HEIGHT = 5.8`, so those zones could never
 * match a shot and `binShotsByZones` silently dropped every shot that landed
 * inside their drawn shapes.
 */

const ALL_ZONE_GETTERS: (() => Zone[])[] = [
  getPaintZones,
  getArcZones,
  getArcApexSidelineZones,
  getAboveWingZones,
  getCorner3Zones,
  getWingZones,
  getApexStripeZone,
  getTopKeyZone,
];

function zonesByKey(): Map<string, Zone> {
  const map = new Map<string, Zone>();
  for (const getter of ALL_ZONE_GETTERS) {
    for (const zone of getter()) map.set(zone.key, zone);
  }
  return map;
}

function expectContains(zone: Zone, x: number, y: number) {
  expect(zone.contains(x, y), `${zone.key} should contain (${x}, ${y})`).toBe(
    true,
  );
}

function expectRejects(zone: Zone, x: number, y: number) {
  expect(zone.contains(x, y), `${zone.key} should reject (${x}, ${y})`).toBe(
    false,
  );
}

describe("zone geometry constants", () => {
  it("documents why the old predicates were unsatisfiable", () => {
    // The old `contains` bound y by `y >= PAINT_HEIGHT && y < ARC_Y`; since
    // the arc meets the straight 3-pt line *below* the paint's top edge, that
    // interval is empty and no point can ever satisfy it.
    expect(ARC_Y).toBeLessThan(PAINT_HEIGHT);
  });
});

describe("arc zones (arc_left, arc_right)", () => {
  const zones = zonesByKey();

  it("accepts points inside the drawn sliver between paint and arc", () => {
    expectContains(zones.get("arc_left")!, 3.5, 7.0);
    expectContains(zones.get("arc_left")!, 2.5, 6.0);
    // The arc at x=12.5 sits at y≈6.1, so the sample must stay below it.
    expectContains(zones.get("arc_right")!, 12.5, 6.0);
    expectContains(zones.get("arc_right")!, 11.0, 6.0);
  });

  it("rejects points outside the sliver", () => {
    // Above the arc (outside the three-point circle).
    expectRejects(zones.get("arc_left")!, 3.5, 9.0);
    // Left of the arc's intersection with the paint top.
    expectRejects(zones.get("arc_left")!, 1.5, 7.0);
    // Below the paint's top edge — that is the paint / above-wing territory.
    expectRejects(zones.get("arc_left")!, 3.5, 5.0);
  });
});

describe("top-key zone (top_key_3)", () => {
  const zones = zonesByKey();

  it("accepts points inside the strip between paint and arc", () => {
    expectContains(zones.get("top_key_3")!, 7.5, 8.0);
    expectContains(zones.get("top_key_3")!, 6.0, 6.5);
    expectContains(zones.get("top_key_3")!, 9.0, 7.0);
  });

  it("rejects points above the arc and below the paint", () => {
    expectRejects(zones.get("top_key_3")!, 7.5, 9.0); // beyond the apex
    expectRejects(zones.get("top_key_3")!, 6.0, 5.0); // inside the paint
  });
});

describe("above-wing zones (custom_left_above_wing, custom_right_above_wing)", () => {
  const zones = zonesByKey();

  it("accepts points inside the slivers between arc and paint", () => {
    expectContains(zones.get("custom_left_above_wing")!, 2.0, 4.0);
    expectContains(zones.get("custom_left_above_wing")!, 4.0, 3.5);
    expectContains(zones.get("custom_right_above_wing")!, 13.0, 4.0);
    expectContains(zones.get("custom_right_above_wing")!, 11.0, 3.5);
  });

  it("rejects points below the straight 3-pt line and past the paint", () => {
    expectRejects(zones.get("custom_left_above_wing")!, 2.0, 2.0);
    expectRejects(zones.get("custom_left_above_wing")!, 7.0, 4.0);
    expectRejects(zones.get("custom_right_above_wing")!, 13.0, 2.0);
    // Right zone must test the *right* arc: beyond it on the right.
    expectRejects(zones.get("custom_right_above_wing")!, 14.0, 4.0);
  });
});

describe("binShotsByZones end to end", () => {
  it("attributes the previously-dropped shots to their drawn zones", () => {
    const allZones = ALL_ZONE_GETTERS.flatMap((getter) => getter());
    const shots = [
      { x: 3.5, y: 7.0, made: true }, // arc_left
      { x: 12.5, y: 6.0, made: false }, // arc_right
      { x: 7.5, y: 8.0, made: true }, // top_key_3
      { x: 2.0, y: 4.0, made: false }, // custom_left_above_wing
      { x: 13.0, y: 4.0, made: true }, // custom_right_above_wing
    ];

    const stats = binShotsByZones(shots, allZones);

    expect(stats.arc_left.total).toBe(1);
    expect(stats.arc_left.made).toBe(1);
    expect(stats.arc_right.total).toBe(1);
    expect(stats.arc_right.missed).toBe(1);
    expect(stats.top_key_3.total).toBe(1);
    expect(stats["custom_left_above_wing"].total).toBe(1);
    expect(stats["custom_right_above_wing"].total).toBe(1);
    // Every shot must land somewhere: nothing may be dropped.
    const totalBinned = Object.values(stats).reduce(
      (sum, s) => sum + s.total,
      0,
    );
    expect(totalBinned).toBe(shots.length);
  });
});
