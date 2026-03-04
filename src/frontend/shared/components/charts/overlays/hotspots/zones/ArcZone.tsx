// src/frontend/shared/components/charts/overlays/hotspots/zones/ArcZone.tsx
import React from "react";

import { ZoneStatLabel } from "@/shared/components/charts";

interface ArcZoneProps {
  zone: any;
  stats: { made: number; missed: number; total: number };
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  onMouseMove: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  onMouseLeave: () => void;
  arcParams: {
    basketX: number;
    basketY: number;
    paintX0: number;
    paintX1: number;
    threePtRadius: number;
  };
}

export const ArcZone: React.FC<ArcZoneProps> = ({
  zone,
  stats,
  xScale,
  yScale,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  onMouseMove,
  onMouseLeave,
  arcParams,
}) => {
  const { x0, x1, y0, y1, key, label } = zone;
  const { basketX, basketY, paintX0, paintX1, threePtRadius } = arcParams;
  const N = 40;
  let arcStart = x0;
  let arcEnd = x1;
  if (key === "arc_left") {
    const arc_paint_dx = Math.sqrt(
      Math.max(0, threePtRadius ** 2 - (y1 - basketY) ** 2),
    );
    arcStart = basketX - arc_paint_dx;
    arcEnd = paintX0;
  } else if (key === "arc_right") {
    const arc_paint_dx = Math.sqrt(
      Math.max(0, threePtRadius ** 2 - (y1 - basketY) ** 2),
    );
    arcStart = paintX1;
    arcEnd = basketX + arc_paint_dx;
  }
  // Top edge: sample the arc from arcStart to arcEnd
  const arcPoints: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const frac = i / N;
    const x = arcStart + (arcEnd - arcStart) * frac;
    const dx = x - basketX;
    const rad = threePtRadius;
    let yArc = basketY + Math.sqrt(Math.max(0, rad * rad - dx * dx));
    arcPoints.push([x, yArc]);
  }
  // Bottom edge: straight line from arcEnd to arcStart at y0 (top of paint)
  const bottomPoints: [number, number][] = [];
  for (let i = N; i >= 0; i--) {
    const frac = i / N;
    const x = arcStart + (arcEnd - arcStart) * frac;
    bottomPoints.push([x, y0]);
  }
  // Build SVG path
  const allPoints = [...arcPoints, ...bottomPoints];
  const path = [
    `M ${xScale(allPoints[0][0])} ${yScale(allPoints[0][1])}`,
    ...allPoints.slice(1).map(([x, y]) => `L ${xScale(x)} ${yScale(y)}`),
    "Z",
  ].join(" ");
  const cx = xScale((arcStart + arcEnd) / 2);
  const cy = yScale((y0 + y1) / 2);
  const fg =
    stats.total > 0 ? Math.round((stats.made / stats.total) * 100) : null;
  return (
    <g>
      <path
        d={path}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ cursor: "pointer" }}
      />
      <ZoneStatLabel x={cx} y={cy} label={label} fg={fg} total={stats.total} />
    </g>
  );
};

export default ArcZone;
