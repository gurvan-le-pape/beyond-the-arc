// src/frontend/shared/components/blocks/stat-comparison/DualBar.tsx
"use client";

import { BarFill } from "./BarFill";

interface DualBarProps {
  readonly fillA: number;
  readonly fillB: number;
  readonly delayMs: number;
}

/**
 * One thin track split between the two sides, A filling from the left and B
 * from the right so the pair always totals the track width, with a hairline
 * gap where they meet.
 *
 * Both halves share `delayMs`, so they animate as one bar rather than in
 * sequence.
 */
export function DualBar({ fillA, fillB, delayMs }: DualBarProps) {
  return (
    <div className="h-1.5 w-full bg-surface-inset rounded-full overflow-hidden flex gap-0.5">
      <BarFill fill={fillA} delayMs={delayMs} side="A" roundedSide="left" />
      <BarFill fill={fillB} delayMs={delayMs} side="B" roundedSide="right" />
    </div>
  );
}
