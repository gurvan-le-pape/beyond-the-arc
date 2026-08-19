// src/frontend/features/charts/components/overlays/HeatmapCell.tsx
import React from "react";

interface HeatmapCellProps {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly fill: string;
  readonly fillOpacity: number;
  readonly stroke: string;
  readonly strokeWidth: number;
  readonly onMouseMove: (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
  ) => void;
  readonly onMouseLeave: () => void;
  readonly style?: React.CSSProperties;
}

/**
 * HeatmapCell renders a single SVG rect for a heatmap cell.
 * Handles highlight, color, and mouse events.
 */
export function HeatmapCell({
  x,
  y,
  width,
  height,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  onMouseMove,
  onMouseLeave,
  style,
}: HeatmapCellProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
    />
  );
}

export default HeatmapCell;
