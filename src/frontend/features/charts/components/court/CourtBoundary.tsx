// src/frontend/features/charts/components/court/CourtBoundary.tsx

import { HALF_COURT_HEIGHT } from "../../constants";
import Baseline from "./Baseline";
import BoundaryRect from "./BoundaryRect";
import CenterLine from "./CenterLine";

/**
 * Props for CourtBoundary
 */
export interface CourtBoundaryProps {
  readonly svgWidth: number;
  readonly svgHeight: number;
  readonly yScale: (y: number) => number;
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
      {/* The half-court line is the far end of the half-court: court unit
          HALF_COURT_HEIGHT maps to the top of the SVG, while yScale(0) is the
          baseline under the basket — which is Baseline's job, not this one's. */}
      <CenterLine svgWidth={svgWidth} y={yScale(HALF_COURT_HEIGHT)} />
      <Baseline svgWidth={svgWidth} y={yScale(0)} />
    </g>
  );
}

export default CourtBoundary;
