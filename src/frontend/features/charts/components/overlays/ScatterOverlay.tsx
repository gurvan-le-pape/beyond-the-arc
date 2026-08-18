// src/frontend/features/charts/components/overlays/ScatterOverlay.tsx
import type { ShotEvent } from "@/shared/types";

interface ScatterOverlayProps {
  /** The shots to plot; each is drawn individually rather than binned. */
  readonly shots: ShotEvent[];
  /** Court units to SVG pixels, horizontally. */
  readonly xScale: (x: number) => number;
  /** Court units to SVG pixels, vertically. */
  readonly yScale: (y: number) => number;
}

/** One glyph per shot: a green circle for a make, a red cross for a miss. */
export const ScatterOverlay: React.FC<ScatterOverlayProps> = ({
  shots,
  xScale,
  yScale,
}) => {
  const r = 6; // radius for made shots, half-length for cross arms
  return (
    <g>
      {shots.map((shot) => {
        const cx = xScale(shot.x);
        const cy = yScale(shot.y);
        const key = `${shot.x}-${shot.y}-${shot.made}`;
        if (shot.made) {
          return (
            <circle
              key={key}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              fillOpacity={0.7}
              stroke="#43a047"
              strokeWidth={1}
            />
          );
        } else {
          // Draw a cross (two lines)
          return (
            <g key={key}>
              <line
                x1={cx - r}
                y1={cy - r}
                x2={cx + r}
                y2={cy + r}
                stroke="#d32f2f"
                strokeWidth={2}
              />
              <line
                x1={cx - r}
                y1={cy + r}
                x2={cx + r}
                y2={cy - r}
                stroke="#d32f2f"
                strokeWidth={2}
              />
            </g>
          );
        }
      })}
    </g>
  );
};

export default ScatterOverlay;
