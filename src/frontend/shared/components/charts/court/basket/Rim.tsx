// src/frontend/shared/components/charts/court/basket/Rim.tsx
import React from "react";

import { COURT_WIDTH, LINE_WIDTH, RIM_RADIUS } from "@/shared/constants";

interface RimProps {
  centerX: number;
  rimY: number;
  xScale: (x: number) => number;
  svgWidth: number;
}

export const Rim: React.FC<RimProps> = ({
  centerX,
  rimY,
  xScale,
  svgWidth,
}) => (
  <circle
    cx={centerX}
    cy={rimY}
    r={xScale(RIM_RADIUS) - xScale(0)}
    fill="none"
    stroke="#000"
    strokeWidth={(LINE_WIDTH * svgWidth) / COURT_WIDTH}
  />
);

export default Rim;
