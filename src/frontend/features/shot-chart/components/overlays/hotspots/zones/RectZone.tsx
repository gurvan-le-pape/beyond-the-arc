// src/frontend/features/shot-chart/components/overlays/hotspots/zones/RectZone.tsx
import React from "react";

import { COURT_COLOURS, COURT_WIDTH } from "@/features/shot-chart/constants";

import ZoneStatLabel from "../../ZoneStatLabel";

interface RectZoneProps {
  readonly zone: any;
  readonly stats: { made: number; missed: number; total: number };
  readonly xScale: (x: number) => number;
  readonly yScale: (y: number) => number;
  readonly fill: string;
  readonly fillOpacity: number;
  readonly strokeWidth: number;
  readonly svgWidth: number;
  readonly onMouseMove: (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
  ) => void;
  readonly onMouseLeave: () => void;
}

/** Gap between a sideline and a label pinned to it, in pixels. */
const LABEL_SIDELINE_INSET = 4;

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
export function RectZone({
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
}: RectZoneProps) {
  const x = xScale(zone.x0);
  const y = yScale(zone.y1);
  const width = xScale(zone.x1) - xScale(zone.x0);
  const height = yScale(zone.y0) - yScale(zone.y1);
  const cx = xScale((zone.x0 + zone.x1) / 2);
  // A zone on a sideline (the corner threes) is narrower than its label, so a
  // centred label would run off the court; pin it to the sideline instead.
  let labelX = cx;
  let labelAnchor: "start" | "middle" | "end" = "middle";
  if (zone.x0 === 0) {
    labelX = xScale(0) + LABEL_SIDELINE_INSET;
    labelAnchor = "start";
  } else if (zone.x1 === COURT_WIDTH) {
    labelX = xScale(COURT_WIDTH) - LABEL_SIDELINE_INSET;
    labelAnchor = "end";
  }
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
        strokeWidth={strokeWidth}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ cursor: "pointer", stroke: COURT_COLOURS.line }}
      />
      <ZoneStatLabel
        x={labelX}
        y={cy}
        anchor={labelAnchor}
        label={zone.label}
        fg={fg}
        total={stats.total}
        svgWidth={svgWidth}
      />
    </g>
  );
}

export default RectZone;
