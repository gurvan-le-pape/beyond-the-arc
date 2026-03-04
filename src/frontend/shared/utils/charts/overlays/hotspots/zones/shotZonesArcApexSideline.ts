// src/frontend/shared/utils/charts/overlays/hotspots/zones/shotZonesArcApexSideline.ts
import {
  ARC_Y,
  BASKET_X,
  BASKET_Y,
  COURT_WIDTH,
  PAINT_X0,
  PAINT_X1,
  THREE_PT_LINE_DIST,
  THREE_PT_RADIUS,
} from "@/shared/constants";

// Height of the apex sideline zone above the arc (in meters)
const APEX_STRIPE_HEIGHT = 2;

// Number of points to sample along the arc for polygon smoothness
const ARC_N = 40;

// Build the polygon for either the left or right apex sideline zone
// The polygon starts at the 3pt line, follows the arc, then extends vertically and horizontally
function buildApexSidelineZonePolygon({
  side,
  courtWidth,
  paintX,
  paintX1,
  arcY,
  threePtLineDist,
  basketX,
  basketY,
  threePtRadius,
  stripeHeight,
  arcN,
}: {
  side: "left" | "right";
  courtWidth: number;
  paintX: number;
  paintX1: number;
  arcY: number;
  threePtLineDist: number;
  basketX: number;
  basketY: number;
  threePtRadius: number;
  stripeHeight: number;
  arcN: number;
}) {
  // side: 'left' or 'right' determines which half-court zone to build
  let bottomX0, bottomX1, arcX0, arcX1, upX, horizStartX;
  if (side === "left") {
    bottomX0 = 0;
    bottomX1 = threePtLineDist;
    arcX0 = threePtLineDist;
    arcX1 = paintX;
    upX = paintX;
    horizStartX = 0;
  } else {
    bottomX0 = courtWidth;
    bottomX1 = courtWidth - threePtLineDist;
    arcX0 = courtWidth - threePtLineDist;
    arcX1 = paintX1;
    upX = paintX1;
    horizStartX = courtWidth;
  }
  // Arc points: sample along the 3pt arc from the 3pt line to the paint
  const arcPoints = [];
  for (let i = 0; i <= arcN; i++) {
    const x = arcX0 + ((arcX1 - arcX0) * i) / arcN;
    const dx = x - basketX;
    const y = basketY + Math.sqrt(Math.max(0, threePtRadius ** 2 - dx ** 2));
    arcPoints.push([x, y]);
  }
  // The top of the zone is a horizontal line above the arc
  const arcY_at_paint = arcPoints[arcPoints.length - 1][1];
  const topY = arcY_at_paint + stripeHeight;
  return [
    [bottomX0, arcY],
    [bottomX1, arcY],
    ...arcPoints,
    [upX, topY],
    [horizStartX, topY],
  ];
}

// Left apex sideline zone polygon
const leftZonePolygon = buildApexSidelineZonePolygon({
  side: "left",
  courtWidth: COURT_WIDTH,
  paintX: PAINT_X0,
  paintX1: PAINT_X1,
  arcY: ARC_Y,
  threePtLineDist: THREE_PT_LINE_DIST,
  basketX: BASKET_X,
  basketY: BASKET_Y,
  threePtRadius: THREE_PT_RADIUS,
  stripeHeight: APEX_STRIPE_HEIGHT,
  arcN: ARC_N,
});
// Right apex sideline zone polygon
const rightZonePolygon = buildApexSidelineZonePolygon({
  side: "right",
  courtWidth: COURT_WIDTH,
  paintX: PAINT_X0,
  paintX1: PAINT_X1,
  arcY: ARC_Y,
  threePtLineDist: THREE_PT_LINE_DIST,
  basketX: BASKET_X,
  basketY: BASKET_Y,
  threePtRadius: THREE_PT_RADIUS,
  stripeHeight: APEX_STRIPE_HEIGHT,
  arcN: ARC_N,
});

// Custom contains logic for left apex sideline zones
function containsApexSidelineLeft(x: number, y: number) {
  // Horizontal bounds: from 0 to THREE_PT_LINE_DIST, then along arc to PAINT_X0
  if (x < 0 || x > PAINT_X0) return false;
  // Vertical bounds: from ARC_Y up to arc + APEX_STRIPE_HEIGHT
  if (y < ARC_Y) return false;
  // For x between 0 and THREE_PT_LINE_DIST, y must be below ARC_Y + APEX_STRIPE_HEIGHT
  if (x <= THREE_PT_LINE_DIST) {
    return y <= ARC_Y + APEX_STRIPE_HEIGHT;
  }
  // For x between THREE_PT_LINE_DIST and PAINT_X0, y must be above the arc and below arc+height
  const dx = x - BASKET_X;
  const arcY =
    BASKET_Y + Math.sqrt(Math.max(0, THREE_PT_RADIUS ** 2 - dx ** 2));
  return y >= arcY && y <= arcY + APEX_STRIPE_HEIGHT;
}

// Custom contains logic for right apex sideline zone
function containsApexSidelineRight(x: number, y: number) {
  // Horizontal bounds: from PAINT_X1 to COURT_WIDTH
  if (x > COURT_WIDTH || x < PAINT_X1) return false;
  // Vertical bounds: from ARC_Y up to arc + APEX_STRIPE_HEIGHT
  if (y < ARC_Y) return false;
  // For x between COURT_WIDTH - THREE_PT_LINE_DIST and COURT_WIDTH, y must be below ARC_Y + APEX_STRIPE_HEIGHT
  if (x >= COURT_WIDTH - THREE_PT_LINE_DIST) {
    return y <= ARC_Y + APEX_STRIPE_HEIGHT;
  }
  // For x between PAINT_X1 and COURT_WIDTH - THREE_PT_LINE_DIST, y must be above the arc and below arc+height
  const dx = x - BASKET_X;
  const arcY =
    BASKET_Y + Math.sqrt(Math.max(0, THREE_PT_RADIUS ** 2 - dx ** 2));
  return y >= arcY && y <= arcY + APEX_STRIPE_HEIGHT;
}

export function getArcApexSidelineZones() {
  return [
    {
      key: "arc_apex_sideline_left",
      polygon: leftZonePolygon,
      contains: containsApexSidelineLeft,
    },
    {
      key: "arc_apex_sideline_right",
      polygon: rightZonePolygon,
      contains: containsApexSidelineRight,
    },
  ];
}
