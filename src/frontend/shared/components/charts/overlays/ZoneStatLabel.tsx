// src/frontend/shared/components/charts/overlays/ZoneStatLabel.tsx
import React from "react";

interface ZoneStatLabelProps {
  x: number;
  y: number;
  label: string;
  fg: number | null;
  total: number;
  svgWidth: number;
}

/**
 * ZoneStatLabel renders zone stats (FG%) for a zone.
 * Font size scales proportionally with svgWidth so labels stay correctly
 * sized at any container width.
 */
export const ZoneStatLabel: React.FC<ZoneStatLabelProps> = ({
  x,
  y,
  label,
  fg,
  total,
  svgWidth,
}) => {
  // Scale font size with container — tuned so labels fit at all widths
  const statFontSize = Math.max(9, svgWidth / 55);
  const statLineHeight = statFontSize * 1.4;

  return (
    <>
      {label && (
        <text
          x={x}
          y={y - statLineHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: `${statFontSize}px` }}
          fill="#222"
          opacity={0.7}
          pointerEvents="none"
        >
          {label}
        </text>
      )}
      <text
        x={x}
        y={y + statLineHeight / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: `${statFontSize}px` }}
        fill="#222"
        opacity={0.85}
        pointerEvents="none"
      >
        {total > 0 ? `${fg ?? 0}%` : ""}
      </text>
    </>
  );
};

export default ZoneStatLabel;
