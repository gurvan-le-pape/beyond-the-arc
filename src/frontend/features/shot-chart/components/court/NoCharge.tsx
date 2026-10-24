// src/frontend/features/shot-chart/components/court/NoCharge.tsx
import { arc } from "d3-shape";

import { COURT_WIDTH, LINE_WIDTH, NO_CHARGE_RADIUS } from "../../constants";

interface NoChargeProps {
  /** Court centre, already in SVG pixels — the caller applies the scale. */
  readonly centerX: number;
  /** The rim's height, already in SVG pixels — the caller applies the scale — the arc is centred on it. */
  readonly rimY: number;
  /** Where the side lines start, already in SVG pixels — the caller applies the scale. */
  readonly ncLineY1: number;
  /** Where the side lines end, already in SVG pixels — the caller applies the scale. */
  readonly ncLineY2: number;
  /** Court units to SVG pixels — used for the arc radius, which is a length rather than a position. */
  readonly xScale: (x: number) => number;
  /** Chart width; scales the stroke so line weight stays proportional. */
  readonly svgWidth: number;
}

/** The no-charge semi-circle plus the two side lines running from it toward the baseline. */
export function NoCharge({
  centerX,
  rimY,
  ncLineY1,
  ncLineY2,
  xScale,
  svgWidth,
}: NoChargeProps) {
  return (
    <g>
      {/* No-charge semi-circle */}
      <path
        d={
          arc()({
            innerRadius: xScale(NO_CHARGE_RADIUS) - xScale(0),
            outerRadius: xScale(NO_CHARGE_RADIUS) - xScale(0),
            startAngle: -Math.PI / 2,
            endAngle: Math.PI / 2,
          }) ?? undefined
        }
        transform={`translate(${centerX},${rimY})`}
        fill="none"
        className="stroke-court-line"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
      {/* No-charge semi-circle side lines */}
      <line
        x1={centerX - (xScale(NO_CHARGE_RADIUS) - xScale(0))}
        x2={centerX - (xScale(NO_CHARGE_RADIUS) - xScale(0))}
        y1={ncLineY1}
        y2={ncLineY2}
        className="stroke-court-line"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
      <line
        x1={centerX + (xScale(NO_CHARGE_RADIUS) - xScale(0))}
        x2={centerX + (xScale(NO_CHARGE_RADIUS) - xScale(0))}
        y1={ncLineY1}
        y2={ncLineY2}
        className="stroke-court-line"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
    </g>
  );
}

export default NoCharge;
