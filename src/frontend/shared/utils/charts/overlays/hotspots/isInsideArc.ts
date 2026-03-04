// src/frontend/shared/utils/charts/overlays/hotspots/isInsideArc.ts
import { BASKET_X, BASKET_Y, THREE_PT_RADIUS } from "@/shared/constants";

// Returns true if (x, y) is inside the arc segment below ARC_Y
export function isInsideArc(x: number, y: number, ARC_Y: number) {
  const dx = x - BASKET_X;
  const dy = y - BASKET_Y;
  return Math.hypot(dx, dy) <= THREE_PT_RADIUS && y < ARC_Y;
}
