// src/frontend/features/shot-chart/components/overlays/ZoneStatLabel.tsx
import { useFormatter } from "next-intl";

import { createStatFormat } from "@/shared/utils";

interface ZoneStatLabelProps {
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly fg: number | null;
  readonly total: number;
  readonly svgWidth: number;
  /** Which end of the text sits at `x`; centred unless the zone pins it. */
  readonly anchor?: "start" | "middle" | "end";
}

/**
 * ZoneStatLabel renders zone stats (FG%) for a zone.
 * Font size scales proportionally with svgWidth so labels stay correctly
 * sized at any container width.
 */
export function ZoneStatLabel({
  x,
  y,
  label,
  fg,
  total,
  svgWidth,
  anchor = "middle",
}: ZoneStatLabelProps) {
  const { percent } = createStatFormat(useFormatter());
  // Scales with the court; 11px is the floor for legibility.
  const statFontSize = Math.max(11, svgWidth / 40);
  const statLineHeight = statFontSize * 1.4;

  return (
    <>
      {label && (
        <text
          x={x}
          y={y - statLineHeight / 2}
          textAnchor={anchor}
          dominantBaseline="middle"
          style={{ fontSize: `${statFontSize}px` }}
          className="fill-court-label stroke-court-floor"
          strokeWidth={3}
          paintOrder="stroke"
          strokeLinejoin="round"
          pointerEvents="none"
        >
          {label}
        </text>
      )}
      <text
        x={x}
        y={y + statLineHeight / 2}
        textAnchor={anchor}
        dominantBaseline="middle"
        style={{ fontSize: `${statFontSize}px` }}
        className="fill-court-label stroke-court-floor"
        strokeWidth={3}
        paintOrder="stroke"
        strokeLinejoin="round"
        pointerEvents="none"
      >
        {total > 0 ? percent(fg ?? 0) : ""}
      </text>
    </>
  );
}
