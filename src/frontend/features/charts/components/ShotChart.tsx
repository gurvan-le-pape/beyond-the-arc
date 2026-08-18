// src/frontend/features/charts/components/ShotChart.tsx
"use client";

import { scaleLinear } from "d3-scale";
import { useTranslations } from "next-intl";
import React, { useId, useMemo, useState } from "react";

import type { MatchEvent } from "@/features/matches/types";

import type { ColorScaleName } from "../constants";
import {
  BASELINE_TO_RIM,
  ChartType,
  COLOR_SCALE_LIST,
  COLOR_SCALES,
  COURT_WIDTH,
  DEFAULT_COLOR_SCALE,
  FREE_THROW_LINE_DIST,
  HALF_COURT_HEIGHT,
  NO_CHARGE_LINE_DIST,
  NO_CHARGE_LINE_LENGTH,
  PAINT_HEIGHT,
  PAINT_WIDTH,
  ShotFilter,
  THREE_PT_LINE_DIST,
  THREE_PT_RADIUS,
} from "../constants";
import { useBinnedShots } from "../hooks";
import Basket from "./court/Basket";
import CentreCircle from "./court/CentreCircle";
import CourtBoundary from "./court/CourtBoundary";
import FreeThrow from "./court/FreeThrow";
import NoCharge from "./court/NoCharge";
import Paint from "./court/Paint";
import PaintTicks from "./court/PaintTicks";
import ThreePointArc from "./court/ThreePointArc";
import HeatmapHeader from "./headers/HeatmapHeader";
import HotspotsHeader from "./headers/HotspotsHeader";
import ScatterHeader from "./headers/ScatterHeader";
import HeatmapOverlay from "./overlays/HeatmapOverlay";
import HotspotsOverlay from "./overlays/HotspotsOverlay";
import ScatterOverlay from "./overlays/ScatterOverlay";

interface ShotChartProps {
  matchEvents: MatchEvent[];
  chartType?: ChartType;
}

// Derived from actual FIBA constants — not hardcoded magic numbers
const ASPECT = COURT_WIDTH / HALF_COURT_HEIGHT;

// Minimum width below which the chart becomes unusable on mobile
const MIN_CHART_WIDTH = 320;

/**
 * The shot chart for a set of match events, in the variant `chartType` picks.
 *
 * Court markings are painted *after* the overlay data — SVG paints in document
 * order, so overlays first and the lines on top is what keeps shots from
 * burying the court.
 */
export function ShotChart({
  matchEvents,
  chartType = ChartType.SCATTER,
}: ShotChartProps) {
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
  const [colorScale, setColorScale] =
    useState<ColorScaleName>(DEFAULT_COLOR_SCALE);

  // Separate max value for hotspots — fed back from HotspotsOverlay's zone binning,
  // which is more accurate than the heatmap grid binning used for maxValue below.
  const [hotspotsMaxValue, setHotspotsMaxValue] = useState<number>(1);

  const svgWidth = containerSize?.width ?? 0;
  const svgHeight = containerSize?.height ?? 0;

  const xScale = useMemo(
    () => scaleLinear().domain([0, COURT_WIDTH]).range([0, svgWidth]),
    [svgWidth],
  );
  const yScale = useMemo(
    () => scaleLinear().domain([0, HALF_COURT_HEIGHT]).range([svgHeight, 0]),
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

  const t = useTranslations("common");

  // `role="img"` needs a name and a description that carry the same information
  // the colours do, since none of it survives for a screen reader otherwise.
  const titleId = useId();
  const descId = useId();

  // Literal keys per branch: next-intl types `t` against the catalogue, so a
  // key held in a `string` variable does not type-check.
  const chartLabel =
    chartType === ChartType.HEATMAP
      ? t("shotChart.heatmapChartLabel")
      : chartType === ChartType.HOTSPOTS
        ? t("shotChart.hotspotsChartLabel")
        : t("shotChart.scatterChartLabel");

  const summary = useMemo(() => {
    const total = shotEvents.length;
    const made = shotEvents.filter((shot) => shot.made).length;
    return {
      total,
      made,
      missed: total - made,
      percent: total > 0 ? Math.round((made / total) * 100) : 0,
    };
  }, [shotEvents]);

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
      ref={containerRef}
      className="w-full mx-auto flex flex-col justify-start items-center relative z-0"
    >
      {containerSize && (
        <>
          {chartType === ChartType.SCATTER && <ScatterHeader />}
          {chartType === ChartType.HEATMAP && (
            <HeatmapHeader
              shotFilter={shotFilter}
              setShotFilter={setShotFilter}
              colorScale={colorScale}
              setColorScale={setColorScale}
              colorScaleOptions={COLOR_SCALE_LIST}
              maxValue={maxValue}
              colorScaleFn={COLOR_SCALES[colorScale]}
            />
          )}
          {chartType === ChartType.HOTSPOTS && (
            <HotspotsHeader
              colorScale={colorScale}
              setColorScale={setColorScale}
              colorScaleOptions={COLOR_SCALE_LIST}
              maxValue={hotspotsMaxValue}
              colorScaleFn={COLOR_SCALES[colorScale]}
            />
          )}

          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ background: "#f8f5f2" }}
            className="w-full h-auto block rounded-xl"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            <title id={titleId}>{chartLabel}</title>
            <desc id={descId}>{t("shotChart.chartSummary", summary)}</desc>
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
            <CourtBoundary
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              yScale={yScale}
            />

            <Paint
              paintLeft={paintLeft}
              paintRight={paintRight}
              paintTopY={paintTopY}
              paintBottomY={paintBottomY}
              svgWidth={svgWidth}
            />

            <Basket
              centerX={centerX}
              rimY={rimY}
              xScale={xScale}
              yScale={yScale}
              svgWidth={svgWidth}
            />

            <FreeThrow
              centerX={centerX}
              ftLineY={ftLineY}
              xScale={xScale}
              svgWidth={svgWidth}
            />

            <NoCharge
              centerX={centerX}
              rimY={rimY}
              ncLineY1={ncLineY1}
              ncLineY2={ncLineY2}
              xScale={xScale}
              svgWidth={svgWidth}
            />

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

            <CentreCircle
              centerX={centerX}
              xScale={xScale}
              svgWidth={svgWidth}
            />

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
}

export default ShotChart;
