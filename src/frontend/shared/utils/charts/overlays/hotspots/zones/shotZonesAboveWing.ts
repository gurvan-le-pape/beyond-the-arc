// src/frontend/shared/utils/charts/overlays/hotspots/zones/shotZonesAboveWing.ts
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
} from "@/shared/constants";

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
  // Vertical bounds: from PAINT_HEIGHT to ARC_Y
  if (y < PAINT_HEIGHT || y > ARC_Y) return false;
  // For y between PAINT_HEIGHT and ARC_Y, x must be to the right of the arc and left of PAINT_X0
  const arcX = get3ptArcXAtY(y, true);
  if (arcX === null) return false;
  return x >= arcX && x <= PAINT_X0;
}

// Custom contains logic for right above wing zone
function containsAboveWingRight(x: number, y: number) {
  // Horizontal bounds: from PAINT_X1 to COURT_WIDTH - THREE_PT_LINE_DIST
  if (x < PAINT_X1 || x > COURT_WIDTH - THREE_PT_LINE_DIST) return false;
  // Vertical bounds: from PAINT_HEIGHT to ARC_Y
  if (y < PAINT_HEIGHT || y > ARC_Y) return false;
  // For y between PAINT_HEIGHT and ARC_Y, x must be to the left of the arc and right of PAINT_X1
  const arcX = get3ptArcXAtY(y, true);
  if (arcX === null) return false;
  return x <= arcX && x >= PAINT_X1;
}

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
