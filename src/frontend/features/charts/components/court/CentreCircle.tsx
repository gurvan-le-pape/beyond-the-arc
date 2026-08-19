// src/frontend/features/charts/components/court/CentreCircle.tsx

import {
  COURT_WIDTH,
  FREE_THROW_CIRCLE_RADIUS,
  LINE_WIDTH,
} from "../../constants";

interface CentreCircleProps {
  /** Court centre, already in SVG pixels — the caller applies the scale. */
  readonly centerX: number;
  /** Court units to SVG pixels — used for the radius, which is a length rather than a position. */
  readonly xScale: (x: number) => number;
  /** Chart width; scales the stroke so line weight stays proportional. */
  readonly svgWidth: number;
}

/** The centre circle — the top half only; the bottom half belongs to the other end of the half-court. */
export function CentreCircle({ centerX, xScale, svgWidth }: CentreCircleProps) {
  const r = xScale(FREE_THROW_CIRCLE_RADIUS) - xScale(0);
  const cx = centerX;
  const cy = 0;
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;
  return (
    <path
      d={`M ${startX},${startY} A ${r},${r} 0 0 0 ${endX},${endY}`}
      fill="none"
      stroke="#000"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
  );
}

export default CentreCircle;
