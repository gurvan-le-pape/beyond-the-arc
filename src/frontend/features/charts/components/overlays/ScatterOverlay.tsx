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
export function ScatterOverlay({ shots, xScale, yScale }: ScatterOverlayProps) {
  const r = 6; // radius for made shots, half-length for cross arms
  return (
    <g>
      {shots.map((shot, index) => {
        const cx = xScale(shot.x);
        const cy = yScale(shot.y);
        // ShotEvent carries no id, so the index is part of the key: two made
        // free throws are taken from the same spot and would otherwise collide
        // on `x-y-made`.
        const key = `${index}-${shot.x}-${shot.y}-${shot.made}`;
        if (shot.made) {
          return (
            <circle
              key={key}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              fillOpacity={0.7}
              className="stroke-event-made"
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
                className="stroke-event-miss"
                strokeWidth={2}
              />
              <line
                x1={cx - r}
                y1={cy + r}
                x2={cx + r}
                y2={cy - r}
                className="stroke-event-miss"
                strokeWidth={2}
              />
            </g>
          );
        }
      })}
    </g>
  );
}

export default ScatterOverlay;
