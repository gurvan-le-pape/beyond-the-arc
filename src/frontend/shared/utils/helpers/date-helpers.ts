// src/frontend/shared/utils/helpers/date-helpers.ts
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

/**
 * Formats date and time for match history tables
 * Converts UTC to Paris timezone for display
 *
 * @param date - Match date (ISO string in UTC)
 * @returns Formatted string like "30/12/2025 19:00" (Paris time)
 */
export function formatMatchDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Convert UTC to Paris timezone
  const parisDate = toZonedTime(dateObj, "Europe/Paris");

  // Format consistently
  return format(parisDate, "dd/MM/yyyy HH:mm");
}

/**
 * Formats just the date in Paris timezone
 */
export function formatMatchDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const parisDate = toZonedTime(dateObj, "Europe/Paris");
  return format(parisDate, "dd/MM/yyyy");
}

/**
 * Formats just the time in Paris timezone
 */
export function formatMatchTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const parisDate = toZonedTime(dateObj, "Europe/Paris");
  return format(parisDate, "HH:mm");
}
