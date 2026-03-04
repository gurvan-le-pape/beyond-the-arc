// src/frontend/shared/components/charts/overlays/hotspots/zones/PolygonZone.tsx
import React from "react";

import { ZoneStatLabel } from "@/shared/components/charts";

interface PolygonZoneProps {
  zone: any;
  stats: { made: number; missed: number; total: number };
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  onMouseMove: (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
  onMouseLeave: () => void;
}

export const PolygonZone: React.FC<PolygonZoneProps> = ({
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
}) => {
  const points = zone.polygon
    .map(([x, y]: [number, number]) => `${xScale(x)},${yScale(y)}`)
    .join(" ");
  // Center for label: average of first and third point (works for quadrilaterals)
  const cx = xScale((zone.polygon[0][0] + zone.polygon[2][0]) / 2);
  const cy = yScale((zone.polygon[0][1] + zone.polygon[2][1]) / 2);
  const fg =
    stats.total > 0 ? Math.round((stats.made / stats.total) * 100) : null;
  return (
    <g>
      <polygon
        points={points}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ cursor: "pointer" }}
      />
      <ZoneStatLabel
        x={cx}
        y={cy}
        label={zone.label}
        fg={fg}
        total={stats.total}
      />
    </g>
  );
};

export default PolygonZone;
