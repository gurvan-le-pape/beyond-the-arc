// src/frontend/features/geography/components/ChoroplethMap.tsx
"use client";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

import type { MapShape } from "../types";

/** What one shape shows: its count, where it leads and how it is named. */
export interface ChoroplethDatum {
  readonly value: number;
  readonly href: string;
  /** Accessible name and tooltip, already formatted: "Bretagne, 330 clubs". */
  readonly label: string;
}

const TONES = {
  regional: {
    base: "fill-tint-regional",
    fill: "fill-solid-regional",
  },
  departmental: {
    base: "fill-tint-departmental",
    fill: "fill-solid-departmental",
  },
} as const;

// Each shape is the tone's tint with its solid laid over at an opacity, so the
// scale runs tint → solid in either theme instead of fading into the page. The
// faintest still reads as filled, and the scale is a square root so one dense
// area does not wash every other one out.
const MIN_OPACITY = 0.08;

function opacityFor(value: number, max: number): number {
  if (max <= 0) return MIN_OPACITY;
  return MIN_OPACITY + (1 - MIN_OPACITY) * Math.sqrt(value / max);
}

interface ChoroplethMapProps {
  readonly shapes: readonly MapShape[];
  readonly frame: { readonly width: number; readonly height: number };
  /** By shape code. A shape with no datum is drawn as a plain outline. */
  readonly data: Readonly<Partial<Record<string, ChoroplethDatum>>>;
  readonly tone: keyof typeof TONES;
  /** The shape to outline, from the map's own hover or the caller's. */
  readonly highlighted?: string | null;
  readonly onHighlight?: (code: string | null) => void;
  /** Shapes to fade, e.g. those a search filtered out. */
  readonly muted?: ReadonlySet<string>;
  readonly className?: string;
}

/**
 * A map whose areas are shaded by a count and link to a page each.
 *
 * Drawn as plain SVG from pre-simplified paths, so it costs a few kilobytes
 * rather than a map library and renders with the page. It is a pointer
 * shortcut: the links are out of the tab order and hidden from assistive
 * technology, because the list beside it carries the same links and counts.
 */
export function ChoroplethMap({
  shapes,
  frame,
  data,
  tone,
  highlighted,
  onHighlight,
  muted,
  className,
}: ChoroplethMapProps) {
  const { base, fill } = TONES[tone];
  const max = Math.max(
    0,
    ...Object.values(data).map((datum) => datum?.value ?? 0),
  );
  const outlined = shapes.find((shape) => shape.code === highlighted);

  return (
    <svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      className={cn("w-full h-auto", className)}
      aria-hidden="true"
      onMouseLeave={() => onHighlight?.(null)}
    >
      {shapes.map((shape) => {
        const datum = data[shape.code];
        const isMuted = muted?.has(shape.code) ?? false;
        const path = (
          <g className={cn("transition-opacity", isMuted && "opacity-25")}>
            <path d={shape.d} className={datum ? base : "fill-divide"} />
            {datum && (
              <path
                d={shape.d}
                className={fill}
                fillOpacity={opacityFor(datum.value, max)}
              >
                <title>{datum.label}</title>
              </path>
            )}
            <path
              d={shape.d}
              className="fill-none stroke-surface-base"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </g>
        );
        return datum ? (
          <Link
            key={shape.code}
            href={datum.href}
            tabIndex={-1}
            onMouseEnter={() => onHighlight?.(shape.code)}
          >
            {path}
          </Link>
        ) : (
          <g key={shape.code}>{path}</g>
        );
      })}

      {/* Drawn last so the outline sits above its neighbours' borders. */}
      {outlined && (
        <path
          d={outlined.d}
          className="fill-none pointer-events-none stroke-text-heading"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
