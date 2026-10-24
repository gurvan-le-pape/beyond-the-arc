// src/frontend/features/shot-chart/components/overlays/hotspots/TopKeyZones.tsx
import React from "react";

import type { ZoneStats } from "@/features/shot-chart/types";
import { binShotsByZones, getTopKeyZone } from "@/features/shot-chart/utils";
import type { ShotEvent } from "@/shared/types";

import PolygonZone from "./zones/PolygonZone";

interface TopKeyZonesProps {
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
 * The zones at the top of the key, just outside the free-throw circle.
 *
 * Colour encodes **volume, not accuracy** — `colorScale` is fed the zone's
 * total attempts, so ten makes and ten misses shade identically. A zone with
 * no shots still renders, at a fainter opacity, so the court's zone map stays
 * whole rather than developing holes.
 */
function TopKeyZones({
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  onZoneHover,
  onZoneLeave,
}: TopKeyZonesProps) {
  // Retrieve top key zone geometry
  const zones = React.useMemo(() => getTopKeyZone(), []);

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
        const strokeWidth = 1;
        return (
          <PolygonZone
            key={zone.key}
            zone={zone}
            stats={stats}
            xScale={xScale}
            yScale={yScale}
            fill={fill}
            fillOpacity={fillOpacity}
            strokeWidth={strokeWidth}
            svgWidth={svgWidth}
            onMouseMove={(e) => onZoneHover(zone.key, stats, e)}
            onMouseLeave={onZoneLeave}
          />
        );
      })}
    </g>
  );
}

export default TopKeyZones;
