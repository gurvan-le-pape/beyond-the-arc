// src/frontend/features/charts/components/court/basket/Block.tsx

import {
  BASELINE_TO_BACKBOARD,
  COURT_WIDTH,
  LINE_WIDTH,
} from "../../../constants";

interface BlockProps {
  readonly centerX: number;
  readonly yScale: (y: number) => number;
  readonly svgWidth: number;
}

/** The block: the short vertical mark below the backboard, 15cm long. */
export function Block({ centerX, yScale, svgWidth }: BlockProps) {
  return (
    <line
      x1={centerX}
      x2={centerX}
      y1={yScale(BASELINE_TO_BACKBOARD)}
      y2={yScale(BASELINE_TO_BACKBOARD + 0.15)}
      stroke="#000"
      strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
    />
  );
}

export default Block;
