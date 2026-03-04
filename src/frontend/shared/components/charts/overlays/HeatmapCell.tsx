// src/frontend/shared/components/charts/overlays/HeatmapCell.tsx
import React from "react";

interface HeatmapCellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  onMouseMove: (e: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
  onMouseLeave: () => void;
  style?: React.CSSProperties;
}

/**
 * HeatmapCell renders a single SVG rect for a heatmap cell.
 * Handles highlight, color, and mouse events.
 */
export const HeatmapCell: React.FC<HeatmapCellProps> = ({
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
}) => (
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

export default HeatmapCell;
