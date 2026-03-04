// src/frontend/shared/components/charts/overlays/hotspots/ArcZones.tsx
import React from "react";

import { PolygonZone } from "@/shared/components/charts";
import { binShotsByZones } from "@/shared/utils/charts/overlays/hotspots/binShotsByZones";
import { getArcZones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesArc";

interface ArcZonesProps {
  shots: any[];
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  colorScale: (t: number) => string;
  maxTotal: number;
  onZoneHover: (zoneKey: string, stats: any, e: React.MouseEvent) => void;
  onZoneLeave: () => void;
}

const ArcZones: React.FC<ArcZonesProps> = ({
  shots,
  xScale,
  yScale,
  colorScale,
  maxTotal,
  onZoneHover,
  onZoneLeave,
}) => {
  // Retrieve arc zones geometry
  const zones = React.useMemo(() => getArcZones(), []);

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
          <PolygonZone
            key={zone.key}
            zone={zone}
            stats={stats}
            xScale={xScale}
            yScale={yScale}
            fill={fill}
            fillOpacity={fillOpacity}
            stroke={stroke}
            strokeWidth={strokeWidth}
            onMouseMove={(e) => onZoneHover(zone.key, stats, e)}
            onMouseLeave={onZoneLeave}
          />
        );
      })}
    </g>
  );
};

export default ArcZones;
