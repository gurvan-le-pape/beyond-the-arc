// src/frontend/shared/components/charts/overlays/TooltipContent.tsx
import React from "react";
import { createPortal } from "react-dom";

import { getTooltipPosition } from "@/shared/components/charts";

export type TooltipState = {
  x: number;
  y: number;
  made: number;
  missed: number;
  total: number;
  fg: number | null;
  cellRow: number;
  cellCol: number;
};

interface TooltipContentProps {
  tooltip: NonNullable<TooltipState>;
  shotFilter: "all" | "made" | "missed";
}

const TooltipContent: React.FC<TooltipContentProps> = ({
  tooltip,
  shotFilter,
}) => {
  const { left, top } = getTooltipPosition(tooltip.x, tooltip.y);
  let filterContent = null;
  if (shotFilter === "made") {
    const pct =
      tooltip.total > 0
        ? Math.round((tooltip.made / tooltip.total) * 100)
        : null;
    filterContent = (
      <div>
        <b>Made:</b> {tooltip.made} ({pct === null ? "-" : pct + "%"})
      </div>
    );
  } else if (shotFilter === "missed") {
    const pct =
      tooltip.total > 0
        ? Math.round((tooltip.missed / tooltip.total) * 100)
        : null;
    filterContent = (
      <div>
        <b>Missed:</b> {tooltip.missed} ({pct === null ? "-" : pct + "%"})
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
      {/* Cell coordinates for debugging/analysis */}
      <div>
        <b>Cell:</b> ({tooltip.cellRow}, {tooltip.cellCol})
      </div>
      <div>
        <b>Total:</b> {tooltip.total}
      </div>
      {/* Show all stats if filter is 'all' */}
      {shotFilter === "all" && (
        <>
          <div>
            <b>Made:</b> {tooltip.made}
          </div>
          <div>
            <b>Missed:</b> {tooltip.missed}
          </div>
          <div>
            <b>FG%:</b> {tooltip.fg === null ? "-" : tooltip.fg + "%"}
          </div>
        </>
      )}
      {/* Show only made or missed with % if filtered */}
      {filterContent}
    </div>,
    globalThis.document.body,
  );
};

export default TooltipContent;
