// src/frontend/shared/components/charts/overlays/HotspotsOverlay.tsx
"use client";

import * as d3 from "d3";
import React, { useMemo, useState } from "react";

import { ShotFilter } from "@/shared/constants";
import type { ShotEvent } from "@/shared/types/ShotEvent";
import {
  binShotsByZones,
  type Zone,
} from "@/shared/utils/charts/overlays/hotspots/binShotsByZones";
import { getAboveWingZones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesAboveWing";
import { getApexStripeZone } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesApexStripe";
import { getArcZones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesArc";
import { getArcApexSidelineZones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesArcApexSideline";
import { getCorner3Zones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesCorner3";
import { getPaintZones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesPaint";
import { getTopKeyZone } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesTopKey";
import { getWingZones } from "@/shared/utils/charts/overlays/hotspots/zones/shotZonesWing";

import AboveWingZones from "./hotspots/AboveWingZones";
import ApexStripeZones from "./hotspots/ApexStripeZones";
import ArcApexSidelineZones from "./hotspots/ArcApexSidelineZones";
import ArcZones from "./hotspots/ArcZones";
import Corner3Zones from "./hotspots/Corner3Zones";
import PaintZones from "./hotspots/PaintZones";
import TopKeyZones from "./hotspots/TopKeyZones";
import WingZones from "./hotspots/WingZones";
import TooltipContent from "./TooltipContent";

interface HotspotsOverlayProps {
  shots: ShotEvent[];
  xScale: (x: number) => number;
  yScale: (y: number) => number;
  colorScale?: (t: number) => string;
  svgWidth: number;
  onMaxTotalChange?: (maxTotal: number) => void;
}

// All zone getter functions collected for computing maxTotal across all zones
const ALL_ZONE_GETTERS: (() => Zone[])[] = [
  getPaintZones,
  getArcZones,
  getArcApexSidelineZones,
  getAboveWingZones,
  getCorner3Zones,
  getWingZones,
  getApexStripeZone,
  getTopKeyZone,
];

export const HotspotsOverlay: React.FC<HotspotsOverlayProps> = ({
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  onMaxTotalChange,
}) => {
  const colorFn = colorScale || d3.interpolateYlOrRd;

  const maxTotal = useMemo(() => {
    const allZones = ALL_ZONE_GETTERS.flatMap((getter) => getter());
    const stats = binShotsByZones(shots, allZones);
    return Math.max(1, ...Object.values(stats).map((s) => s.total));
  }, [shots]);

  // Bubble up the correct maxTotal so the header legend stays in sync
  React.useEffect(() => {
    onMaxTotalChange?.(maxTotal);
  }, [maxTotal, onMaxTotalChange]);

  const zoneColorScale = useMemo(
    () => d3.scaleSequential(colorFn).domain([0, maxTotal]),
    [colorFn, maxTotal],
  );

  const [tooltip, setTooltip] = useState<any>(null);

  const handleZoneHover = (
    zoneKey: string,
    stats: any,
    e: React.MouseEvent,
  ) => {
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      made: stats.made,
      missed: stats.missed,
      total: stats.total,
      fg: stats.total > 0 ? Math.round((stats.made / stats.total) * 100) : null,
      zone: { key: zoneKey, label: zoneKey },
    });
  };

  const sharedProps = {
    shots,
    xScale,
    yScale,
    colorScale: zoneColorScale,
    maxTotal,
    svgWidth,
    onZoneHover: handleZoneHover,
    onZoneLeave: () => setTooltip(null),
  };

  return (
    <g>
      <PaintZones {...sharedProps} />
      <ArcZones {...sharedProps} />
      <ArcApexSidelineZones {...sharedProps} />
      <AboveWingZones {...sharedProps} />
      <Corner3Zones {...sharedProps} />
      <WingZones {...sharedProps} />
      <ApexStripeZones {...sharedProps} />
      <TopKeyZones {...sharedProps} />

      {tooltip &&
        typeof globalThis.window === "object" &&
        globalThis.window &&
        typeof globalThis.document === "object" &&
        globalThis.document && (
          <TooltipContent tooltip={tooltip} shotFilter={ShotFilter.ALL} />
        )}
    </g>
  );
};

export default HotspotsOverlay;
