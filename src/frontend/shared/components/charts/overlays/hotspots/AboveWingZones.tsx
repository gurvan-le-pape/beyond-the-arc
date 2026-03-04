// src/frontend/shared/components/charts/overlays/hotspots/AboveWingZones.tsx
import React from "react";

import { PolygonZone } from "@/shared/components/charts";
import { binShotsByZones } from "@/shared/utils/charts/overlays/hotspots/binShotsByZones";
import { getAboveWingZones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesAboveWing";

interface AboveWingZonesProps {
  shots: any[];
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  colorScale: (t: number) => string;
  maxTotal: number;
  onZoneHover: (zoneKey: string, stats: any, e: React.MouseEvent) => void;
  onZoneLeave: () => void;
}

const AboveWingZones: React.FC<AboveWingZonesProps> = ({
  shots,
  xScale,
  yScale,
  colorScale,
  maxTotal,
  onZoneHover,
  onZoneLeave,
}) => {
  // Retrieve above wing zones geometry
  const zones = React.useMemo(() => getAboveWingZones(), []);

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
        const stroke = "#333";
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

export default AboveWingZones;
