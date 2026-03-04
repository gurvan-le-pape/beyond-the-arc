// src/frontend/shared/utils/charts/overlays/hotspots/zones/shotZonesTopKey.ts
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
  return (
    x >= PAINT_X0 &&
    x < PAINT_X1 &&
    y >= PAINT_HEIGHT &&
    y < ARC_Y &&
    isInsideArc(x, y, ARC_Y)
  );
}

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
