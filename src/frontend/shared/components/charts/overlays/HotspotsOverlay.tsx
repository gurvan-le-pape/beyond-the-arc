// src/frontend/shared/components/charts/overlays/HotspotsOverlay.tsx
"use client";

import * as d3 from "d3";
import React, { useState } from "react";

import type { ShotEvent } from "@/shared/types/ShotEvent";

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
}

export const HotspotsOverlay: React.FC<HotspotsOverlayProps> = ({
  shots,
  xScale,
  yScale,
  colorScale,
}) => {
  // Compute max shot volume for color scale (for all zones)
  // For now, just use shots.length as a fallback for maxTotal
  const maxTotal = shots.length > 0 ? shots.length : 1;
  const colorFn = colorScale || d3.interpolateYlOrRd;
  const zoneColorScale = d3.scaleSequential(colorFn).domain([0, maxTotal]);

  // Tooltip state (for non-paint zones)
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
      {/* Paint zones rendered as a self-contained component */}
      <PaintZones
        shots={shots}
        xScale={xScale}
        yScale={yScale}
        colorScale={zoneColorScale}
        maxTotal={maxTotal}
        onZoneHover={handleZoneHover}
        onZoneLeave={() => setTooltip(null)}
      />
      {/* Arc zones rendered as a self-contained component */}
      <ArcZones
        shots={shots}
        xScale={xScale}
        yScale={yScale}
        colorScale={zoneColorScale}
        maxTotal={maxTotal}
        onZoneHover={handleZoneHover}
        onZoneLeave={() => setTooltip(null)}
      />
      {/* Arc Apex Sideline zones (left and right) rendered as a self-contained component */}
      <ArcApexSidelineZones
        shots={shots}
        xScale={xScale}
        yScale={yScale}
        colorScale={zoneColorScale}
        maxTotal={maxTotal}
        onZoneHover={handleZoneHover}
        onZoneLeave={() => setTooltip(null)}
      />
      {/* Above Wing zones rendered as a self-contained component */}
      <AboveWingZones
        shots={shots}
        xScale={xScale}
        yScale={yScale}
        colorScale={zoneColorScale}
        maxTotal={maxTotal}
        onZoneHover={handleZoneHover}
        onZoneLeave={() => setTooltip(null)}
      />

      {/* Corner 3 zones rendered as a self-contained component */}
      <Corner3Zones
        shots={shots}
        xScale={xScale}
        yScale={yScale}
        colorScale={zoneColorScale}
        maxTotal={maxTotal}
        onZoneHover={handleZoneHover}
        onZoneLeave={() => setTooltip(null)}
      />
      {/* Wing zones rendered as a self-contained component */}
      <WingZones
        shots={shots}
        xScale={xScale}
        yScale={yScale}
        colorScale={zoneColorScale}
        maxTotal={maxTotal}
        onZoneHover={handleZoneHover}
        onZoneLeave={() => setTooltip(null)}
      />
      {/* Apex stripe zone rendered as a self-contained component */}
      <ApexStripeZones
        shots={shots}
        xScale={xScale}
        yScale={yScale}
        colorScale={zoneColorScale}
        maxTotal={maxTotal}
        onZoneHover={handleZoneHover}
        onZoneLeave={() => setTooltip(null)}
      />

      {/* Top key zone rendered as a self-contained component */}
      <TopKeyZones
        shots={shots}
        xScale={xScale}
        yScale={yScale}
        colorScale={zoneColorScale}
        maxTotal={maxTotal}
        onZoneHover={handleZoneHover}
        onZoneLeave={() => setTooltip(null)}
      />

      {/* Tooltip */}
      {tooltip &&
        typeof globalThis.window === "object" &&
        globalThis.window &&
        typeof globalThis.document === "object" &&
        globalThis.document && (
          <TooltipContent tooltip={tooltip} shotFilter="all" />
        )}
    </g>
  );
};

export default HotspotsOverlay;
