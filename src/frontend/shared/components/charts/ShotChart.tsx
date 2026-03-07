// src/frontend/shared/components/charts/ShotChart.tsx
"use client";

import * as d3 from "d3";
import React, { useMemo, useState } from "react";

import type { MatchEvent } from "@/features/matches/types/MatchEvent";
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
import { ChartType, ShotFilter } from "@/shared/constants/chart-types";
import { useBinnedShots } from "@/shared/hooks";

import HotspotsHeader from "./headers/HotspotsHeader";

interface ShotChartProps {
  matchEvents: MatchEvent[];
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

// Derived from actual FIBA constants — not hardcoded magic numbers
const ASPECT = COURT_WIDTH / HALF_COURT_HEIGHT;

// Minimum width below which the chart becomes unusable on mobile
const MIN_CHART_WIDTH = 320;

export const ShotChart: React.FC<ShotChartProps> = ({
  matchEvents,
  chartType = ChartType.SCATTER,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // null until first ResizeObserver measurement — prevents flash of wrong size
  const [containerSize, setContainerSize] = React.useState<{
    width: number;
    height: number;
  } | null>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number;
    const observer = new ResizeObserver((entries) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const entry = entries[0];
        if (!entry) return;
        const w = Math.max(entry.contentRect.width, MIN_CHART_WIDTH);
        setContainerSize({ width: w, height: w / ASPECT });
      });
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  const [shotFilter, setShotFilter] = useState<ShotFilter>(ShotFilter.ALL);
  const [colorScale, setColorScale] = useState<ColorScaleName>("YlOrRd");

  // Separate max value for hotspots — fed back from HotspotsOverlay's zone binning,
  // which is more accurate than the heatmap grid binning used for maxValue below.
  const [hotspotsMaxValue, setHotspotsMaxValue] = useState<number>(1);

  const svgWidth = containerSize?.width ?? 0;
  const svgHeight = containerSize?.height ?? 0;

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
  const tickLength = 0.1;
  const tick1Y = 1.75;
  const blockY = tick1Y + 0.85;
  const blockHeight = 0.4;
  const tick2Y = blockY + blockHeight + 0.85;
  const tick3Y = tick2Y + 0.85;

  // Heatmap grid/cell config
  const rows = 56,
    cols = 60;
  const cellWidth = COURT_WIDTH / cols;
  const cellHeight = HALF_COURT_HEIGHT / rows;

  const { bins: heatmapData, shotEvents } = useBinnedShots(
    matchEvents,
    rows,
    cols,
    cellWidth,
    cellHeight,
  );

  const flat = heatmapData.flat();
  const maxValue = useMemo(() => {
    if (shotFilter === ShotFilter.MADE)
      return Math.max(1, ...flat.map((cell) => cell.made));
    if (shotFilter === ShotFilter.MISSED)
      return Math.max(1, ...flat.map((cell) => cell.missed));
    return Math.max(1, ...flat.map((cell) => cell.total));
  }, [flat, shotFilter]);

  return (
    <div
      className="shotchart-container"
      ref={containerRef}
      style={{
        position: "relative",
        zIndex: 0,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {containerSize && (
        <>
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
              maxValue={hotspotsMaxValue}
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
              <ScatterOverlay
                shots={shotEvents}
                xScale={xScale}
                yScale={yScale}
              />
            )}
            {chartType === ChartType.HOTSPOTS && (
              <HotspotsOverlay
                shots={shotEvents}
                xScale={xScale}
                yScale={yScale}
                colorScale={COLOR_SCALES[colorScale]}
                svgWidth={svgWidth}
                onMaxTotalChange={setHotspotsMaxValue}
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
            <CentreCircle
              centerX={centerX}
              xScale={xScale}
              svgWidth={svgWidth}
            />

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
        </>
      )}
    </div>
  );
};

export default ShotChart;
