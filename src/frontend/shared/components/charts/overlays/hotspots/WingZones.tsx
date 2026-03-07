// src/frontend/shared/components/charts/overlays/hotspots/WingZones.tsx
import React from "react";

import { RectZone } from "@/shared/components/charts";
import type { ShotEvent } from "@/shared/types";
import type { ZoneStats } from "@/shared/types/charts/ZoneStats";
import { binShotsByZones } from "@/shared/utils/charts/overlays/hotspots/binShotsByZones";
import { getWingZones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesWing";

interface WingZonesProps {
  shots: ShotEvent[];
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  colorScale: (t: number) => string;
  svgWidth: number;
  onZoneHover: (zoneKey: string, stats: ZoneStats, e: React.MouseEvent) => void;
  onZoneLeave: () => void;
}

const WingZones: React.FC<WingZonesProps> = ({
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  onZoneHover,
  onZoneLeave,
}) => {
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
            stroke="#222"
            strokeWidth={1}
            svgWidth={svgWidth}
            onMouseMove={(e) => onZoneHover(zone.key, stats, e)}
            onMouseLeave={onZoneLeave}
          />
        );
      })}
    </g>
  );
};

export default WingZones;
