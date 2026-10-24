// src/frontend/features/shot-chart/utils/overlays/hotspots/zones/shotZonesArc.ts
import {
  ARC_Y,
  BASKET_X,
  BASKET_Y,
  PAINT_HEIGHT,
  PAINT_X0,
  PAINT_X1,
  THREE_PT_RADIUS,
} from "@/features/shot-chart/constants";

// Number of points to sample along the arc for polygon smoothness
const N = 30;

// Calculate intersection points of arc and paint (where arc crosses y=PAINT_HEIGHT)
const arc_paint_dx = Math.sqrt(
  Math.max(0, THREE_PT_RADIUS ** 2 - (PAINT_HEIGHT - BASKET_Y) ** 2),
);
const ARC_LEFT_X = BASKET_X - arc_paint_dx; // leftmost x of arc at paint
const ARC_RIGHT_X = BASKET_X + arc_paint_dx; // rightmost x of arc at paint

// Build the arc zone polygon from x0 to x1 at baseline y0
function buildArcZonePolygon(
  x0: number,
  x1: number,
  y0: number,
): [number, number][] {
  // Sample points along the arc from x0 to x1
  const arcPoints: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((x1 - x0) * i) / N;
    const dx = x - BASKET_X;
    const dy = Math.sqrt(Math.max(0, THREE_PT_RADIUS ** 2 - dx ** 2));
    const y = BASKET_Y + dy;
    arcPoints.push([x, y]);
  }
  // Close the polygon at the baseline
  return [...arcPoints, [x1, y0], [x0, y0]];
}

// Left arc zone polygon
const leftPolygon = buildArcZonePolygon(ARC_LEFT_X, PAINT_X0, PAINT_HEIGHT);

// Right arc zone polygon
const rightPolygon = buildArcZonePolygon(PAINT_X1, ARC_RIGHT_X, PAINT_HEIGHT);

// Custom contains logic for arc zones
function containsArcZone(x: number, y: number, x0: number, x1: number) {
  // The drawn sliver spans from the paint's top edge (`PAINT_HEIGHT`) up to
  // the three-point arc at this x. Not up to `ARC_Y`: that is the y where the
  // arc meets the *straight* 3-pt line, below the paint top, so capping there
  // leaves an empty interval and a zone that never matches a shot.
  return (
    x >= x0 &&
    x < x1 &&
    y >= PAINT_HEIGHT &&
    Math.hypot(x - BASKET_X, y - BASKET_Y) <= THREE_PT_RADIUS
  );
}

/**
 * The two arc zones — the slivers between the paint and the three-point arc.
 *
 * `contains` tests the same region the `polygon` draws: above the paint's top
 * edge and inside the three-point circle.
 *
 * @returns the zone definitions in court units, each with the bounding box used to draw it and the `contains` predicate used to hit-test it; bounds are half-open so a shot on a shared edge falls in exactly one zone
 */
export function getArcZones() {
  return [
    {
      key: "arc_left",
      x0: ARC_LEFT_X,
      x1: PAINT_X0,
      y0: PAINT_HEIGHT,
      y1: ARC_Y,
      polygon: leftPolygon,
      contains: (x: number, y: number) =>
        containsArcZone(x, y, ARC_LEFT_X, PAINT_X0),
    },
    {
      key: "arc_right",
      x0: PAINT_X1,
      x1: ARC_RIGHT_X,
      y0: PAINT_HEIGHT,
      y1: ARC_Y,
      polygon: rightPolygon,
      contains: (x: number, y: number) =>
        containsArcZone(x, y, PAINT_X1, ARC_RIGHT_X),
    },
  ];
}
