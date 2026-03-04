// src/frontend/shared/components/charts/court/basket/Block.tsx
import React from "react";

import {
  BASELINE_TO_BACKBOARD,
  COURT_WIDTH,
  LINE_WIDTH,
} from "@/shared/constants";

interface BlockProps {
  centerX: number;
  yScale: (y: number) => number;
  svgWidth: number;
}

export const Block: React.FC<BlockProps> = ({ centerX, yScale, svgWidth }) => (
  <line
    x1={centerX}
    x2={centerX}
    y1={yScale(BASELINE_TO_BACKBOARD)}
    y2={yScale(BASELINE_TO_BACKBOARD + 0.15)}
    stroke="#000"
    strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
  />
);

export default Block;
