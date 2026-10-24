// src/frontend/features/shot-chart/utils/overlays/hotspots/zones/shotZonesAboveWing.ts
import {
  ARC_Y,
  BASKET_X,
  BASKET_Y,
  COURT_WIDTH,
  PAINT_HEIGHT,
  PAINT_X0,
  PAINT_X1,
  THREE_PT_LINE_DIST,
  THREE_PT_RADIUS,
} from "@/features/shot-chart/constants";

// Returns the x coordinate where the 3pt arc crosses a given y
function get3ptArcXAtY(y: number, left: boolean) {
  const dy = y - BASKET_Y;
  if (Math.abs(dy) > THREE_PT_RADIUS) return null;
  const dx = Math.sqrt(Math.max(0, THREE_PT_RADIUS ** 2 - dy ** 2));
  return left ? BASKET_X - dx : BASKET_X + dx;
}

// Number of points to sample along the arc for polygon smoothness
const ARC_N = 20;

// Build the polygon for either the left or right above wing zone
function buildAboveWingZonePolygon({
  side,
  paintX,
  baseX0,
  baseX1,
  baseY,
  paintY,
  arcN,
}: {
  side: "left" | "right";
  paintX: number;
  baseX0: number;
  baseX1: number;
  baseY: number;
  paintY: number;
  arcN: number;
}) {
  const arcPoints = [];
  for (let i = 0; i <= arcN; i++) {
    const frac = i / arcN;
    const y = paintY + (baseY - paintY) * frac;
    const x = get3ptArcXAtY(y, side === "left");
    if (x === null) continue;
    arcPoints.push([x, y] as [number, number]);
  }
  if (side === "left") {
    return [[baseX0, baseY], [baseX1, baseY], [paintX, paintY], ...arcPoints];
  } else {
    // right
    return [[baseX0, baseY], [paintX, paintY], ...arcPoints, [baseX1, baseY]];
  }
}

// Left above wing zone polygon
const leftPolygon = buildAboveWingZonePolygon({
  side: "left",
  paintX: PAINT_X0,
  baseX0: THREE_PT_LINE_DIST,
  baseX1: PAINT_X0,
  baseY: ARC_Y,
  paintY: PAINT_HEIGHT,
  arcN: ARC_N,
});
// Right above wing zone polygon
const rightPolygon = buildAboveWingZonePolygon({
  side: "right",
  paintX: PAINT_X1,
  baseX0: PAINT_X1,
  baseX1: COURT_WIDTH - THREE_PT_LINE_DIST,
  baseY: ARC_Y,
  paintY: PAINT_HEIGHT,
  arcN: ARC_N,
});

// Custom contains logic for left above wing zone
function containsAboveWingLeft(x: number, y: number) {
  // Horizontal bounds: from THREE_PT_LINE_DIST to PAINT_X0
  if (x < THREE_PT_LINE_DIST || x > PAINT_X0) return false;
  // Vertical bounds: from the straight 3-pt line (`ARC_Y`) up to the paint's
  // top (`PAINT_HEIGHT`), in that order — inverted, the interval is empty and
  // the zone never matches a shot.
  if (y < ARC_Y || y > PAINT_HEIGHT) return false;
  // For y in that band, x must be to the right of the arc and left of PAINT_X0
  const arcX = get3ptArcXAtY(y, true);
  if (arcX === null) return false;
  return x >= arcX && x <= PAINT_X0;
}

// Custom contains logic for right above wing zone
function containsAboveWingRight(x: number, y: number) {
  // Horizontal bounds: from PAINT_X1 to COURT_WIDTH - THREE_PT_LINE_DIST
  if (x < PAINT_X1 || x > COURT_WIDTH - THREE_PT_LINE_DIST) return false;
  // Vertical bounds: from the straight 3-pt line (`ARC_Y`) up to the paint's top
  if (y < ARC_Y || y > PAINT_HEIGHT) return false;
  // For y in that band, x must be to the left of the *right* arc and right of
  // PAINT_X1. It has to be the right arc: the left one never reaches
  // PAINT_X1, so sampling it would leave this zone unmatchable.
  const arcX = get3ptArcXAtY(y, false);
  if (arcX === null) return false;
  return x <= arcX && x >= PAINT_X1;
}

/**
 * The two above-wing zones — the slivers between the three-point arc and the
 * paint, one per side.
 *
 * Each zone pairs a `polygon` (for drawing) with a hand-written `contains`
 * that tests the arc equation directly; the two must describe the same region,
 * and editing one without the other makes hover disagree with the drawn shape.
 *
 * @returns the zone definitions in court units, each with the bounding box used to draw it and the `contains` predicate used to hit-test it; bounds are half-open so a shot on a shared edge falls in exactly one zone
 */
export function getAboveWingZones() {
  return [
    {
      key: "custom_left_above_wing",
      polygon: leftPolygon,
      contains: containsAboveWingLeft,
    },
    {
      key: "custom_right_above_wing",
      polygon: rightPolygon,
      contains: containsAboveWingRight,
    },
  ];
}
