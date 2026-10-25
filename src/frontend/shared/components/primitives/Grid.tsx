// src/frontend/shared/components/primitives/Grid.tsx
import { Children, isValidElement, type ReactNode } from "react";

import { cn } from "@/shared/utils";

/** How many columns the grid has, from one breakpoint up. */
export type GridColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Breakpoint = "base" | "sm" | "md" | "lg";

/**
 * The column count at each breakpoint, mobile first: `base` holds below `sm`,
 * and a breakpoint left out keeps the count of the one before it.
 */
export type GridColumns = { readonly base: GridColumnCount } & Partial<
  Record<Exclude<Breakpoint, "base">, GridColumnCount>
>;

const BREAKPOINTS: readonly Breakpoint[] = ["base", "sm", "md", "lg"];

/** The space between cells, on Tailwind's spacing scale. */
export type GridGap = 3 | 4 | 6 | 8;

const GAP_CLASSES: Record<GridGap, string> = {
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

// Whole class names, so Tailwind's scanner sees every one it must generate.
const COLUMN_CLASSES: Record<Breakpoint, Record<GridColumnCount, string>> = {
  base: {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
  },
  sm: {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
    7: "sm:grid-cols-7",
    8: "sm:grid-cols-8",
  },
  md: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    7: "md:grid-cols-7",
    8: "md:grid-cols-8",
  },
  lg: {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-7",
    8: "lg:grid-cols-8",
  },
};

const RULE_CLASSES: Record<
  Breakpoint,
  { right: string; noRight: string; bottom: string; noBottom: string }
> = {
  base: {
    right: "border-r",
    noRight: "border-r-0",
    bottom: "border-b",
    noBottom: "border-b-0",
  },
  sm: {
    right: "sm:border-r",
    noRight: "sm:border-r-0",
    bottom: "sm:border-b",
    noBottom: "sm:border-b-0",
  },
  md: {
    right: "md:border-r",
    noRight: "md:border-r-0",
    bottom: "md:border-b",
    noBottom: "md:border-b-0",
  },
  lg: {
    right: "lg:border-r",
    noRight: "lg:border-r-0",
    bottom: "lg:border-b",
    noBottom: "lg:border-b-0",
  },
};

/**
 * The rules one cell draws at every breakpoint the grid names: a right rule
 * when a cell follows it in its row, a bottom rule when a cell sits below it.
 */
function cellRules(index: number, count: number, columns: GridColumns) {
  return BREAKPOINTS.flatMap((breakpoint) => {
    const perRow = columns[breakpoint];
    if (perRow === undefined) return [];
    const rules = RULE_CLASSES[breakpoint];
    const hasRight = index % perRow !== perRow - 1 && index + 1 < count;
    const hasBelow = index + perRow < count;
    return [
      hasRight ? rules.right : rules.noRight,
      hasBelow ? rules.bottom : rules.noBottom,
    ];
  });
}

type GridProps = {
  readonly columns: GridColumns;
  readonly children: ReactNode;
} & (
  | {
      /** Hairline rules between cells, never on the grid's outer edges. */
      readonly divided: true;
      readonly gap?: never;
    }
  | {
      readonly divided?: false;
      /** Space between cells. Cells that touch are what `divided` rules. */
      readonly gap?: GridGap;
    }
);

/**
 * Equal-width columns, responsive by breakpoint.
 *
 * With `divided`, each cell draws only the rules it has a neighbour on, so the
 * outer edges stay bare whatever the column count and however the last row
 * falls short. Nothing relies on clipping a rule pushed outside the grid: a
 * clipped rule still shows when the grid's edge lands on a half pixel. An edge
 * the surroundings need — a band's bottom border, a card's top rule — belongs
 * to the element around the grid.
 *
 * Takes no `className`: the grid's look is its columns, its gap and its rules.
 * Margin around the grid belongs to its parent, or to a wrapper.
 */
export function Grid({ columns, divided = false, gap, children }: GridProps) {
  const cells = Children.toArray(children);
  const columnClasses = BREAKPOINTS.flatMap((breakpoint) => {
    const perRow = columns[breakpoint];
    return perRow === undefined ? [] : [COLUMN_CLASSES[breakpoint][perRow]];
  });

  return (
    <div className={cn("grid", columnClasses, gap && GAP_CLASSES[gap])}>
      {divided
        ? cells.map((cell, index) => (
            <div
              // Children.toArray has already given each element a unique key.
              key={isValidElement(cell) ? cell.key : index}
              className={cn(
                "border-divide",
                cellRules(index, cells.length, columns),
              )}
            >
              {cell}
            </div>
          ))
        : cells}
    </div>
  );
}

export default Grid;
