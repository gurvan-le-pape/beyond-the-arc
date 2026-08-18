// src/frontend/features/charts/utils/overlays/hotspots/isInsideArc.ts
import {
  BASKET_X,
  BASKET_Y,
  THREE_PT_RADIUS,
} from "@/features/charts/constants";

/**
 * Whether a point is inside the three-point arc: within `THREE_PT_RADIUS` of
 * the basket **and** on the `y < ARC_Y` side — the circle alone is not the arc.
 *
 * Coordinates are court units, not pixels; the basket position and radius come
 * from the shared constants, so only the point and the cut-off vary.
 *
 * @param x - the shot's court-unit x coordinate
 * @param y - the shot's court-unit y coordinate
 * @param ARC_Y - the y below which the arc applies. A parameter despite the
 * constant-style name, unlike the basket constants this imports — pass the
 * value in rather than expecting it to be resolved here.
 *
 * @returns whether the point counts as a three-point attempt's origin — inside the radius *and* past the arc line
 */
export function isInsideArc(x: number, y: number, ARC_Y: number) {
  const dx = x - BASKET_X;
  const dy = y - BASKET_Y;
  return Math.hypot(dx, dy) <= THREE_PT_RADIUS && y < ARC_Y;
}
