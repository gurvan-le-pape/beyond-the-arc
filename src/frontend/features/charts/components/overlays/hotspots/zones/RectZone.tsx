// src/frontend/features/charts/components/overlays/hotspots/zones/RectZone.tsx
import React from "react";

import ZoneStatLabel from "../../ZoneStatLabel";

interface RectZoneProps {
  zone: any;
  stats: { made: number; missed: number; total: number };
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  svgWidth: number;
  onMouseMove: (e: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
  onMouseLeave: () => void;
}

/**
 * One rectangular hotspot zone: the shaded box plus its made/missed label.
 *
 * Converts the zone's court-unit bounds through the scales, so callers pass
 * geometry in court units and never in pixels.
 *
 * `zone` is typed `any`, which is a gap rather than a decision — the zone
 * objects have a real shape (`key`, `x0`, `x1`, `y0`, `y1`, `contains`) and
 * nothing checks that what arrives here matches it.
 */
export const RectZone: React.FC<RectZoneProps> = ({
  zone,
  stats,
  xScale,
  yScale,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  svgWidth,
  onMouseMove,
  onMouseLeave,
}) => {
  const x = xScale(zone.x0);
  const y = yScale(zone.y1);
  const width = xScale(zone.x1) - xScale(zone.x0);
  const height = yScale(zone.y0) - yScale(zone.y1);
  const cx = xScale((zone.x0 + zone.x1) / 2);
  const cy = yScale((zone.y0 + zone.y1) / 2);
  const fg =
    stats.total > 0 ? Math.round((stats.made / stats.total) * 100) : null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
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
        svgWidth={svgWidth}
      />
    </g>
  );
};

export default RectZone;
