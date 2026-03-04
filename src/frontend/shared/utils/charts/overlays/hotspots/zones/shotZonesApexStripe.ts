// src/frontend/shared/utils/charts/overlays/hotspots/zones/shotZonesApexStripe.ts
import {
  BASKET_X,
  BASKET_Y,
  PAINT_X0,
  PAINT_X1,
  THREE_PT_RADIUS,
} from "@/shared/constants";

// y of the apex (top of 3pt arc)
const APEX_Y = BASKET_Y + THREE_PT_RADIUS;
// y of the back edge of the stripe (2m behind apex)
const APEX_STRIPE_Y1 = APEX_Y + 2;

// Number of points to sample along the arc for polygon smoothness
const ARC_N = 40;

// Build the apex stripe polygon
function buildApexStripePolygon() {
  const arcPoints: [number, number][] = [];
  for (let i = 0; i <= ARC_N; i++) {
    const frac = i / ARC_N;
    const x = PAINT_X0 + (PAINT_X1 - PAINT_X0) * frac;
    const dx = x - BASKET_X;
    const arcY =
      BASKET_Y + Math.sqrt(Math.max(0, THREE_PT_RADIUS ** 2 - dx ** 2));
    arcPoints.push([x, arcY]);
  }
  // Complete the polygon by adding the back edge
  return [...arcPoints, [PAINT_X1, APEX_STRIPE_Y1], [PAINT_X0, APEX_STRIPE_Y1]];
}

// Apex stripe polygon
const polygon = buildApexStripePolygon();

// Custom contains logic for apex stripe zone
function containsApexStripe(x: number, y: number) {
  if (x < PAINT_X0 || x > PAINT_X1) return false;
  if (y < APEX_Y || y > APEX_STRIPE_Y1) return false;
  const dx = x - BASKET_X;
  const arcY =
    BASKET_Y + Math.sqrt(Math.max(0, THREE_PT_RADIUS ** 2 - dx ** 2));
  return y >= arcY && y <= APEX_STRIPE_Y1;
}

export function getApexStripeZone() {
  return [
    {
      key: "apex_stripe_green",
      x0: PAINT_X0,
      x1: PAINT_X1,
      y0: APEX_Y,
      y1: APEX_STRIPE_Y1,
      polygon,
      contains: containsApexStripe,
    },
  ];
}
