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
  // Scales with the court; 11px is the floor for legibility, and at that size
  // "100%" still fits inside the narrow corner-three zones.
  const statFontSize = Math.max(11, svgWidth / 40);
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
        pointerEvents="none"
      >
        {total > 0 ? `${fg ?? 0}%` : ""}
      </text>
    </>
  );
}

export default ZoneStatLabel;
