// src/frontend/shared/components/blocks/StatComparison.tsx
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
import { NA } from "@/shared/constants";
import { cn } from "@/shared/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatValue = string | number | null | undefined;

interface Stats {
  [key: string]: StatValue;
}

export interface StatConfig {
  key: string;
  label: string;
  /** Extracts the displayable value. Defaults to stats[key]. */
  value?: (stats: Stats) => string | number;
  /** When true, lower values win. Defaults to false (higher wins). */
  lowerIsBetter?: boolean;
}

export interface StatComparisonProps {
  readonly sideA: Stats;
  readonly sideB: Stats;
  readonly labelA: string;
  readonly labelB: string;
  readonly config: StatConfig[];
  /**
   * dual     — single split bar, winner underlined
   * mirrored — two bars growing from centre, winner pill
   */
  readonly variant?: "dual" | "mirrored";
  /**
   * Percentage key map, only applied in the "dual" variant.
   * e.g. { fieldGoals: "fieldGoalPercentage" }
   * Renders as "made (pct%)".
   */
  readonly percentageMap?: Record<string, string>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWinner(
  numA: number,
  numB: number,
  lowerIsBetter?: boolean,
): "A" | "B" | "tie" {
  if (Number.isNaN(numA) || Number.isNaN(numB) || numA === numB) return "tie";
  const aWins = lowerIsBetter ? numA < numB : numA > numB;
  return aWins ? "A" : "B";
}

function toNumber(value: StatValue): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : Number.NaN;
  }
  return Number.NaN;
}

export function resolveValue(
  stats: Stats,
  key: string,
  valueFn?: (s: Stats) => string | number,
  percentageMap?: Record<string, string>,
): { display: string | number; numeric: number } {
  // Custom resolver path
  if (valueFn) {
    const display = valueFn(stats);
    return {
      display,
      numeric: toNumber(display),
    };
  }

  const raw = stats[key];
  const pctKey = percentageMap?.[key];
  const pct = pctKey ? stats[pctKey] : undefined;

  const hasValidPct = typeof pct === "string" || typeof pct === "number";

  let display: string | number;

  if (raw === null || raw === undefined) {
    display = NA;
  } else if (hasValidPct) {
    display = `${raw} (${pct})`;
  } else {
    display = raw;
  }

  return {
    display,
    numeric: toNumber(raw),
  };
}

// ─── Lookup tables for Tailwind classes (avoids dynamic class construction) ──

const SIDE_CLASSES = {
  A: {
    text: "text-primary",
    border: "border-primary",
    bg: "bg-primary",
    label: "text-primary",
  },
  B: {
    text: "text-secondary",
    border: "border-secondary",
    bg: "bg-secondary",
    label: "text-secondary",
  },
} as const;

// ─── Bar sub-components ───────────────────────────────────────────────────────

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

function DualBar({ fillA, fillB, delayMs, mounted }: DualBarProps) {
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

function MirroredBars({ fillA, fillB, delayMs, mounted }: MirroredBarsProps) {
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

// ─── Value display ────────────────────────────────────────────────────────────

interface StatValueProps {
  readonly value: string | number;
  readonly winner: "A" | "B" | "tie";
  readonly side: "A" | "B";
  readonly isDual: boolean;
  readonly delayMs: number;
  readonly align: "left" | "right";
}

function StatValue({
  value,
  winner,
  side,
  isDual,
  delayMs,
  align,
}: StatValueProps) {
  const isWinner = winner === side;
  const classes = SIDE_CLASSES[side];

  const mirroredValueClass = isWinner ? classes.text : "text-text-body";
  const valueClass = isDual
    ? cn("text-text-heading", isWinner && `border-b-2 pb-0.5 ${classes.border}`)
    : cn(mirroredValueClass);

  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <span
        className={cn(
          "inline-block text-sm font-bold tabular-nums transition-colors duration-300",
          valueClass,
        )}
      >
        {value}
      </span>
      {!isDual && (
        <div
          className={cn(
            "h-1.5 rounded-full mt-1 transition-all duration-500",
            isWinner ? classes.bg : "bg-transparent",
          )}
          style={{
            width: isWinner ? "100%" : "0%",
            transitionDelay: `${delayMs + 300}ms`,
          }}
        />
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

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
      {/* ── Column headers ── */}
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

      {/* ── Stat rows ── */}
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
