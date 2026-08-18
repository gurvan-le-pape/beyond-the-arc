// src/frontend/features/charts/components/court/Basket.tsx

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

/**
 * The basket assembly — backboard, low-post block and rim — grouped so the
 * three move together.
 *
 * Draws nothing itself. It exists to keep the three parts on one coordinate
 * transform: all of them receive the same scales, so the rim cannot drift from
 * the backboard it hangs off.
 */
export function Basket({
  centerX,
  rimY,
  xScale,
  yScale,
  svgWidth,
}: BasketProps) {
  return (
    <g>
      <Backboard xScale={xScale} yScale={yScale} svgWidth={svgWidth} />
      <Block centerX={centerX} yScale={yScale} svgWidth={svgWidth} />
      <Rim centerX={centerX} rimY={rimY} xScale={xScale} svgWidth={svgWidth} />
    </g>
  );
}

export default Basket;
