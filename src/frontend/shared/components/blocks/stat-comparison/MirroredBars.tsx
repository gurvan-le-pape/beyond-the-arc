// src/frontend/shared/components/blocks/stat-comparison/MirroredBars.tsx
"use client";

import { Dot } from "@/shared/components/primitives";

import { BarFill } from "./BarFill";

interface MirroredBarsProps {
  readonly fillA: number;
  readonly fillB: number;
  readonly delayMs: number;
}

/**
 * Two tracks growing inward toward a centre dot, A right-aligned and B
 * left-aligned.
 *
 * **Returns three sibling elements, not a wrapper** — track, dot, track — so
 * the parent must supply the three-column grid that positions them. Dropped
 * into a plain block container they stack.
 */
export function MirroredBars({ fillA, fillB, delayMs }: MirroredBarsProps) {
  return (
    <>
      <div className="h-2.5 bg-surface-inset rounded-l-full overflow-hidden flex justify-end">
        <BarFill fill={fillA} delayMs={delayMs} side="A" roundedSide="left" />
      </div>
      <div className="flex items-center justify-center">
        <Dot size="sm" tone="muted" />
      </div>
      <div className="h-2.5 bg-surface-inset rounded-r-full overflow-hidden flex justify-start">
        <BarFill fill={fillB} delayMs={delayMs} side="B" roundedSide="right" />
      </div>
    </>
  );
}
