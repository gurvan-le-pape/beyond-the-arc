// src/frontend/features/shot-chart/components/overlays/HotspotsOverlay.tsx
"use client";

import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import type React from "react";
import { useMemo, useState } from "react";

import type { ShotEvent } from "@/shared/types";

import { ShotFilter } from "../../constants";
import { AboveWingZones } from "./hotspots/AboveWingZones";
import { ApexStripeZones } from "./hotspots/ApexStripeZones";
import { ArcApexSidelineZones } from "./hotspots/ArcApexSidelineZones";
import { ArcZones } from "./hotspots/ArcZones";
import { Corner3Zones } from "./hotspots/Corner3Zones";
import { PaintZones } from "./hotspots/PaintZones";
import { TopKeyZones } from "./hotspots/TopKeyZones";
import { WingZones } from "./hotspots/WingZones";
import { TooltipContent } from "./TooltipContent";

interface HotspotsOverlayProps {
  readonly shots: ShotEvent[];
  readonly xScale: (x: number) => number;
  readonly yScale: (y: number) => number;
  readonly colorScale?: (t: number) => string;
  readonly svgWidth: number;
  /** The busiest zone's shot count — the top of the colour domain (`hotspotsMaxTotal`). */
  readonly maxTotal: number;
}

/**
 * The hotspots view: every zone group on the court, coloured by shots made.
 *
 * The colour domain's top, `maxTotal`, comes from the parent, which hands the
 * same value to the legend outside the SVG.
 */
export function HotspotsOverlay({
  shots,
  xScale,
  yScale,
  colorScale,
  svgWidth,
  maxTotal,
}: HotspotsOverlayProps) {
  const colorFn = colorScale || interpolateYlOrRd;

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
