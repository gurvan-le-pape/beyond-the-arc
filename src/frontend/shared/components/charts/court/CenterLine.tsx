// src/frontend/shared/components/charts/court/CenterLine.tsx
import React from "react";

import { COURT_WIDTH, LINE_WIDTH } from "@/shared/constants";

/**
 * Draws the center line of the court.
 */
export const CenterLine: React.FC<{ svgWidth: number; y: number }> = ({
  svgWidth,
  y,
}) => (
  <line
    x1={0}
    y1={y}
    x2={svgWidth}
    y2={y}
    stroke="#000"
    strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
  />
);

export default CenterLine;
