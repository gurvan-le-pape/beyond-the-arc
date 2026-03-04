// src/frontend/shared/components/charts/ShotChart.tsx
"use client";

import * as d3 from "d3";
import React, { useMemo, useState } from "react";

import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import { useBinnedShots } from "@/shared/components/charts";
import {
  Basket,
  CentreCircle,
  CourtBoundary,
  FreeThrow,
  HeatmapHeader,
  HeatmapOverlay,
  HotspotsOverlay,
  NoCharge,
  Paint,
  PaintTicks,
  ScatterHeader,
  ScatterOverlay,
  ThreePointArc,
} from "@/shared/components/charts";
import {
  BASELINE_TO_RIM,
  COURT_WIDTH,
  FREE_THROW_LINE_DIST,
  HALF_COURT_HEIGHT,
  NO_CHARGE_LINE_DIST,
  NO_CHARGE_LINE_LENGTH,
  PAINT_HEIGHT,
  PAINT_WIDTH,
  THREE_PT_LINE_DIST,
  THREE_PT_RADIUS,
} from "@/shared/constants";
import { ChartType } from "@/shared/constants/chart-types";

import HotspotsHeader from "./headers/HotspotsHeader";

interface ShotChartProps {
  shots: MatchEvent[];
  width?: number;
  height?: number;
  chartType?: ChartType;
}

type ColorScaleName = "YlOrRd" | "Viridis" | "Inferno" | "Cividis" | "Turbo";

const COLOR_SCALES: { [key in ColorScaleName]: (t: number) => string } = {
  YlOrRd: d3.interpolateYlOrRd,
  Viridis: d3.interpolateViridis,
  Inferno: d3.interpolateInferno,
  Cividis: d3.interpolateCividis,
  Turbo: d3.interpolateTurbo,
};

