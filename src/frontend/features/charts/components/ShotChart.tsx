// src/frontend/features/charts/components/ShotChart.tsx
"use client";

import { scaleLinear } from "d3-scale";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";

import type { MatchEvent } from "@/features/matches/types";

import type { ColorScaleName } from "../constants";
import {
  ChartType,
  COLOR_SCALE_LIST,
  COLOR_SCALES,
  COURT_WIDTH,
  DEFAULT_COLOR_SCALE,
  HALF_COURT_HEIGHT,
  ShotFilter,
} from "../constants";
import { useBinnedShots, useCourtSize } from "../hooks";
import { maxCellValue, summarizeShots } from "../utils";
import { CourtMarkings } from "./court/CourtMarkings";
import HeatmapHeader from "./headers/HeatmapHeader";
import HotspotsHeader from "./headers/HotspotsHeader";
import ScatterHeader from "./headers/ScatterHeader";
import HeatmapOverlay from "./overlays/HeatmapOverlay";
import HotspotsOverlay from "./overlays/HotspotsOverlay";
import ScatterOverlay from "./overlays/ScatterOverlay";

interface ShotChartProps {
  readonly matchEvents: MatchEvent[];
  readonly chartType?: ChartType;
}

// Derived from actual FIBA constants — not hardcoded magic numbers
const ASPECT = COURT_WIDTH / HALF_COURT_HEIGHT;

// Minimum width below which the chart becomes unusable on mobile
const MIN_CHART_WIDTH = 320;

// The heatmap's grid over the half court.
const HEATMAP_ROWS = 56;
const HEATMAP_COLS = 60;
const CELL_WIDTH = COURT_WIDTH / HEATMAP_COLS;
const CELL_HEIGHT = HALF_COURT_HEIGHT / HEATMAP_ROWS;

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
  const { containerRef, size: containerSize } = useCourtSize(
    ASPECT,
    MIN_CHART_WIDTH,
  );

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

  const { bins: heatmapData, shotEvents } = useBinnedShots(
    matchEvents,
    HEATMAP_ROWS,
    HEATMAP_COLS,
    CELL_WIDTH,
    CELL_HEIGHT,
  );

  const t = useTranslations("common");

  // `role="img"` needs a name and a description that carry the same information
  // the colours do, since none of it survives for a screen reader otherwise.
  const titleId = useId();
  const descId = useId();

  // Literal keys per branch: next-intl types `t` against the catalogue, so a
  // key held in a `string` variable does not type-check.
  const chartLabel = (() => {
    switch (chartType) {
      case ChartType.HEATMAP:
        return t("shotChart.heatmapChartLabel");
      case ChartType.HOTSPOTS:
        return t("shotChart.hotspotsChartLabel");
      default:
        return t("shotChart.scatterChartLabel");
    }
  })();

  const summary = useMemo(() => summarizeShots(shotEvents), [shotEvents]);
  const maxValue = useMemo(
    () => maxCellValue(heatmapData, shotFilter),
    [heatmapData, shotFilter],
  );

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
            className="w-full h-auto block rounded-xl bg-court-floor"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            <title id={titleId}>{chartLabel}</title>
            <desc id={descId}>
              {t("shotChart.chartSummary", { ...summary })}
            </desc>
            {/* --- Overlays (between background and lines) --- */}
            {chartType === ChartType.HEATMAP && (
              <HeatmapOverlay
                heatmapData={heatmapData}
                shotFilter={shotFilter}
                xScale={xScale}
                yScale={yScale}
                cellWidth={CELL_WIDTH}
                cellHeight={CELL_HEIGHT}
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
            <CourtMarkings
              xScale={xScale}
              yScale={yScale}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
            />
          </svg>
        </>
      )}
    </div>
  );
}

export default ShotChart;
