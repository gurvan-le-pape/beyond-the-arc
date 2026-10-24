// src/frontend/shared/components/blocks/stat-comparison/DualBar.tsx
"use client";

import { BarFill } from "./BarFill";

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
