// src/frontend/shared/utils/clubMark.ts

// Words that name what a club is rather than which club it is. Skipping them
// is what turns "BASKET CLUB BARCELONNETTE" into "BA" instead of "BC".
const GENERIC_WORDS = new Set([
  "ASSOCIATION",
  "BASKET",
  "BASKETBALL",
  "BALL",
  "CLUB",
  "ENTENTE",
  "SPORT",
  "SPORTS",
  "SPORTIVE",
  "UNION",
  "AS",
  "BC",
  "CS",
  "ES",
  "US",
  "DE",
  "DES",
  "DU",
  "D",
  "LA",
  "LE",
  "LES",
  "L",
  "ET",
]);

/**
 * The two letters a club is drawn with: the initials of its first two
 * distinctive words, or the first two letters of its only one.
 *
 * @param clubName - the club's name as the API returns it
 * @returns two uppercase letters, or "?" for an empty name
 */
export function clubInitials(clubName: string): string {
  const words = clubName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);
  const distinctive = words.filter((word) => !GENERIC_WORDS.has(word));
  const pool = distinctive.length > 0 ? distinctive : words;

  if (pool.length === 0) return "?";
  if (pool.length === 1) return pool[0].slice(0, 2);
  return pool[0][0] + pool[1][0];
}

/**
 * A hue for the club, stable across pages and renders: derived from the name,
 * which every place that draws a club has, rather than the id, which some do
 * not.
 *
 * @param clubName - the club's name as the API returns it
 * @returns a hue in degrees, 0–359
 */
export function clubHue(clubName: string): number {
  let hash = 0;
  for (const char of clubName) {
    hash = (hash * 31 + char.codePointAt(0)!) % 360;
  }
  return hash;
}
