// src/frontend/shared/components/blocks/stat-comparison/types.ts
export type StatValue = string | number | null | undefined;

export interface Stats {
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
