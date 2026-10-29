// src/frontend/shared/components/blocks/stat-comparison/index.tsx
//
// Unified stat comparison primitive used by:
//   - TeamStatsComparison  (matches feature) → variant="dual"
//   - PlayerComparison     (players feature) → variant="mirrored"
//
// variant="dual"
//   Values and label on one line, a thin split bar beneath.
//   The leading value is set in heading weight, the other one quieter.
//
// variant="mirrored"
//   Two bars grow inward from a centre dot.
//   Winner receives a coloured pill below the value.
//
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Text } from "@/shared/components/typography";
import { cn, createStatFormat } from "@/shared/utils";

import { DualBar } from "./DualBar";
import { MirroredBars } from "./MirroredBars";
import { getWinner, resolveValue } from "./resolveValue";
import { SIDE_CLASSES } from "./sideClasses";
import { StatValue } from "./StatValue";
import type { StatComparisonProps } from "./types";

/**
 * Two stat lines compared row by row, with the winner of each marked.
 *
 * Two presentations, and they are not interchangeable. **`dual`** puts both
 * values on one line around the label, over one thin split bar, and sets the
 * leading value in heading weight — used where the two sides are halves of one
 * whole, like the teams in a match. Its rows are capped at a reading width,
 * since a split bar stretched across a wide page shows nothing more. **`mirrored`** (the
 * default) grows two bars inward from a centre dot and colours the winner —
 * used where the sides are independent, like two players' careers.
 *
 * **`percentageMap` applies to `dual` only** and is silently dropped otherwise;
 * a mirrored comparison shows bare values.
 *
 * Bars are held at zero width for one frame after mount, so the first paint
 * animates instead of appearing already filled. Which stats appear, their
 * labels, how their numbers read, and which direction wins are entirely the
 * caller's `config`.
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
  const tCommon = useTranslations("common");
  const formatter = useFormatter();
  const { percent } = createStatFormat(formatter);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isDual = variant === "dual";
  // percentageMap is only meaningful for the dual variant.
  const resolvedPercentageMap = isDual ? percentageMap : undefined;

  return (
    <div className={cn("w-full", isDual && "max-w-2xl mx-auto")}>
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
        {config.map(({ key, label, format, lowerIsBetter }, index) => {
          const options = {
            formatNumber:
              format ?? ((value: number) => formatter.number(value)),
            formatPercent: percent,
            percentageMap: resolvedPercentageMap,
            missingLabel: tCommon("notAvailable"),
          };
          const { display: displayA, numeric: numA } = resolveValue(
            sideA,
            key,
            options,
          );
          const { display: displayB, numeric: numB } = resolveValue(
            sideB,
            key,
            options,
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
              {isDual ? (
                <>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3 mb-1.5">
                    <StatValue
                      value={displayA}
                      winner={winner}
                      side="A"
                      isDual
                      delayMs={delayMs}
                      align="left"
                    />
                    <Text variant="overline" className="text-center">
                      {label}
                    </Text>
                    <StatValue
                      value={displayB}
                      winner={winner}
                      side="B"
                      isDual
                      delayMs={delayMs}
                      align="right"
                    />
                  </div>
                  <DualBar
                    fillA={fillA}
                    fillB={fillB}
                    delayMs={delayMs}
                    mounted={mounted}
                  />
                </>
              ) : (
                <>
                  <Text variant="overline" className="mb-2 block text-center">
                    {label}
                  </Text>
                  <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2">
                    <StatValue
                      value={displayA}
                      winner={winner}
                      side="A"
                      isDual={false}
                      delayMs={delayMs}
                      align="right"
                    />
                    <MirroredBars
                      fillA={fillA}
                      fillB={fillB}
                      delayMs={delayMs}
                      mounted={mounted}
                    />
                    <StatValue
                      value={displayB}
                      winner={winner}
                      side="B"
                      isDual={false}
                      delayMs={delayMs}
                      align="left"
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { resolveValue } from "./resolveValue";
export type { StatComparisonProps, StatConfig } from "./types";
