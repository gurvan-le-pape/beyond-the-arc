// src/frontend/shared/utils/charts/overlays/hotspots/zones/shotZonesPaint.ts
import { PAINT_HEIGHT, PAINT_WIDTH, PAINT_X0 } from "@/shared/constants";

const PAINT_COLS = 2;
const PAINT_ROWS = 2;
const PAINT_ZONE_WIDTH = PAINT_WIDTH / PAINT_COLS;
const PAINT_ZONE_HEIGHT = PAINT_HEIGHT / PAINT_ROWS;

// Paint zones polygons
const paintZones = Array.from({ length: PAINT_ROWS }, (_, row) =>
  Array.from({ length: PAINT_COLS }, (_, col) => {
    const x0 = PAINT_X0 + col * PAINT_ZONE_WIDTH;
    const x1 = x0 + PAINT_ZONE_WIDTH;
    const y0 = row * PAINT_ZONE_HEIGHT;
    const y1 = y0 + PAINT_ZONE_HEIGHT;
    // Rectangle polygon: bottom-left, bottom-right, top-right, top-left
    const polygon = [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ];
    return {
      key: `paint_${row}_${col}`,
      row,
      col,
      x0,
      x1,
      y0,
      y1,
      polygon,
      contains: makeContainsPaintZone(x0, x1, y0, y1),
    };
  }),
).flat();

// Factory function for custom contains logic for paint zone
function makeContainsPaintZone(x0: number, x1: number, y0: number, y1: number) {
  return (x: number, y: number) => x >= x0 && x < x1 && y >= y0 && y < y1;
}

export function getPaintZones() {
  return paintZones;
}
