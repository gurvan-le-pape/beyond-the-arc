// src/frontend/shared/components/table/variants.ts
import { cva } from "class-variance-authority";

/**
 * Table presentation, as typed variants rather than class strings passed in
 * from call sites — the pattern the rest of the design system already uses
 * (see primitives/Button.tsx, primitives/Card.tsx).
 *
 * Private to the table module: nothing here is exported from the barrel.
 */

// ---------------------------------------------------------------------------
// Blocks shared by `th` and `td`
//
// Written once so a column's header and its body cells can never disagree —
// which is exactly what went wrong while column styling was a `className` that
// only reached the body.
// ---------------------------------------------------------------------------

const align = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const density = {
  comfortable: "px-6 py-4",
  compact: "px-1 py-1",
} as const;

/**
 * Kept separate from `density` so a table can be dense without being forced
 * onto one line, or roomy and still nowrap. The old `size="compact"` was the
 * pair of them.
 */
const wrap = {
  true: "",
  false: "overflow-hidden whitespace-nowrap",
} as const;

const width = {
  auto: "",
  icon: "w-8",
} as const;

/** Vertical rule fencing off a group of columns, e.g. the shooting splits. */
const divider = {
  none: "",
  left: "border-l border-divide",
  right: "border-r border-divide",
  both: "border-x border-divide",
} as const;

// ---------------------------------------------------------------------------
// Elements
// ---------------------------------------------------------------------------

/**
 * The table's outer treatment. `outline` is for a table that stands on its
 * own; a table inside a Section uses `none`, because the Section is already a
 * bordered Card and a second border inside it reads as a boxed-in box.
 */
export const tableVariants = cva("min-w-full", {
  variants: {
    frame: {
      none: "",
      outline: "border border-divide rounded-button",
    },
  },
  defaultVariants: { frame: "none" },
});

/**
 * One header treatment for every table — no variants, hence no cva.
 *
 * No fill. The header used to be a `bg-primary-subtle` band under a
 * `border-primary` rule, which in the light theme put `text-text-emphasis`
 * (#374151) on #6d86c0 — 2.86:1, below the 4.5:1 AA needs for body text and
 * below even the 3:1 large-text floor. A band is also a third weight of
 * horizontal division on a table whose rows are already separated by a rule.
 *
 * The header now separates itself typographically (see TABLE_HEAD_TEXT) over a
 * single hairline, the same one the rows use.
 */
export const TABLE_HEADER = "border-b border-divide";

/**
 * Column labels: the shared `overline` token — xs, semibold, uppercase,
 * tracking-widest — recoloured.
 *
 * `overline` ships `text-text-secondary`, and #6b7280 on surface-subtle
 * (#f3f4f6) is 4.39:1, which still misses AA for 12px semibold text (not large
 * text: that needs 18.66px bold or 24px). `text-text-body` is 6.87:1 in light
 * and 12.0:1 in dark, and still sits recessive against the cells'
 * `text-text-emphasis`, which is the hierarchy we want — labels quieter than
 * the data they name.
 *
 * Applied on the `Text` element itself, not the `<th>`: `Text` puts its own
 * colour on the inner span, so a colour on the `<th>` is inherited and loses.
 * `cn` is tailwind-merge, so the later class wins.
 */
export const TABLE_HEAD_TEXT = "text-text-body";

/**
 * Rows carry no banding. Separation is the `divide-y` on `TableBody` — one
 * mechanism, not three.
 *
 * There was a `stripe` axis here (`even: bg-primary-ghost`, `odd:
 * bg-surface-inset`) that three of the four tables opted into. It was doing
 * almost nothing: `bg-surface-inset` reads `--surface-inset` from the nearest
 * surface ancestor, which was `TableBody`'s own `surface-raised`, and that
 * publishes `--surface-inset: --color-surface-raised` — the body colour. So
 * odd rows matched the body and only the even rows tinted, in a blue that
 * belongs to the brand ramp rather than to the neutral one.
 *
 * Note the absence of a border here too. A `border-b` on the row *and* the
 * `divide-y` on the body stacked two 1px rules between every pair of rows —
 * `divide-y` puts a border-top on rows 2..n — and left an orphan rule under
 * the last row, hanging in the card's padding with nothing beneath it.
 */
export const rowVariants = cva("transition-colors duration-150", {
  variants: {
    /**
     * A row that navigates. `relative` is the containing block for the
     * stretched row link; hover is here rather than on its own axis because
     * hover feedback exists to signal interactivity, so the two must not be
     * able to drift apart.
     */
    interactive: { true: "relative hover:bg-surface-inset", false: "" },
  },
  defaultVariants: { interactive: false },
});

/**
 * Stretched row link. `<a>` cannot wrap `<tr>`, so the lead cell's content
 * becomes the anchor and its ::after covers the whole row — one tab stop per
 * row, a focus ring around the entire row, and real link behaviour: Enter,
 * middle-click, open-in-new-tab and a status-bar URL.
 *
 * Do not combine with `wrap={false}`: the cells' `overflow-hidden` would clip
 * the overlay back to the lead cell.
 */
export const ROW_LINK =
  "outline-none after:absolute after:inset-0 after:content-['']" +
  " focus-visible:after:ring-2 focus-visible:after:ring-inset" +
  " focus-visible:after:ring-primary";

export const headVariants = cva("", {
  variants: { align, density, wrap, width, divider },
  defaultVariants: {
    align: "left",
    density: "comfortable",
    wrap: true,
    width: "auto",
    divider: "none",
  },
});

export const headInnerVariants = cva("flex items-center gap-2", {
  variants: {
    align: {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    },
  },
  defaultVariants: { align: "left" },
});

export const cellVariants = cva("text-sm text-text-emphasis", {
  variants: {
    align,
    density,
    wrap,
    width,
    divider,
    /** The one column a table is *about* — a rank, a total. */
    emphasis: { true: "font-bold text-text-heading", false: "" },
  },
  defaultVariants: {
    align: "left",
    density: "comfortable",
    wrap: true,
    width: "auto",
    divider: "none",
    emphasis: false,
  },
});
