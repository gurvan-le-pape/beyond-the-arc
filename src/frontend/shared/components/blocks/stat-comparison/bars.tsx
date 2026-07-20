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

export function DualBar({ fillA, fillB, delayMs, mounted }: DualBarProps) {
  return (
    <div className="h-2.5 w-full bg-surface-inset rounded-button overflow-hidden flex">
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
