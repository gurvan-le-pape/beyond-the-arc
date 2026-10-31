// src/frontend/shared/components/blocks/stat-comparison/BarFill.tsx
"use client";

import { cn } from "@/shared/utils";

import { SIDE_CLASSES } from "./sideClasses";

interface BarFillProps {
  readonly fill: number;
  readonly delayMs: number;
  readonly side: "A" | "B";
  readonly roundedSide: "left" | "right";
}

/**
 * One side's fill within a bar track, growing from empty to `fill`% on first
 * paint after `delayMs`, and sliding to a new `fill` when it changes.
 */
export function BarFill({ fill, delayMs, side, roundedSide }: BarFillProps) {
  return (
    <div
      className={cn(
        "h-full transition-[width] duration-[600ms] ease-out",
        "animate-bar-grow motion-reduce:animate-none",
        SIDE_CLASSES[side].bg,
        roundedSide === "left" ? "rounded-l-full" : "rounded-r-full",
      )}
      style={{
        width: `${fill}%`,
        animationDelay: `${delayMs}ms`,
        transitionDelay: `${delayMs}ms`,
      }}
    />
  );
}
