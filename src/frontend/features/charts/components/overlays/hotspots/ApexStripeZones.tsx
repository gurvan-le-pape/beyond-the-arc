// src/frontend/features/charts/components/overlays/hotspots/ApexStripeZones.tsx
import React from "react";

import type { ZoneStats } from "@/features/charts/types";
import { binShotsByZones, getApexStripeZone } from "@/features/charts/utils";
import type { ShotEvent } from "@/shared/types";

import PolygonZone from "./zones/PolygonZone";

interface ApexStripeZonesProps {
  shots: ShotEvent[];
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  colorScale: (t: number) => string;
  svgWidth: number;
  onZoneHover: (zoneKey: string, stats: ZoneStats, e: React.MouseEvent) => void;
  onZoneLeave: () => void;
}

/**
 * The stripe across the top of the key, at the arc apex.
 *
 * Colour encodes **volume, not accuracy** — `colorScale` is fed the zone's
 * total attempts, so ten makes and ten misses shade identically. A zone with
 * no shots still renders, at a fainter opacity, so the court's zone map stays
 * whole rather than developing holes.
 */
function ApexStripeZones({
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  onZoneHover,
  onZoneLeave,
}: ApexStripeZonesProps) {
  // Retrieve apex stripe zone geometry
  const zones = React.useMemo(() => getApexStripeZone(), []);

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
          <PolygonZone
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
}

export default ApexStripeZones;
