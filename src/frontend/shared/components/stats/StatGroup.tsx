// src/frontend/shared/components/stats/StatGroup.tsx
import {
  Grid,
  type GridColumnCount,
  type GridColumns,
} from "../primitives/Grid";
import { Stat } from "./Stat";

export interface StatGroupItem {
  readonly value: string;
  readonly label: string;
  /** The label written out, when `label` is an abbreviation. */
  readonly fullLabel?: string;
}

interface StatGroupProps {
  readonly stats: readonly StatGroupItem[];
  /**
   * The column count per breakpoint. Defaults to every stat on one row, up to
   * eight.
   */
  readonly columns?: GridColumns;
}

/**
 * A strip of `Stat`s with hairline rules between them and none on the outer
 * edges — a page band, a header's footer row, a season's per-game averages.
 *
 * Each `label` must be unique within the group: it keys the cell.
 */
export function StatGroup({ stats, columns }: StatGroupProps) {
  const oneRow = {
    base: Math.min(Math.max(stats.length, 1), 8) as GridColumnCount,
  };

  return (
    <Grid columns={columns ?? oneRow} divided>
      {stats.map((stat) => (
        <Stat
          key={stat.label}
          value={stat.value}
          label={stat.label}
          fullLabel={stat.fullLabel}
        />
      ))}
    </Grid>
  );
}

export default StatGroup;
