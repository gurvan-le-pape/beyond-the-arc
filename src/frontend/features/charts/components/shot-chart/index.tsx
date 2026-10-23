// src/frontend/features/charts/components/shot-chart/index.tsx
"use client";

import { scaleLinear } from "d3-scale";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";

import {
  ChartType,
  COURT_WIDTH,
  HALF_COURT_HEIGHT,
  SHOT_COLOR_SCALE,
} from "@/features/charts/constants";
import { summarizeShots } from "@/features/charts/utils";
import type { Shot } from "@/features/matches/types";
import { transformToShotEvents } from "@/features/players/utils";

import { CourtMarkings } from "../court/CourtMarkings";
import HotspotsHeader from "../headers/HotspotsHeader";
import ScatterHeader from "../headers/ScatterHeader";
import HotspotsOverlay from "../overlays/HotspotsOverlay";
import ScatterOverlay from "../overlays/ScatterOverlay";
import { useCourtSize } from "./useCourtSize";

interface ShotChartProps {
  readonly shots: Shot[];
  readonly chartType?: ChartType;
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
  shots,
  chartType = ChartType.SCATTER,
}: ShotChartProps) {
  const { containerRef, size: containerSize } = useCourtSize(
    ASPECT,
    MIN_CHART_WIDTH,
  );

  // The busiest zone's count, fed back from HotspotsOverlay's zone binning.
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

  const shotEvents = useMemo(() => transformToShotEvents(shots), [shots]);

  const t = useTranslations("common");

  // `role="img"` needs a name and a description that carry the same information
  // the colours do, since none of it survives for a screen reader otherwise.
  const titleId = useId();
  const descId = useId();

  // Literal keys per branch: next-intl types `t` against the catalogue, so a
  // key held in a `string` variable does not type-check.
  const chartLabel = (() => {
    return chartType === ChartType.HOTSPOTS
      ? t("shotChart.hotspotsChartLabel")
      : t("shotChart.scatterChartLabel");
  })();

  const summary = useMemo(() => summarizeShots(shotEvents), [shotEvents]);

  return (
    <div
      ref={containerRef}
      className="w-full mx-auto flex flex-col justify-start items-center relative z-0"
    >
      {containerSize && (
        <>
          {chartType === ChartType.SCATTER && <ScatterHeader />}
          {chartType === ChartType.HOTSPOTS && (
            <HotspotsHeader maxValue={hotspotsMaxValue} />
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
                colorScale={SHOT_COLOR_SCALE}
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
