// src/frontend/features/charts/components/court/CourtBoundary.tsx

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
export function CourtBoundary({
  svgWidth,
  svgHeight,
  yScale,
}: CourtBoundaryProps) {
  return (
    <g>
      <BoundaryRect svgWidth={svgWidth} svgHeight={svgHeight} />
      <CenterLine svgWidth={svgWidth} y={yScale(0)} />
      <Baseline svgWidth={svgWidth} y={yScale(0)} />
    </g>
  );
}

export default CourtBoundary;
