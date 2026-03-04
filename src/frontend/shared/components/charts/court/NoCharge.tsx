// src/frontend/shared/components/charts/court/NoCharge.tsx
import * as d3 from "d3";
import React from "react";

import { COURT_WIDTH, LINE_WIDTH, NO_CHARGE_RADIUS } from "@/shared/constants";

/**
 * NoCharge component draws the no-charge semi-circle and side lines under the basket.
 *
 * @param centerX - SVG x position of court center
 * @param rimY - SVG y position of rim
 * @param ncLineY1 - SVG y position of start of side lines
 * @param ncLineY2 - SVG y position of end of side lines
 * @param xScale - d3 scale function for x
 * @param svgWidth - SVG width for scaling
 */
export interface NoChargeProps {
  centerX: number;
  rimY: number;
  ncLineY1: number;
  ncLineY2: number;
  xScale: (x: number) => number;
  svgWidth: number;
}

export const NoCharge: React.FC<NoChargeProps> = ({
  centerX,
  rimY,
  ncLineY1,
  ncLineY2,
  xScale,
  svgWidth,
}) => (
  <g>
    {/* No-charge semi-circle */}
    <path
      d={
        d3.arc()({
          innerRadius: xScale(NO_CHARGE_RADIUS) - xScale(0),
          outerRadius: xScale(NO_CHARGE_RADIUS) - xScale(0),
          startAngle: -Math.PI / 2,
          endAngle: Math.PI / 2,
        }) ?? undefined
      }
      transform={`translate(${centerX},${rimY})`}
      fill="none"
      stroke="#000"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
    {/* No-charge semi-circle side lines */}
    <line
      x1={centerX - (xScale(NO_CHARGE_RADIUS) - xScale(0))}
      x2={centerX - (xScale(NO_CHARGE_RADIUS) - xScale(0))}
      y1={ncLineY1}
      y2={ncLineY2}
      stroke="#000"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
    <line
      x1={centerX + (xScale(NO_CHARGE_RADIUS) - xScale(0))}
      x2={centerX + (xScale(NO_CHARGE_RADIUS) - xScale(0))}
      y1={ncLineY1}
      y2={ncLineY2}
      stroke="#000"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
  </g>
);

export default NoCharge;
