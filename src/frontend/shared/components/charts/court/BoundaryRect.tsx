// src/frontend/shared/components/charts/court/BoundaryRect.tsx
import React from "react";

import { COURT_WIDTH, LINE_WIDTH } from "@/shared/constants";

/**
 * Draws the outer boundary rectangle of the court.
 */
export const BoundaryRect: React.FC<{
  svgWidth: number;
  svgHeight: number;
}> = ({ svgWidth, svgHeight }) => (
  <rect
    x={0}
    y={0}
    width={svgWidth}
    height={svgHeight}
    fill="none"
    stroke="#000"
    strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
  />
);

export default BoundaryRect;
