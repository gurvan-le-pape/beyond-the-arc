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

/**
 * Three steps, because two were not a scale: `comfortable` was `px-6 py-4` and
 * `compact` was `px-1 py-1` — 48px of horizontal padding per cell dropping
 * straight to 4px, with nothing in between. Wide tables had to choose between
 * overflowing on padding alone and being jammed against the column rules.
 *
 * `comfortable` is also narrower than it was. The 9-column player match history
 * overflowed on `px-6` well before its columns needed the room.
 */
const density = {
  comfortable: "px-4 py-3.5",
  cozy: "px-3 py-2.5",
  compact: "px-2 py-1.5",
} as const;

/**
 * Kept separate from `density` so a table can be dense without being forced
 * onto one line, or roomy and still nowrap.
 */
const wrap = {
  true: "",
  false: "overflow-hidden whitespace-nowrap",
} as const;

const width = {
  auto: "",
  icon: "w-8",
} as const;

/**
 * Lining figures for numeric columns.
 *
 * The UI stack's default font uses proportional digits, so `1` is narrower
 * than `0` and a column of numbers is ragged down its own axis — points
 * shifting a pixel or two per row. `tabular-nums` fixes every digit to the
 * same advance width, which is what makes a stat column read as a column.
 * The design system already relies on this in MatchScore, StatValue and
 * StatCell; the tables were the gap.
 */
const numeric = {
  true: "tabular-nums",
  false: "",
} as const;

/**
 * The lead column, pinned while the rest of the table scrolls sideways.
 *
 * `bg-surface-own` is load-bearing, not decoration: a sticky cell floats over
 * the scrolled content, so without an opaque background the columns passing
 * underneath show through it. It reads `--surface-bg` from the surface context
 * system, so the pinned column matches whatever container the table sits in.
 *
 * The right-hand rule is what tells you the column is floating rather than
 * simply first. It is a box-shadow, not a border, and that is not a style
 * choice: Tailwind's preflight sets `border-collapse: collapse`, under which
 * cell borders are painted by the table rather than by the cell, so a
 * `border-r` here stays put while the cell it belongs to travels — the sticky
 * column loses its edge the moment you scroll. A box-shadow paints with the
 * element in either collapse mode.
 */
const stickyLead = {
  true: "sticky left-0 z-raised bg-surface-own shadow-[1px_0_0_0_rgb(var(--color-divide))]",
  false: "",
} as const;

/** Vertical rule fencing off a group of columns, e.g. the shooting splits. */
const divider = {
  none: "",
  left: "border-l border-divide",
  right: "border-r border-divide",
  both: "border-x border-divide",
} as const;

/**
 * The width from which a column shows. `sm` drops it on phones, for a table
 * whose secondary columns would otherwise push it past the screen's width.
 */
const from = {
  all: "",
  sm: "hidden sm:table-cell",
} as const;

// ---------------------------------------------------------------------------
// Elements
// ---------------------------------------------------------------------------

/**
 * The table's outer treatment. `outline` is for a table that stands on its
 * own; a table inside a Section uses `none`, because the Section is already a
 * bordered Card and a second border inside it reads as a boxed-in box.
 *
 * Applied to the scroll container, not the `<table>`. Two reasons: the
 * container is what actually bounds the table once the content is wider than
 * the viewport, and its `overflow` clips the corners for free — a border
 * radius on a `<table>` does not clip the rows inside it, so a hovered or
 * filled last row squares the bottom corners straight off.
 *
 * `rounded-card` rather than `rounded-button`: 12px is the radius of the
 * `Card` this table sits beside, and the table is a card-scale block. 8px is
 * the button radius and was never the right token here.
 */
export const frameVariants = cva("", {
  variants: {
    frame: {
      none: "",
      outline: "border border-divide rounded-card",
    },
  },
  defaultVariants: { frame: "none" },
});

/**
 * One header treatment for every table — no variants, hence no cva.
 *
 * No fill. A `bg-primary-subtle` band under a `border-primary` rule puts
 * `text-text-emphasis` (#374151) on #6d86c0 in the light theme — 2.86:1, below
 * the 4.5:1 AA needs for body text and below even the 3:1 large-text floor. A
 * band is also a third weight of horizontal division on a table whose rows are
 * already separated by a rule.
 *
 * The header separates itself typographically instead — the shared `overline`
 * token, unmodified — over a single hairline, the same one the rows use.
 */
export const TABLE_HEADER = "border-b border-divide";

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
  "after:absolute after:inset-0 after:content-[''] focus-ring-overlay";

/**
 * A link occupying one cell, for the tables the stretched row link cannot
 * serve — `wrap={false}` clips the overlay and `stickyLead` mispositions it, so
 * the props type forbids `getRowHref` alongside either. Those tables still need
 * *some* real navigation, and a plain in-cell link is it.
 *
 * It navigates one cell rather than the whole row, which is a weaker target,
 * but it is a genuine link: keyboard-reachable, Enter, middle-click,
 * open-in-new-tab, status-bar URL. Prefer `getRowHref` when the table can take
 * it — the whole row is the better hit area.
 *
 * `focus-ring-inset` rather than `focus-ring`: cells are as tight as
 * `px-2 py-1.5` at `compact`, and an outline drawn outside the link would be
 * clipped by the cell's `overflow-hidden`.
 */
export const CELL_LINK =
  "rounded transition-colors duration-150 hover:text-ink-primary focus-ring-inset";

export const headVariants = cva("", {
  variants: { align, density, wrap, width, divider, numeric, stickyLead, from },
  defaultVariants: {
    align: "left",
    density: "comfortable",
    wrap: true,
    width: "auto",
    divider: "none",
    numeric: false,
    stickyLead: false,
    from: "all",
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
    numeric,
    stickyLead,
    from,
    /** The one column a table is *about* — a rank, a total. */
    emphasis: { true: "font-bold text-text-heading", false: "" },
  },
  defaultVariants: {
    align: "left",
    density: "comfortable",
    wrap: true,
    width: "auto",
    divider: "none",
    numeric: false,
    stickyLead: false,
    from: "all",
    emphasis: false,
  },
});
