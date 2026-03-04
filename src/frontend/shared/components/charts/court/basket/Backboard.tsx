// src/frontend/shared/components/charts/court/basket/Backboard.tsx
import React from "react";

import {
  BACKBOARD_WIDTH,
  BASELINE_TO_BACKBOARD,
  COURT_WIDTH,
  LINE_WIDTH,
} from "@/shared/constants";

interface BackboardProps {
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  svgWidth: number;
}

export const Backboard: React.FC<BackboardProps> = ({
  xScale,
  yScale,
  svgWidth,
}) => (
  <line
    x1={xScale(COURT_WIDTH / 2 - BACKBOARD_WIDTH / 2)}
    x2={xScale(COURT_WIDTH / 2 + BACKBOARD_WIDTH / 2)}
    y1={yScale(BASELINE_TO_BACKBOARD)}
    y2={yScale(BASELINE_TO_BACKBOARD)}
    stroke="#000"
    strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
  />
);

export default Backboard;
