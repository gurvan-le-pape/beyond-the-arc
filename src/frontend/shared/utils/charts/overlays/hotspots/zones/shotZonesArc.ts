// src/frontend/shared/utils/charts/overlays/hotspots/zones/shotZonesArc.ts
import {
  ARC_Y,
  BASKET_X,
  BASKET_Y,
  PAINT_HEIGHT,
  PAINT_X0,
  PAINT_X1,
  THREE_PT_RADIUS,
} from "@/shared/constants";

import { isInsideArc } from "../isInsideArc";

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
function containsArcZone(
  x: number,
  y: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
) {
  return x >= x0 && x < x1 && y >= y0 && y < y1 && isInsideArc(x, y, y1);
}

// Return the left and right arc zones as objects with polygon and hit-test logic
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
        containsArcZone(x, y, ARC_LEFT_X, PAINT_X0, PAINT_HEIGHT, ARC_Y),
    },
    {
      key: "arc_right",
      x0: PAINT_X1,
      x1: ARC_RIGHT_X,
      y0: PAINT_HEIGHT,
      y1: ARC_Y,
      polygon: rightPolygon,
      contains: (x: number, y: number) =>
        containsArcZone(x, y, PAINT_X1, ARC_RIGHT_X, PAINT_HEIGHT, ARC_Y),
    },
  ];
}
