// src/frontend/shared/components/blocks/stat-comparison/index.tsx
//
// Unified stat comparison primitive used by:
//   - TeamStatsComparison  (matches feature) → variant="dual"
//   - PlayerComparison     (players feature) → variant="mirrored"
//
// variant="dual"
//   A single bar splits left (primary) and right (secondary).
//   Winner receives a bottom border underline.
//
// variant="mirrored"
//   Two bars grow inward from a centre dot.
//   Winner receives a coloured pill below the value.
//
"use client";

import { useEffect, useState } from "react";

import { Text } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

import { DualBar, MirroredBars } from "./bars";
import { getWinner, resolveValue } from "./resolveValue";
import { SIDE_CLASSES } from "./sideClasses";
import { StatValue } from "./StatValue";
import type { StatComparisonProps } from "./types";

/**
 * Two stat lines compared row by row, with the winner of each marked.
 *
 * Two presentations, and they are not interchangeable. **`dual`** puts one
 * split bar per row and underlines the winning value — used where the two sides
 * are halves of one whole, like the teams in a match. **`mirrored`** (the
 * default) grows two bars inward from a centre dot and colours the winner —
 * used where the sides are independent, like two players' careers.
 *
 * **`percentageMap` applies to `dual` only** and is silently dropped otherwise;
 * a mirrored comparison shows bare values.
 *
 * Bars are held at zero width for one frame after mount, so the first paint
 * animates instead of appearing already filled. Which stats appear, their
 * labels, and which direction wins are entirely the caller's `config`.
 */
export function StatComparison({
  sideA,
  sideB,
  labelA,
  labelB,
  config,
  variant = "mirrored",
  percentageMap,
}: StatComparisonProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isDual = variant === "dual";
  // percentageMap is only meaningful for the dual variant.
  const resolvedPercentageMap = isDual ? percentageMap : undefined;

  return (
    <div className="w-full">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center mb-5 px-1">
        <span
          className={cn(
            "text-end text-xs font-semibold uppercase tracking-wider",
            SIDE_CLASSES.A.label,
          )}
        >
          {labelA}
        </span>
        <span className="w-1.5" />
        <span
          className={cn(
            "text-start text-xs font-semibold uppercase tracking-wider",
            SIDE_CLASSES.B.label,
          )}
        >
          {labelB}
        </span>
      </div>

      <div className="space-y-4">
        {config.map(({ key, label, value: valueFn, lowerIsBetter }, index) => {
          const { display: displayA, numeric: numA } = resolveValue(
            sideA,
            key,
            valueFn,
            resolvedPercentageMap,
          );
          const { display: displayB, numeric: numB } = resolveValue(
            sideB,
            key,
            valueFn,
            resolvedPercentageMap,
          );
          const winner = getWinner(numA, numB, lowerIsBetter);
          const delayMs = Math.min(index * 60, 400);

          // dual: bars represent proportion of the combined total
          // mirrored: bars represent proportion of the larger value
          const total = numA + numB;
          const max = Math.max(numA, numB, 0.001);
          const dualFillA = total > 0 ? (numA / total) * 100 : 50;
          const dualFillB = total > 0 ? (numB / total) * 100 : 50;

          const fillA = isDual ? dualFillA : (numA / max) * 100;
          const fillB = isDual ? dualFillB : (numB / max) * 100;

          return (
            <div key={key}>
              <Text variant="overline" className="mb-2 block text-center">
                {label}
              </Text>

              <div
                className={cn(
                  "grid items-center gap-2",
                  isDual
                    ? "grid-cols-[auto_1fr_auto]"
                    : "grid-cols-[auto_1fr_auto_1fr_auto]",
                )}
              >
                <StatValue
                  value={displayA}
                  winner={winner}
                  side="A"
                  isDual={isDual}
                  delayMs={delayMs}
                  align="right"
                />

                {isDual ? (
                  <DualBar
                    fillA={fillA}
                    fillB={fillB}
                    delayMs={delayMs}
                    mounted={mounted}
                  />
                ) : (
                  <MirroredBars
                    fillA={fillA}
                    fillB={fillB}
                    delayMs={delayMs}
                    mounted={mounted}
                  />
                )}

                <StatValue
                  value={displayB}
                  winner={winner}
                  side="B"
                  isDual={isDual}
                  delayMs={delayMs}
                  align="left"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { resolveValue } from "./resolveValue";
export type { StatComparisonProps, StatConfig } from "./types";

export default StatComparison;
