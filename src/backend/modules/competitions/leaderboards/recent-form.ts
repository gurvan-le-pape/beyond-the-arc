// src/backend/modules/competitions/leaderboards/recent-form.ts

/** One game's outcome for one team. */
export const FormResult = { WIN: "W", LOSS: "L" } as const;
export type FormResult = (typeof FormResult)[keyof typeof FormResult];

/** How many games a team's form covers. */
export const FORM_LENGTH = 5;

/** The fields of a completed match that decide each side's result. */
export interface FormMatch {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
}

/**
 * Each team's last {@link FORM_LENGTH} results, oldest first, so the list
 * reads left to right as the season went.
 *
 * A match without both scores decides nothing and is skipped; basketball has
 * no draws, so every scored match is a win for one side and a loss for the
 * other.
 *
 * @param matches - completed matches, newest first
 * @returns results by team id; a team with no scored match is absent
 */
export function buildRecentForm(
  matches: readonly FormMatch[],
): Map<number, FormResult[]> {
  const newestFirst = new Map<number, FormResult[]>();

  const record = (teamId: number, result: FormResult) => {
    const results = newestFirst.get(teamId) ?? [];
    if (results.length < FORM_LENGTH) results.push(result);
    newestFirst.set(teamId, results);
  };

  for (const match of matches) {
    if (match.homeTeamScore === null || match.awayTeamScore === null) continue;
    const homeWon = match.homeTeamScore > match.awayTeamScore;
    record(match.homeTeamId, homeWon ? FormResult.WIN : FormResult.LOSS);
    record(match.awayTeamId, homeWon ? FormResult.LOSS : FormResult.WIN);
  }

  return new Map(
    [...newestFirst].map(([teamId, results]) => [teamId, results.reverse()]),
  );
}
