// src/frontend/shared/components/blocks/stat-comparison/bars.tsx
"use client";

import { cn } from "@/shared/utils";

import { SIDE_CLASSES } from "./sideClasses";

interface BarFillProps {
  readonly fill: number;
  readonly mounted: boolean;
  readonly delayMs: number;
  readonly side: "A" | "B";
  readonly roundedSide: "left" | "right";
}

function BarFill({ fill, mounted, delayMs, side, roundedSide }: BarFillProps) {
  return (
    <div
      className={cn(
        "h-full transition-[width] duration-[600ms] ease-out",
        SIDE_CLASSES[side].bg,
        roundedSide === "left" ? "rounded-l-full" : "rounded-r-full",
      )}
      style={{
        width: mounted ? `${fill}%` : "0%",
        transitionDelay: `${delayMs}ms`,
      }}
    />
  );
}

interface DualBarProps {
  readonly fillA: number;
  readonly fillB: number;
  readonly delayMs: number;
  readonly mounted: boolean;
}

/**
 * One thin track split between the two sides, A filling from the left and B
 * from the right so the pair always totals the track width, with a hairline
 * gap where they meet.
 *
 * Both halves share `delayMs`, so they animate as one bar rather than in
 * sequence. Widths apply only once `mounted` is true — see `StatComparison`,
 * which withholds it for a frame so the growth is visible.
 */
export function DualBar({ fillA, fillB, delayMs, mounted }: DualBarProps) {
  return (
    <div className="h-1.5 w-full bg-surface-inset rounded-full overflow-hidden flex gap-0.5">
      <BarFill
        fill={fillA}
        mounted={mounted}
        delayMs={delayMs}
        side="A"
        roundedSide="left"
      />
      <BarFill
        fill={fillB}
        mounted={mounted}
        delayMs={delayMs}
        side="B"
        roundedSide="right"
      />
    </div>
  );
}

interface MirroredBarsProps {
  readonly fillA: number;
  readonly fillB: number;
  readonly delayMs: number;
  readonly mounted: boolean;
}

/**
 * Two tracks growing inward toward a centre dot, A right-aligned and B
 * left-aligned.
 *
 * **Returns three sibling elements, not a wrapper** — track, dot, track — so
 * the parent must supply the three-column grid that positions them. Dropped
 * into a plain block container they stack.
 *
 * Widths apply only once `mounted` is true, as with `DualBar`.
 */
export function MirroredBars({
  fillA,
  fillB,
  delayMs,
  mounted,
}: MirroredBarsProps) {
  return (
    <>
      <div className="h-2.5 bg-surface-inset rounded-l-full overflow-hidden flex justify-end">
        <BarFill
          fill={fillA}
          mounted={mounted}
          delayMs={delayMs}
          side="A"
          roundedSide="left"
        />
      </div>
      <div className="flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
      </div>
      <div className="h-2.5 bg-surface-inset rounded-r-full overflow-hidden flex justify-start">
        <BarFill
          fill={fillB}
          mounted={mounted}
          delayMs={delayMs}
          side="B"
          roundedSide="right"
        />
      </div>
    </>
  );
}
