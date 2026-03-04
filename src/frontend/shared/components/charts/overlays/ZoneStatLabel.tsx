// src/frontend/shared/components/charts/overlays/ZoneStatLabel.tsx
import React from "react";

interface ZoneStatLabelProps {
  x: number;
  y: number;
  label: string;
  fg: number | null;
  total: number;
}

/**
 * ZoneStatLabel renders the zone label and stats (FG% • total shots) for a zone.
 */
export const ZoneStatLabel: React.FC<ZoneStatLabelProps> = ({
  x,
  y,
  label,
  fg,
  total,
}) => (
  <>
    <text
      x={x}
      y={y}
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize={18}
      fill="#222"
      opacity={0.7}
      pointerEvents="none"
    >
      {label}
    </text>
    <text
      x={x}
      y={y + 20}
      textAnchor="middle"
      alignmentBaseline="hanging"
      fontSize={13}
      fill="#222"
      opacity={0.85}
      pointerEvents="none"
    >
      {total > 0 ? `${fg ?? 0}% • ${total}` : ""}
    </text>
  </>
);

export default ZoneStatLabel;
