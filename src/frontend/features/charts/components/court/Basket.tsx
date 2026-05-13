// src/frontend/features/charts/components/court/Basket.tsx
import React from "react";

import Backboard from "./basket/Backboard";
import Block from "./basket/Block";
import Rim from "./basket/Rim";

interface BasketProps {
  centerX: number;
  rimY: number;
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  svgWidth: number;
}

export const Basket: React.FC<BasketProps> = ({
  centerX,
  rimY,
  xScale,
  yScale,
  svgWidth,
}) => {
  return (
    <g>
      {/* Backboard */}
      <Backboard xScale={xScale} yScale={yScale} svgWidth={svgWidth} />
      {/* Block under rim (vertical line below backboard) */}
      <Block centerX={centerX} yScale={yScale} svgWidth={svgWidth} />
      {/* Rim */}
      <Rim centerX={centerX} rimY={rimY} xScale={xScale} svgWidth={svgWidth} />
    </g>
  );
};

export default Basket;
