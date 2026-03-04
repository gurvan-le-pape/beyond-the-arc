// src/frontend/shared/utils/helpers/team-helpers.ts
import type { Category } from "@/shared/constants";
import { Gender } from "@/shared/constants";

/**
 * Groups teams by their gender category for organized display.
 *
 * @param teams - Array of teams to group
 * @returns Record mapping Gender enum values to arrays of teams
 *
 * @example
 * const teams = [
 *   { id: 1, gender: Gender.MALE, name: "Team A" },
 *   { id: 2, gender: Gender.FEMALE, name: "Team B" },
 * ];
 * const grouped = groupTeamsByGender(teams);
 * // { MALE: [...], FEMALE: [...] }
 */
export function groupTeamsByGender<T extends { gender: Gender }>(
  teams: T[],
): Record<Gender, T[]> {
  return teams.reduce((acc, team) => {
    const gender = team.gender;

    if (!acc[gender]) {
      acc[gender] = [];
    }

    acc[gender].push(team);
    return acc;
  }, {} as Record<Gender, T[]>);
}

/**
 * Sorts teams by category in ascending order (U15, U17, U19, Senior)
 *
 * @param teams - Array of teams to sort
 * @returns Sorted array of teams
 */
export function sortTeamsByCategory<T extends { category: Category }>(
  teams: T[],
): T[] {
  const categoryOrder: Record<string, number> = {
    U15: 1,
    U17: 2,
    U19: 3,
    Senior: 4,
  };

  return [...teams].sort((a, b) => {
    const orderA = categoryOrder[a.category] || 999;
    const orderB = categoryOrder[b.category] || 999;
    return orderA - orderB;
  });
}

/**
 * Filters teams by gender and/or category
 *
 * @param teams - Array of teams to filter
 * @param filters - Filter criteria
 * @returns Filtered array of teams
 */
export function filterTeams<T extends { gender: Gender; category: Category }>(
  teams: T[],
  filters: { gender?: Gender; category?: Category },
): T[] {
  return teams.filter((team) => {
    if (filters.gender && team.gender !== filters.gender) return false;
    if (filters.category && team.category !== filters.category) return false;
    return true;
  });
}

/**
 * Gets team color based on gender (for UI theming)
 *
 * @param gender - Team gender
 * @returns Tailwind color class
 */
export function getTeamColor(gender: Gender): string {
  switch (gender) {
    case Gender.MALE:
      return "text-team-male";
    case Gender.FEMALE:
      return "text-team-female";
    default:
      return "text-error";
  }
}

/**
 * Gets team background color based on gender (for UI theming)
 *
 * @param gender - Team gender
 * @returns Tailwind background color class
 */
export function getTeamBgColor(gender: Gender): string {
  switch (gender) {
    case Gender.MALE:
      return "bg-team-male/10 dark:bg-team-male/20";
    case Gender.FEMALE:
      return "bg-team-female/10 dark:bg-team-female/20";
    default:
      return "bg-error/10 dark:bg-error/20";
  }
}
