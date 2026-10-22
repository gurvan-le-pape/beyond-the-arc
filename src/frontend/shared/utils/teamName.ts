// src/frontend/shared/utils/teamName.ts

/**
 * A team's name, the one way the app writes it: its club's name and its
 * number within the club, as the federation does ("ASVEL BASKET - 2").
 *
 * Nothing in " - 2" lets a line break: the spaces are no-break spaces, and a
 * word joiner follows the dash, since a line may otherwise break after a
 * hyphen whatever comes next. A name that wraps keeps its number with the last
 * word of the club's name rather than leaving "- 2" or "2" alone on a line.
 *
 * The `#` prefix is a player's jersey number and is never used for a team.
 * A missing number leaves the club's name alone; a missing club leaves an
 * empty name, never a dangling " - 2".
 *
 * @param clubName - the club the team belongs to
 * @param number - the team's number within its club
 * @returns the team's display name
 */
export function formatTeamName(
  clubName: string | null | undefined,
  number: number | null | undefined,
): string {
  if (!clubName) return "";
  return number ? `${clubName}\u00a0-\u2060\u00a0${number}` : clubName;
}
