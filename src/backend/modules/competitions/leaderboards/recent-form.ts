// src/backend/modules/competitions/leaderboards/recent-form.ts

/** One game's outcome for one team. */
export const FormResult = { WIN: "W", LOSS: "L", FORFEIT: "F" } as const;
export type FormResult = (typeof FormResult)[keyof typeof FormResult];

/** How many games a team's form covers. */
export const FORM_LENGTH = 5;

/** The fields of a completed match that decide each side's result. */
export interface FormMatch {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  forfeit: boolean;
}

/** One game of a team's form: the match, and how it went for that team. */
export interface FormGame {
  matchId: number;
  result: FormResult;
}

/**
 * Each team's last {@link FORM_LENGTH} games, oldest first, so the list reads
 * left to right as the season went.
 *
 * A match without both scores decides nothing and is skipped; basketball has
 * no draws, so every scored match is a win for one side and, for the other, a
 * loss, or a forfeit when that side forfeited it.
 *
 * @param matches - completed matches, newest first
 * @returns games by team id; a team with no scored match is absent
 */
export function buildRecentForm(
  matches: readonly FormMatch[],
): Map<number, FormGame[]> {
  const formByTeam = new Map<number, FormGame[]>();

  // Matches arrive newest first, so each older game goes in front.
  const record = (teamId: number, game: FormGame) => {
    const games = formByTeam.get(teamId) ?? [];
    if (games.length < FORM_LENGTH) games.unshift(game);
    formByTeam.set(teamId, games);
  };

  for (const match of matches) {
    if (match.homeTeamScore === null || match.awayTeamScore === null) continue;
    const homeWon = match.homeTeamScore > match.awayTeamScore;
    const lost = match.forfeit ? FormResult.FORFEIT : FormResult.LOSS;
    record(match.homeTeamId, {
      matchId: match.id,
      result: homeWon ? FormResult.WIN : lost,
    });
    record(match.awayTeamId, {
      matchId: match.id,
      result: homeWon ? lost : FormResult.WIN,
    });
  }

  return formByTeam;
}
