// src/frontend/shared/components/charts/overlays/hotspots/Corner3Zones.tsx
import React from "react";

import { RectZone } from "@/shared/components/charts";
import type { ShotEvent } from "@/shared/types";
import type { ZoneStats } from "@/shared/types/charts/ZoneStats";
import { binShotsByZones } from "@/shared/utils/charts/overlays/hotspots/binShotsByZones";
import { getCorner3Zones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesCorner3";

interface Corner3ZonesProps {
  shots: ShotEvent[];
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  colorScale: (t: number) => string;
  svgWidth: number;
  onZoneHover: (zoneKey: string, stats: ZoneStats, e: React.MouseEvent) => void;
  onZoneLeave: () => void;
}

const Corner3Zones: React.FC<Corner3ZonesProps> = ({
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  onZoneHover,
  onZoneLeave,
}) => {
  // Retrieve corner 3 zones geometry
  const zones = React.useMemo(() => getCorner3Zones(), []);

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
        const stroke = "#222";
        const strokeWidth = 1;
        return (
          <RectZone
            key={zone.key}
            zone={zone}
            stats={stats}
            xScale={xScale}
            yScale={yScale}
            fill={fill}
            fillOpacity={fillOpacity}
            stroke={stroke}
            strokeWidth={strokeWidth}
            svgWidth={svgWidth}
            onMouseMove={(e) => onZoneHover(zone.key, stats, e)}
            onMouseLeave={onZoneLeave}
          />
        );
      })}
    </g>
  );
};

export default Corner3Zones;
