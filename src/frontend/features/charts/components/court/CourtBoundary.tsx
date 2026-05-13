// src/frontend/features/charts/components/court/CourtBoundary.tsx
import React from "react";

import Baseline from "./Baseline";
import BoundaryRect from "./BoundaryRect";
import CenterLine from "./CenterLine";

/**
 * Props for CourtBoundary
 */
export interface CourtBoundaryProps {
  svgWidth: number;
  svgHeight: number;
  yScale: (y: number) => number;
}

/**
 * CourtBoundary component draws the outer boundary, center line, and baseline for the FIBA half-court.
 */
export const CourtBoundary: React.FC<CourtBoundaryProps> = ({
  svgWidth,
  svgHeight,
  yScale,
}) => (
  <g>
    <BoundaryRect svgWidth={svgWidth} svgHeight={svgHeight} />
    <CenterLine svgWidth={svgWidth} y={yScale(0)} />
    <Baseline svgWidth={svgWidth} y={yScale(0)} />
  </g>
);

export default CourtBoundary;
