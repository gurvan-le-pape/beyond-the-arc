// src/frontend/features/players/components/detail/player-comparison/ComparisonTable.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { cn } from "@/shared/utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ComparisonStatConfig {
  key: string;
  labelKey: string;
  /** Extracts the displayable value from an aggregated-stats object. */
  value: (stats: any) => string | number;
  /**
   * Optional: when true the stat is "lower is better" (turnovers, fouls).
   * Defaults to false (higher is better).
   */
  lowerIsBetter?: boolean;
}

interface ComparisonTableProps {
  statsA: any;
  statsB: any;
  labelA: string;
  labelB: string;
  config: ComparisonStatConfig[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Given two numeric values and a lowerIsBetter flag, returns who "wins"
 * this stat, or "tie".  NaN on either side → tie (no highlight).
 */
function getWinner(
  numA: number,
  numB: number,
  lowerIsBetter?: boolean,
): "A" | "B" | "tie" {
  if (isNaN(numA) || isNaN(numB) || numA === numB) return "tie";
  const higherWins = !lowerIsBetter;
  return (higherWins ? numA > numB : numA < numB) ? "A" : "B";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Side-by-side player stat comparison.
 *
 * Layout per row:
 *
 *   VALUE  [████████░░░░ | ░░░░████████]  VALUE
 *          ← A bar        B bar →
 *
 * Each bar grows *inward* from its side toward a shared centre line.
 * The leader's bar fills fully to the centre; the other stops short,
 * proportional to (loser / leader).  This communicates relative magnitude
 * without implying the two values sum to a whole.
 *
 * Animation mirrors TeamStatsComparison: a single `mounted` flag flipped
 * after first paint drives CSS transitions on bar width, with a staggered
 * delay per row.
 *
 * The winning value receives a small coloured pill behind it;
 * ties are rendered neutrally.
 */
export function ComparisonTable({
  statsA,
  statsB,
  labelA,
  labelB,
  config,
}: ComparisonTableProps) {
  const t = useTranslations("common");

  // Flip after first paint so CSS transitions actually animate from 0.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="w-full">
      {/* ── Column headers ──────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center mb-5 px-1">
        {/* Label A – right-aligned */}
        <span className="text-end text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          {labelA}
        </span>

        {/* Spacer matching the centre dot */}
        <span className="w-1.5" />

        {/* Label B – left-aligned */}
        <span className="text-start text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
          {labelB}
        </span>
      </div>

      {/* ── Stat rows ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        {config.map((stat, index) => {
          const rawA = stat.value(statsA);
          const rawB = stat.value(statsB);
          const numA = Number(rawA);
          const numB = Number(rawB);
          const winner = getWinner(numA, numB, stat.lowerIsBetter);

          // Bar fill ratios – leader fills to 100 %, other scales down.
          const max = Math.max(numA, numB, 0.001); // avoid /0
          const fillA = (numA / max) * 100;
          const fillB = (numB / max) * 100;

          // Staggered delay, same ramp + cap as TeamStatsComparison.
          const delayMs = Math.min(index * 60, 400);

          return (
            <div key={stat.key}>
              {/* Stat label – centred above the row */}
              <p className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                {t(`${stat.labelKey}`)}
              </p>

              {/* VALUE | ←barA  ·  barB→ | VALUE */}
              <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-2 items-center">
                {/* ── Player A value ── */}
                <div className="text-right">
                  <span
                    className={cn(
                      "inline-block text-sm font-bold tabular-nums transition-colors duration-300",
                      winner === "A"
                        ? "text-primary-700 dark:text-primary-300"
                        : "text-gray-600 dark:text-gray-400",
                    )}
                  >
                    {rawA}
                  </span>
                  {/* Winner pill – sits below the value */}
                  <div
                    className={cn(
                      "h-1.5 rounded-full mt-1 transition-all duration-500",
                      winner === "A"
                        ? "bg-primary-500 dark:bg-primary-400"
                        : "bg-transparent",
                    )}
                    style={{
                      width: winner === "A" ? "100%" : "0%",
                      transitionDelay: `${delayMs + 300}ms`,
                    }}
                  />
                </div>

                {/* ── Bar A – grows rightward (toward centre) ── */}
                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-l-full overflow-hidden flex justify-end">
                  <div
                    className="h-full bg-primary-500 dark:bg-primary-400 rounded-l-full transition-all ease-out"
                    style={{
                      width: mounted ? `${fillA}%` : "0%",
                      transitionDuration: "600ms",
                      transitionDelay: `${delayMs}ms`,
                    }}
                  />
                </div>

                {/* ── Centre dot ── */}
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>

                {/* ── Bar B – grows leftward (toward centre) ── */}
                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-r-full overflow-hidden flex justify-start">
                  <div
                    className="h-full bg-secondary-500 dark:bg-secondary-400 rounded-r-full transition-all ease-out"
                    style={{
                      width: mounted ? `${fillB}%` : "0%",
                      transitionDuration: "600ms",
                      transitionDelay: `${delayMs}ms`,
                    }}
                  />
                </div>

                {/* ── Player B value ── */}
                <div className="text-left">
                  <span
                    className={cn(
                      "inline-block text-sm font-bold tabular-nums transition-colors duration-300",
                      winner === "B"
                        ? "text-secondary-700 dark:text-secondary-300"
                        : "text-gray-600 dark:text-gray-400",
                    )}
                  >
                    {rawB}
                  </span>
                  {/* Winner pill */}
                  <div
                    className={cn(
                      "h-1.5 rounded-full mt-1 transition-all duration-500",
                      winner === "B"
                        ? "bg-secondary-500 dark:bg-secondary-400"
                        : "bg-transparent",
                    )}
                    style={{
                      width: winner === "B" ? "100%" : "0%",
                      transitionDelay: `${delayMs + 300}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
