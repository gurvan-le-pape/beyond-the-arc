// src/frontend/features/shot-chart/components/overlays/hotspots/zones/PolygonZone.tsx
import React from "react";

import { COURT_COLOURS } from "@/features/shot-chart/constants";

import ZoneStatLabel from "../../ZoneStatLabel";

interface PolygonZoneProps {
  readonly zone: any;
  readonly stats: { made: number; missed: number; total: number };
  readonly xScale: (x: number) => number;
  readonly yScale: (y: number) => number;
  readonly fill: string;
  readonly fillOpacity: number;
  readonly strokeWidth: number;
  readonly svgWidth: number;
  readonly onMouseMove: (
    e: React.MouseEvent<SVGPolygonElement, MouseEvent>,
  ) => void;
  readonly onMouseLeave: () => void;
}

/**
 * Computes the true area-weighted centroid of a polygon using the shoelace formula.
 * Correctly handles irregular polygons with many arc-sampled points.
 */
function polygonCentroid(polygon: [number, number][]): [number, number] {
  let area = 0;
  let cx = 0;
  let cy = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = polygon[i];
    const [x1, y1] = polygon[(i + 1) % n];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area /= 2;
  cx /= 6 * area;
  cy /= 6 * area;
  return [cx, cy];
}

/**
 * One hotspot zone drawn as a polygon, with its stat label at the true
 * area-weighted centroid — computed by the shoelace formula because a
 * bounding-box centre drifts on irregular, arc-sampled zones.
 */
export function PolygonZone({
  zone,
  stats,
  xScale,
  yScale,
  fill,
  fillOpacity,
  strokeWidth,
  svgWidth,
  onMouseMove,
  onMouseLeave,
}: PolygonZoneProps) {
  const points = zone.polygon
    .map(([x, y]: [number, number]) => `${xScale(x)},${yScale(y)}`)
    .join(" ");

  const [centroidX, centroidY] = polygonCentroid(zone.polygon);
  const cx = xScale(centroidX);
  const cy = yScale(centroidY);

  const fg =
    stats.total > 0 ? Math.round((stats.made / stats.total) * 100) : null;

  return (
    <g>
      <polygon
        points={points}
        fill={fill}
        fillOpacity={fillOpacity}
        strokeWidth={strokeWidth}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ cursor: "pointer", stroke: COURT_COLOURS.line }}
      />
      <ZoneStatLabel
        x={cx}
        y={cy}
        label={zone.label}
        fg={fg}
        total={stats.total}
        svgWidth={svgWidth}
      />
    </g>
  );
}

export default PolygonZone;
