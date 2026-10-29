// src/frontend/features/shot-chart/components/overlays/TooltipContent.tsx
import { useFormatter, useTranslations } from "next-intl";
import { createPortal } from "react-dom";

import { getTooltipPosition } from "@/features/shot-chart/utils";
import { createStatFormat } from "@/shared/utils";

import { ShotFilter } from "../../constants";

export interface TooltipState {
  x: number;
  y: number;
  made: number;
  missed: number;
  total: number;
  fg: number | null;
  cellRow?: number;
  cellCol?: number;
}

interface TooltipContentProps {
  tooltip: NonNullable<TooltipState>;
  shotFilter: ShotFilter;
}

/**
 * The hover tooltip for a chart cell or zone, portaled to `document.body` so
 * it escapes the SVG — fixed at the cursor and non-interactive.
 */
export function TooltipContent({ tooltip, shotFilter }: TooltipContentProps) {
  const t = useTranslations("common");
  const { percent } = createStatFormat(useFormatter());
  const { left, top } = getTooltipPosition(tooltip.x, tooltip.y);

  let filterContent = null;
  if (shotFilter === ShotFilter.MADE) {
    const pct =
      tooltip.total > 0
        ? Math.round((tooltip.made / tooltip.total) * 100)
        : null;
    filterContent = (
      <div>
        <b>{t("withColon", { label: t("shotChart.madeLabel") })}</b>{" "}
        {tooltip.made} ({pct === null ? "-" : percent(pct)})
      </div>
    );
  } else if (shotFilter === ShotFilter.MISSED) {
    const pct =
      tooltip.total > 0
        ? Math.round((tooltip.missed / tooltip.total) * 100)
        : null;
    filterContent = (
      <div>
        <b>{t("withColon", { label: t("shotChart.missedLabel") })}</b>{" "}
        {tooltip.missed} ({pct === null ? "-" : percent(pct)})
      </div>
    );
  }

  return createPortal(
    <div
      className="shotchart-tooltip"
      style={{
        position: "fixed",
        left,
        top,
        background: "rgba(30,30,30,0.97)",
        color: "#fff",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 15,
        pointerEvents: "none",
        zIndex: 2147483647,
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
        maxWidth: 220,
        whiteSpace: "nowrap",
      }}
    >
      {/* Only show cell coordinates when available (grid/heatmap charts) */}
      {tooltip.cellRow !== undefined && tooltip.cellCol !== undefined && (
        <div>
          <b>{t("withColon", { label: t("shotChart.cell") })}</b> (
          {tooltip.cellRow}, {tooltip.cellCol})
        </div>
      )}
      <div>
        <b>{t("withColon", { label: t("shotChart.total") })}</b> {tooltip.total}
      </div>
      {/* Show all stats if filter is 'all' */}
      {shotFilter === ShotFilter.ALL && (
        <>
          <div>
            <b>{t("withColon", { label: t("shotChart.madeLabel") })}</b>{" "}
            {tooltip.made}
          </div>
          <div>
            <b>{t("withColon", { label: t("shotChart.missedLabel") })}</b>{" "}
            {tooltip.missed}
          </div>
          <div>
            <b>{t("withColon", { label: t("shotChart.fgPercent") })}</b>{" "}
            {tooltip.fg === null ? "-" : percent(tooltip.fg)}
          </div>
        </>
      )}
      {/* Show only made or missed with % if filtered */}
      {filterContent}
    </div>,
    globalThis.document.body,
  );
}
