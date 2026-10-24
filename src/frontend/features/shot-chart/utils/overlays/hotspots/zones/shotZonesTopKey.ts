// src/frontend/features/shot-chart/utils/overlays/hotspots/zones/shotZonesTopKey.ts
import {
  ARC_Y,
  BASKET_X,
  BASKET_Y,
  PAINT_HEIGHT,
  PAINT_X0,
  PAINT_X1,
  THREE_PT_RADIUS,
} from "@/features/shot-chart/constants";

// Build the top key zone polygon
// from x0 to x1 at baseline y0
function buildTopKeyZonePolygon(
  x0: number,
  x1: number,
  y0: number,
): [number, number][] {
  const N = 30;
  return [
    ...Array.from({ length: N + 1 }, (_, i) => {
      const x = x0 + ((x1 - x0) * i) / N;
      const dx = x - BASKET_X;
      const dy = Math.sqrt(Math.max(0, THREE_PT_RADIUS ** 2 - dx ** 2));
      const y = BASKET_Y + dy;
      return [x, y] as [number, number];
    }),
    [x1, y0],
    [x0, y0],
  ];
}

const polygon = buildTopKeyZonePolygon(PAINT_X0, PAINT_X1, PAINT_HEIGHT);

// Custom contains logic for top key zone
function containsTopKeyZone(x: number, y: number) {
  // The drawn strip spans from the paint's top edge (`PAINT_HEIGHT`) up to
  // the three-point arc at this x. Not up to `ARC_Y`: that is the y where the
  // arc meets the *straight* 3-pt line, below the paint top, so capping there
  // leaves an empty interval and a zone that never matches a shot.
  return (
    x >= PAINT_X0 &&
    x < PAINT_X1 &&
    y >= PAINT_HEIGHT &&
    Math.hypot(x - BASKET_X, y - BASKET_Y) <= THREE_PT_RADIUS
  );
}

/**
 * The top-key zone: the full-width strip between the top of the paint and
 * the three-point arc.
 *
 * @returns the zone definitions in court units, each with the bounding box used to draw it and the `contains` predicate used to hit-test it; bounds are half-open so a shot on a shared edge falls in exactly one zone
 */
export function getTopKeyZone() {
  return [
    {
      key: "top_key_3",
      x0: PAINT_X0,
      x1: PAINT_X1,
      y0: PAINT_HEIGHT,
      y1: ARC_Y,
      contains: containsTopKeyZone,
      polygon: polygon,
    },
  ];
}
