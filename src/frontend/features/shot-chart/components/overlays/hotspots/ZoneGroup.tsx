// src/frontend/features/shot-chart/components/overlays/hotspots/ZoneGroup.tsx
import React from "react";

import type { ZoneStats } from "@/features/shot-chart/types";
import { binShotsByZones, type Zone } from "@/features/shot-chart/utils";
import type { ShotEvent } from "@/shared/types";

import type { PolygonZone } from "./zones/PolygonZone";
import type { RectZone } from "./zones/RectZone";

interface ZoneGroupProps {
  /** The group's geometry. Must be stable between renders: a module-level getter. */
  readonly getZones: () => Zone[];
  readonly ZoneShape: typeof RectZone | typeof PolygonZone;
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
 * One group of hotspot zones: bins the shots into its zones and draws each one.
 *
 * Colour encodes **volume, not accuracy** — `colorScale` is fed the zone's
 * total attempts, so ten makes and ten misses shade identically. A zone with
 * no shots still renders, at a fainter opacity, so the court's zone map stays
 * whole rather than developing holes.
 */
export function ZoneGroup({
  getZones,
  ZoneShape,
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  onZoneHover,
  onZoneLeave,
}: ZoneGroupProps) {
  const zones = React.useMemo(() => getZones(), [getZones]);

  const zoneStats = React.useMemo(
    () => binShotsByZones(shots, zones),
    [shots, zones],
  );

  return (
    <g>
      {zones.map((zone) => {
        const stats = zoneStats[zone.key];
        return (
          <ZoneShape
            key={zone.key}
            zone={zone}
            stats={stats}
            xScale={xScale}
            yScale={yScale}
            fill={colorScale(stats.total)}
            fillOpacity={stats.total > 0 ? 0.7 : 0.18}
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
