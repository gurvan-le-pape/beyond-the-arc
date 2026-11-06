// src/frontend/features/shot-chart/components/overlays/HotspotsOverlay.tsx
"use client";

import { scaleSequential } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import type React from "react";
import { useMemo, useState } from "react";

import {
  getAboveWingZones,
  getApexStripeZone,
  getArcApexSidelineZones,
  getArcZones,
  getCorner3Zones,
  getPaintZones,
  getTopKeyZone,
  getWingZones,
} from "@/features/shot-chart/utils";
import type { ShotEvent } from "@/shared/types";

import { ShotFilter } from "../../constants";
import { ZoneGroup } from "./hotspots/ZoneGroup";
import { PolygonZone } from "./hotspots/zones/PolygonZone";
import { RectZone } from "./hotspots/zones/RectZone";
import { TooltipContent } from "./TooltipContent";

/**
 * Every zone group on the court, in draw order: later groups paint over earlier ones.
 *
 * Corner threes come last: a corner zone is narrower than its label, which runs
 * into the wing beside it and would sit under the wing's fill if drawn earlier.
 */
const ZONE_GROUPS = [
  { id: "paint", getZones: getPaintZones, ZoneShape: RectZone },
  { id: "arc", getZones: getArcZones, ZoneShape: PolygonZone },
  {
    id: "arcApexSideline",
    getZones: getArcApexSidelineZones,
    ZoneShape: PolygonZone,
  },
  { id: "aboveWing", getZones: getAboveWingZones, ZoneShape: PolygonZone },
  { id: "wing", getZones: getWingZones, ZoneShape: RectZone },
  { id: "apexStripe", getZones: getApexStripeZone, ZoneShape: PolygonZone },
  { id: "topKey", getZones: getTopKeyZone, ZoneShape: PolygonZone },
  { id: "corner3", getZones: getCorner3Zones, ZoneShape: RectZone },
];

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

  return (
    <g>
      {ZONE_GROUPS.map(({ id, getZones, ZoneShape }) => (
        <ZoneGroup
          key={id}
          getZones={getZones}
          ZoneShape={ZoneShape}
          shots={shots}
          xScale={xScale}
          yScale={yScale}
          colorScale={zoneColorScale}
          svgWidth={svgWidth}
          onZoneHover={handleZoneHover}
          onZoneLeave={() => setTooltip(null)}
        />
      ))}

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
