// src/frontend/features/charts/components/court/CenterLine.tsx
import React from "react";

import { COURT_WIDTH, LINE_WIDTH } from "../../constants";

interface CenterLineProps {
  /** Chart width in SVG pixels; also scales the stroke. */
  readonly svgWidth: number;
  /** Vertical position, already in SVG pixels — the caller applies `yScale`. */
  readonly y: number;
}

/**
 * Draws the center line of the court.
 */
export const CenterLine: React.FC<CenterLineProps> = ({ svgWidth, y }) => (
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
