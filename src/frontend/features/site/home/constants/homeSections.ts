// src/frontend/features/site/home/constants/homeSections.ts

/**
 * The home page's four bands, as the part of each that is neither translated
 * nor fetched.
 *
 * Every entry here names a key twice over: `statKey` indexes the stats payload
 * the page fetches, and the message key is derived from it. Where the two
 * diverge — the map band labels `committees` as "departments" and `leagues` as
 * "regions", the geographic framing rather than the organisational one — the
 * label key is stated separately rather than derived.
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
 * The competition levels, in display order — national first, then narrowing.
 * `dot` is a complete literal class so Tailwind can see it.
 */
export const LEVEL_ROWS = [
  { level: "national", dot: "bg-solid-national" },
  { level: "regional", dot: "bg-solid-regional" },
  { level: "departmental", dot: "bg-solid-departmental" },
] as const;

/** The map band's three figures. Label keys diverge from the stat keys here. */
export const MAP_STATS = [
  { statKey: "clubs", labelKey: "clubs" },
  { statKey: "committees", labelKey: "departments" },
  { statKey: "leagues", labelKey: "regions" },
] as const;
