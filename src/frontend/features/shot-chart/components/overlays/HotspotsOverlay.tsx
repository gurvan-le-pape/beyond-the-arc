// src/frontend/features/shot-chart/components/overlays/HotspotsOverlay.tsx
"use client";

import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import React, { useMemo, useState } from "react";

import type { ShotEvent } from "@/shared/types";

import { ShotFilter } from "../../constants";
import {
  binShotsByZones,
  getAboveWingZones,
  getApexStripeZone,
  getArcApexSidelineZones,
  getArcZones,
  getCorner3Zones,
  getPaintZones,
  getTopKeyZone,
  getWingZones,
  type Zone,
} from "../../utils";
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
  readonly shots: ShotEvent[];
  readonly xScale: (x: number) => number;
  readonly yScale: (y: number) => number;
  readonly colorScale?: (t: number) => string;
  readonly svgWidth: number;
  readonly onMaxTotalChange?: (maxTotal: number) => void;
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

/**
 * The hotspots view: every zone group on the court, coloured by shots made.
 *
 * The colour domain is computed here from every zone (see `ALL_ZONE_GETTERS`)
 * and reported through `onMaxTotalChange`, so the legend outside the SVG can
 * match — adding a zone group means adding it to that list.
 */
export function HotspotsOverlay({
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  onMaxTotalChange,
}: HotspotsOverlayProps) {
  const colorFn = colorScale || interpolateYlOrRd;

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
    () => scaleSequential(colorFn).domain([0, maxTotal]),
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
      <WingZones {...sharedProps} />
      <ApexStripeZones {...sharedProps} />
      <TopKeyZones {...sharedProps} />
      {/* Last: a corner zone is narrower than its label, which runs into the
          wing beside it and would sit under the wing's fill if drawn earlier. */}
      <Corner3Zones {...sharedProps} />

      {tooltip &&
        typeof globalThis.window === "object" &&
        globalThis.window &&
        typeof globalThis.document === "object" &&
        globalThis.document && (
          <TooltipContent tooltip={tooltip} shotFilter={ShotFilter.ALL} />
        )}
    </g>
  );
}

export default HotspotsOverlay;
