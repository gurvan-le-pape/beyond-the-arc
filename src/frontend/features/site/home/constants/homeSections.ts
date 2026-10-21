// src/frontend/features/site/home/constants/homeSections.ts

/**
 * The home page's four bands, as the part of each that is neither translated
 * nor fetched.
 *
 * A stats key both indexes the stats payload the page fetches and names its
 * `home.stats.*` label.
 */

/** Keys into the stats payload; also the `home.stats.*` label keys. */
export const STATS_BAND_KEYS = [
  "clubs",
  "teams",
  "players",
  "matches",
  "leagues",
  "committees",
] as const;

/** The three search entry points, in display order. */
export const EXPLORE_CARDS = [
  { key: "players", href: "/search?tab=players", badgeVariant: "players" },
  { key: "teams", href: "/search?tab=teams", badgeVariant: "teams" },
  { key: "matches", href: "/search?tab=matches", badgeVariant: "matches" },
] as const;

/**
 * The competition levels, national first, then narrowing — the display order
 * among covered levels; the page moves a level with no championships last.
 * `dot` is a complete literal class so Tailwind can see it.
 */
export const LEVEL_ROWS = [
  { level: "national", dot: "bg-solid-national" },
  { level: "regional", dot: "bg-solid-regional" },
  { level: "departmental", dot: "bg-solid-departmental" },
] as const;
