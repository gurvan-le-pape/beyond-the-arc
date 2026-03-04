// src/frontend/shared/utils/charts/overlays/hotspots/zones/shotZonesWing.ts
import {
  ARC_Y,
  COURT_WIDTH,
  PAINT_X0,
  PAINT_X1,
  THREE_PT_LINE_DIST,
} from "@/shared/constants";

// Custom contains logic for left wing zone
function containsWingLeft(x: number, y: number) {
  return x >= THREE_PT_LINE_DIST && x < PAINT_X0 && y >= 0 && y < ARC_Y;
}

// Custom contains logic for right wing zone
function containsWingRight(x: number, y: number) {
  return (
    x >= PAINT_X1 && x < COURT_WIDTH - THREE_PT_LINE_DIST && y >= 0 && y < ARC_Y
  );
}

export function getWingZones() {
  return [
    {
      key: "wing_left",
      x0: THREE_PT_LINE_DIST,
      x1: PAINT_X0,
      y0: 0,
      y1: ARC_Y,
      contains: containsWingLeft,
    },
    {
      key: "wing_right",
      x0: PAINT_X1,
      x1: COURT_WIDTH - THREE_PT_LINE_DIST,
      y0: 0,
      y1: ARC_Y,
      contains: containsWingRight,
    },
  ];
}
