// src/frontend/features/charts/components/court/BoundaryRect.tsx
import React from "react";

import { COURT_WIDTH, LINE_WIDTH } from "../../constants";

interface BoundaryRectProps {
  /** Chart width in SVG pixels; also scales the stroke. */
  readonly svgWidth: number;
  /** Chart height in SVG pixels. */
  readonly svgHeight: number;
}

/**
 * Draws the outer boundary rectangle of the court.
 */
export const BoundaryRect: React.FC<BoundaryRectProps> = ({
  svgWidth,
  svgHeight,
}) => (
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
