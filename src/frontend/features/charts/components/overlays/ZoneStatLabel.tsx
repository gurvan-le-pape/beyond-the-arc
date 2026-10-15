// src/frontend/features/charts/components/overlays/ZoneStatLabel.tsx

interface ZoneStatLabelProps {
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly fg: number | null;
  readonly total: number;
  readonly svgWidth: number;
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
}: ZoneStatLabelProps) {
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
          className="fill-court-label stroke-court-floor"
          strokeWidth={3}
          paintOrder="stroke"
          strokeLinejoin="round"
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
        className="fill-court-label stroke-court-floor"
        strokeWidth={3}
        paintOrder="stroke"
        strokeLinejoin="round"
        opacity={0.85}
        pointerEvents="none"
      >
        {total > 0 ? `${fg ?? 0}%` : ""}
      </text>
    </>
  );
}

export default ZoneStatLabel;
