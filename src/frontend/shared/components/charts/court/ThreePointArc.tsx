// src/frontend/shared/components/charts/court/ThreePointArc.tsx
import React from "react";

import { ARC_Y, LINE_WIDTH } from "@/shared/constants";

/**
 * ThreePointArc component draws the FIBA three-point arc and side lines.
 *
 * @param xScale - d3 scale function for x
 * @param yScale - d3 scale function for y
 * @param svgWidth - SVG width for scaling
 * @param COURT_WIDTH - court width in meters
 * @param THREE_PT_RADIUS - three-point arc radius in meters
 * @param THREE_PT_LINE_DIST - distance from sideline to arc endpoint in meters
 * @param BASELINE_TO_RIM - distance from baseline to rim in meters
 */
export interface ThreePointArcProps {
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  svgWidth: number;
  COURT_WIDTH: number;
  THREE_PT_RADIUS: number;
  THREE_PT_LINE_DIST: number;
}

export const ThreePointArc: React.FC<ThreePointArcProps> = ({
  xScale,
  yScale,
  svgWidth,
  COURT_WIDTH,
  THREE_PT_RADIUS,
  THREE_PT_LINE_DIST,
}) => {
  const arcRadiusPx = xScale(THREE_PT_RADIUS) - xScale(0);
  const xLeft_m = THREE_PT_LINE_DIST;
  const xRight_m = COURT_WIDTH - THREE_PT_LINE_DIST;
  const y_m = ARC_Y;
  const xLeft_px = xScale(xLeft_m);
  const xRight_px = xScale(xRight_m);
  const y_px = yScale(y_m);
  // Manual SVG arc path
  const arcPath = `M ${xLeft_px},${y_px} A ${arcRadiusPx},${arcRadiusPx} 0 0 1 ${xRight_px},${y_px}`;
  return (
    <>
      <path
        d={arcPath}
        fill="none"
        stroke="#000"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
      {/* 3pt lines (side) */}
      <line
        x1={xScale(THREE_PT_LINE_DIST)}
        x2={xScale(THREE_PT_LINE_DIST)}
        y1={yScale(0)}
        y2={y_px}
        stroke="#000"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
      <line
        x1={xScale(COURT_WIDTH - THREE_PT_LINE_DIST)}
        x2={xScale(COURT_WIDTH - THREE_PT_LINE_DIST)}
        y1={yScale(0)}
        y2={y_px}
        stroke="#000"
        strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
      />
    </>
  );
};

export default ThreePointArc;
