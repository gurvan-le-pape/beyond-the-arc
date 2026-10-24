// src/frontend/shared/components/blocks/stat-comparison/BarFill.tsx
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

/** One side's fill within a bar track, growing to `fill`% once `mounted`. */
export function BarFill({
  fill,
  mounted,
  delayMs,
  side,
  roundedSide,
}: BarFillProps) {
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
