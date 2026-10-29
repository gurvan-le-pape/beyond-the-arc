// src/frontend/features/shot-chart/components/overlays/hotspots/WingZones.tsx
import React from "react";

import type { ZoneStats } from "@/features/shot-chart/types";
import { binShotsByZones, getWingZones } from "@/features/shot-chart/utils";
import type { ShotEvent } from "@/shared/types";

import { RectZone } from "./zones/RectZone";

interface WingZonesProps {
  readonly shots: ShotEvent[];
  readonly xScale: (x: number) => number;
  readonly yScale: (y: number) => number;
  readonly colorScale: (t: number) => string;
  readonly svgWidth: number;
  readonly onZoneHover: (
    zoneKey: string,
    stats: ZoneStats,
    e: React.MouseEvent,
  ) => void;
  readonly onZoneLeave: () => void;
}

/**
 * The wing zones, between the corners and the top of the key.
 *
 * Colour encodes **volume, not accuracy** — `colorScale` is fed the zone's
 * total attempts, so ten makes and ten misses shade identically. A zone with
 * no shots still renders, at a fainter opacity, so the court's zone map stays
 * whole rather than developing holes.
 */
export function WingZones({
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  onZoneHover,
  onZoneLeave,
}: WingZonesProps) {
  // Retrieve wing zones geometry
  const zones = React.useMemo(() => getWingZones(), []);

  // Bin shots into zones
  const zoneStats = React.useMemo(
    () => binShotsByZones(shots, zones),
    [shots, zones],
  );

  return (
    <g>
      {zones.map((zone) => {
        const stats = zoneStats[zone.key];
        const fill = colorScale(stats.total);
        const fillOpacity = stats.total > 0 ? 0.7 : 0.18;
        return (
          <RectZone
            key={zone.key}
            zone={zone}
            stats={stats}
            xScale={xScale}
            yScale={yScale}
            fill={fill}
            fillOpacity={fillOpacity}
            strokeWidth={1}
            svgWidth={svgWidth}
            onMouseMove={(e) => onZoneHover(zone.key, stats, e)}
            onMouseLeave={onZoneLeave}
          />
        );
      })}
    </g>
  );
}
