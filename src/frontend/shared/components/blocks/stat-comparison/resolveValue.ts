// src/frontend/shared/components/blocks/stat-comparison/resolveValue.ts
import { NA } from "@/shared/constants";

import type { Stats, StatValue } from "./types";

export function getWinner(
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

  // The "%" belongs here, not in the value. The API sends a number or null, so
  // the unit is added at the point of display and the absent case simply drops
  // the parenthetical rather than printing an English sentinel like "N/A" into
  // a bilingual UI.
  let display: string | number;

  if (raw === null || raw === undefined) {
    display = NA;
  } else if (typeof pct === "number") {
    display = `${raw} (${pct}%)`;
  } else {
    display = raw;
  }

  return {
    display,
    numeric: toNumber(raw),
  };
}
