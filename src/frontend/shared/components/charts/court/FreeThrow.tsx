// src/frontend/shared/components/charts/court/FreeThrow.tsx
import * as d3 from "d3";
import React from "react";

import {
  COURT_WIDTH,
  FREE_THROW_CIRCLE_RADIUS,
  FREE_THROW_LINE_WIDTH,
  LINE_WIDTH,
} from "@/shared/constants";

/**
 * FreeThrow component draws the free-throw line and semi-circle for FIBA half-court.
 *
 * @param centerX - SVG x position of court center
 * @param ftLineY - SVG y position of free-throw line
 * @param xScale - d3 scale function for x
 * @param svgWidth - SVG width for scaling
 */
export interface FreeThrowProps {
  centerX: number;
  ftLineY: number;
  xScale: (x: number) => number;
  svgWidth: number;
}

export const FreeThrow: React.FC<FreeThrowProps> = ({
  centerX,
  ftLineY,
  xScale,
  svgWidth,
}) => (
  <g>
    {/* Free-throw line */}
    <line
      x1={centerX - xScale(FREE_THROW_LINE_WIDTH / 2) + xScale(0)}
      x2={centerX + xScale(FREE_THROW_LINE_WIDTH / 2) - xScale(0)}
      y1={ftLineY}
      y2={ftLineY}
      stroke="#000"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
    {/* Free-throw semi-circle */}
    <path
      d={
        d3.arc()({
          innerRadius: xScale(FREE_THROW_CIRCLE_RADIUS) - xScale(0),
          outerRadius: xScale(FREE_THROW_CIRCLE_RADIUS) - xScale(0),
          startAngle: -Math.PI / 2,
          endAngle: Math.PI / 2,
        }) ?? undefined
      }
      transform={`translate(${centerX},${ftLineY})`}
      fill="none"
      stroke="#000"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
  </g>
);

export default FreeThrow;
