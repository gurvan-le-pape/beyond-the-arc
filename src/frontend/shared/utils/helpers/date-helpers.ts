// src/frontend/shared/utils/helpers/date-helpers.ts

/**
 * The competition's own time zone. Every match instant is stored in UTC and
 * displayed as French wall-clock time, regardless of where the viewer is.
 */
const COMPETITION_TIME_ZONE = "Europe/Paris";

/**
 * Numeric date parts. The *order* is left to the locale — that is the whole
 * point: `05/08/2026` reads as 8 May to an English reader and 5 August to a
 * French one, so a fixed `dd/MM/yyyy` silently shows English visitors the
 * wrong date.
 */
const DATE_PARTS = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
} as const;

/** Hour and minute; the locale decides 12- vs 24-hour. */
const TIME_PARTS = {
  hour: "2-digit",
  minute: "2-digit",
} as const;

function toDate(date: Date | string): Date {
  return typeof date === "string" ? new Date(date) : date;
}

/**
 * `Intl.DateTimeFormat` resolves the zone and the locale in one pass, so no
 * conversion is chained ahead of the format and no `Date` is produced that
 * lies about its own zone.
 */
function formatIn(
  date: Date | string,
  locale: string,
  parts: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, {
    ...parts,
    timeZone: COMPETITION_TIME_ZONE,
  }).format(toDate(date));
}

/**
 * Date and time of a match, in the competition's zone and the viewer's locale.
 *
 * @param date - Match instant (ISO string in UTC)
 * @param locale - Active locale, from `useLocale()` or the route's `params`
 */
export function formatMatchDateTime(
  date: Date | string,
  locale: string,
): string {
  return formatIn(date, locale, { ...DATE_PARTS, ...TIME_PARTS });
}

/** Just the date, in the competition's zone and the viewer's locale. */
export function formatMatchDate(date: Date | string, locale: string): string {
  return formatIn(date, locale, DATE_PARTS);
}

/** Just the time, in the competition's zone and the viewer's locale. */
export function formatMatchTime(date: Date | string, locale: string): string {
  return formatIn(date, locale, TIME_PARTS);
}
