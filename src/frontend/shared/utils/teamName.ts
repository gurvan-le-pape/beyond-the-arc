// src/frontend/shared/utils/teamName.ts

/**
 * A team's name, the one way the app writes it: its club's name and its
 * number within the club, as the federation does ("ASVEL BASKET - 2").
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
  return number ? `${clubName} - ${number}` : clubName;
}
