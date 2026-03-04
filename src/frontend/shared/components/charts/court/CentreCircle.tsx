// src/frontend/shared/components/charts/court/CentreCircle.tsx
import React from "react";

import {
  COURT_WIDTH,
  FREE_THROW_CIRCLE_RADIUS,
  LINE_WIDTH,
} from "@/shared/constants";

/**
 * CentreCircle component draws the top half of the center circle for FIBA half-court.
 *
 * @param centerX - SVG x position of court center
 * @param xScale - d3 scale function for x
 * @param svgWidth - SVG width for scaling
 */
export interface CentreCircleProps {
  centerX: number;
  xScale: (x: number) => number;
  svgWidth: number;
}

export const CentreCircle: React.FC<CentreCircleProps> = ({
  centerX,
  xScale,
  svgWidth,
}) => {
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
};

export default CentreCircle;