export const ShotChart: React.FC<ShotChartProps> = ({
  shots,
  width = 500,
  height = 470,
  chartType = ChartType.SCATTER,
}) => {
  // Responsive width/height using container size
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState<{
    width: number;
    height: number;
  }>({ width, height });
  // Resize observer for responsiveness
  React.useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Maintain aspect ratio (500:470)
        const aspect = 500 / 470;
        let w = rect.width;
        let h = w / aspect;
        // Clamp min/max
        if (w < 320) w = 320;
        if (w > 900) w = 900;
        h = w / aspect;
        setContainerSize({ width: w, height: h });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  // Use responsive width/height
  const svgWidth = containerSize.width;
  const svgHeight = containerSize.height;
  // Filter state: 'all', 'made', 'missed'
  const [shotFilter, setShotFilter] = useState<"all" | "made" | "missed">(
    "all",
  );
  // Color scale state
  const [colorScale, setColorScale] = useState<ColorScaleName>("YlOrRd");
  // d3 scales for professional, robust scaling
  const xScale = useMemo(
    () => d3.scaleLinear().domain([0, COURT_WIDTH]).range([0, svgWidth]),
    [svgWidth],
  );
  const yScale = useMemo(
    () => d3.scaleLinear().domain([0, HALF_COURT_HEIGHT]).range([svgHeight, 0]),
    [svgHeight],
  );

  // FIBA geometry (all in meters)
  const centerX = xScale(COURT_WIDTH / 2);
  const paintLeft = xScale((COURT_WIDTH - PAINT_WIDTH) / 2);
  const paintRight = xScale((COURT_WIDTH + PAINT_WIDTH) / 2);
  const paintTopY = yScale(PAINT_HEIGHT);
  const paintBottomY = yScale(0);
  const ftLineY = yScale(FREE_THROW_LINE_DIST);
  const rimY = yScale(BASELINE_TO_RIM);
  const ncLineY1 = yScale(NO_CHARGE_LINE_DIST);
  const ncLineY2 = yScale(NO_CHARGE_LINE_DIST + NO_CHARGE_LINE_LENGTH);
  const tickLength = 0.1; // meters
  const tick1Y = 1.75;
  const blockY = tick1Y + 0.85; // 2.60m
  const blockHeight = 0.4;
  const tick2Y = blockY + blockHeight + 0.85; // 3.85m
  const tick3Y = tick2Y + 0.85; // 4.70m

  // Heatmap grid/cell config
  const rows = 56,
    cols = 60;
  const cellWidth = COURT_WIDTH / cols;
  const cellHeight = HALF_COURT_HEIGHT / rows;

  // Bin shots once for overlays and legend
  const { bins: heatmapData, shotEvents } = useBinnedShots(
    shots,
    rows,
    cols,
    cellWidth,
    cellHeight,
  );
  // Compute max value for overlays/legend (once)
  const flat = heatmapData.flat();
  const maxValue = useMemo(() => {
    if (shotFilter === "made")
      return Math.max(...flat.map((cell) => cell.made));
    if (shotFilter === "missed")
      return Math.max(...flat.map((cell) => cell.missed));
    return Math.max(...flat.map((cell) => cell.total));
  }, [flat, shotFilter]);

  return (
    <div
      className="shotchart-container"
      ref={containerRef}
      style={{
        position: "relative",
        zIndex: 0,
        width: "100%",
        maxWidth: 900,
        minWidth: 320,
        margin: "0 auto",
        // Height is handled by SVG aspect ratio
      }}
    >
      {/* Legend above the SVG */}
      {chartType === ChartType.SCATTER && <ScatterHeader />}
      {/* Filter controls and color legend for heatmap/hotspots */}
      {chartType === ChartType.HEATMAP && (
        <HeatmapHeader
          shotFilter={shotFilter}
          setShotFilter={setShotFilter}
          colorScale={colorScale}
          setColorScale={(s) => setColorScale(s as ColorScaleName)}
          colorScaleOptions={Object.keys(COLOR_SCALES)}
          maxValue={maxValue}
          colorScaleFn={COLOR_SCALES[colorScale]}
        />
      )}
      {chartType === ChartType.HOTSPOTS && (
        <HotspotsHeader
          colorScale={colorScale}
          setColorScale={(s) => setColorScale(s as ColorScaleName)}
          colorScaleOptions={Object.keys(COLOR_SCALES)}
          maxValue={maxValue}
          colorScaleFn={COLOR_SCALES[colorScale]}
        />
      )}

      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{
          background: "#f8f5f2",
          borderRadius: 12,
          width: "100%",
          height: "auto",
          display: "block",
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* --- Overlays (between background and lines) --- */}
        {chartType === ChartType.HEATMAP && (
          <HeatmapOverlay
            heatmapData={heatmapData}
            shotFilter={shotFilter}
            xScale={xScale}
            yScale={yScale}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            maxValue={maxValue}
            colorScale={COLOR_SCALES[colorScale]}
          />
        )}
        {chartType === ChartType.SCATTER && (
          <ScatterOverlay shots={shotEvents} xScale={xScale} yScale={yScale} />
        )}
        {chartType === ChartType.HOTSPOTS && (
          <HotspotsOverlay
            shots={shotEvents}
            xScale={xScale}
            yScale={yScale}
            colorScale={COLOR_SCALES[colorScale]}
          />
        )}

        {/* --- Court lines and markings (always on top) --- */}
        {/* Court boundary, center line, baseline */}
        <CourtBoundary
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          yScale={yScale}
        />

        {/* Paint (restricted area) */}
        <Paint
          paintLeft={paintLeft}
          paintRight={paintRight}
          paintTopY={paintTopY}
          paintBottomY={paintBottomY}
          svgWidth={svgWidth}
        />

        {/* Basket area (backboard, block, rim) */}
        <Basket
          centerX={centerX}
          rimY={rimY}
          xScale={xScale}
          yScale={yScale}
          svgWidth={svgWidth}
        />

        {/* Free-throw line and semi-circle */}
        <FreeThrow
          centerX={centerX}
          ftLineY={ftLineY}
          xScale={xScale}
          svgWidth={svgWidth}
        />

        {/* No-charge semi-circle and side lines */}
        <NoCharge
          centerX={centerX}
          rimY={rimY}
          ncLineY1={ncLineY1}
          ncLineY2={ncLineY2}
          xScale={xScale}
          svgWidth={svgWidth}
        />

        {/* Paint tick marks and blocks */}
        <PaintTicks
          xLeft_px={xScale((COURT_WIDTH - PAINT_WIDTH) / 2)}
          xRight_px={xScale((COURT_WIDTH + PAINT_WIDTH) / 2)}
          tickLength_px={xScale(tickLength) - xScale(0)}
          tickYs={[tick1Y, tick2Y, tick3Y]}
          yScale={yScale}
          svgWidth={svgWidth}
          blockY={blockY}
          blockHeight={blockHeight}
        />

        {/* Centre circle (top half) */}
        <CentreCircle centerX={centerX} xScale={xScale} svgWidth={svgWidth} />

        {/* 3pt arc and side lines */}
        <ThreePointArc
          xScale={xScale}
          yScale={yScale}
          svgWidth={svgWidth}
          COURT_WIDTH={COURT_WIDTH}
          THREE_PT_RADIUS={THREE_PT_RADIUS}
          THREE_PT_LINE_DIST={THREE_PT_LINE_DIST}
        />
      </svg>
    </div>
  );
};

export default ShotChart;
