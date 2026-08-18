// src/frontend/features/charts/utils/overlays/hotspots/zones/shotZonesCorner3.ts
import {
  ARC_Y,
  COURT_WIDTH,
  THREE_PT_LINE_DIST,
} from "@/features/charts/constants";

// Custom contains logic for left corner 3 zone
function containsCorner3Left(x: number, y: number) {
  return x >= 0 && x < THREE_PT_LINE_DIST && y >= 0 && y < ARC_Y;
}

// Custom contains logic for right corner 3 zone
function containsCorner3Right(x: number, y: number) {
  return (
    x >= COURT_WIDTH - THREE_PT_LINE_DIST &&
    x < COURT_WIDTH &&
    y >= 0 &&
    y < ARC_Y
  );
}

/**
 * The two corner-three zones: the rectangles between each sideline and the
 * three-point line.
 *
 * @returns the zone definitions in court units, each with the bounding box used to draw it and the `contains` predicate used to hit-test it; bounds are half-open so a shot on a shared edge falls in exactly one zone
 */
export function getCorner3Zones() {
  return [
    {
      key: "corner3_left",
      x0: 0,
      x1: THREE_PT_LINE_DIST,
      y0: 0,
      y1: ARC_Y,
      contains: containsCorner3Left,
    },
    {
      key: "corner3_right",
      x0: COURT_WIDTH - THREE_PT_LINE_DIST,
      x1: COURT_WIDTH,
      y0: 0,
      y1: ARC_Y,
      contains: containsCorner3Right,
    },
  ];
}
