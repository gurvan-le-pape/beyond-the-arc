// src/backend/common/utils/standings.util.ts
import { assignRankByCount } from "./ranking.util";

/** Competition points for a win, a loss and a forfeit. */
const POINTS = { WIN: 2, LOSS: 1, FORFEIT: 0 } as const;

/**
 * The fields of a match that decide the standings. Select these on completed
 * matches only: a match in any other status has no result to count.
 */
export const STANDING_MATCH_SELECT = {
  homeTeamId: true,
  awayTeamId: true,
  homeTeamScore: true,
  awayTeamScore: true,
  forfeit: true,
} as const;

/** A match as {@link computeStandings} reads it. */
export interface StandingMatch {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  forfeit: boolean;
}

/** One team's season record in its pool. */
export interface Standing {
  teamId: number;
  points: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesForfeited: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifference: number;
}

function emptyStanding(teamId: number): Standing {
  return {
    teamId,
    points: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesForfeited: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    pointDifference: 0,
  };
}

/**
 * Adds one team's side of a result. A win is 2 points and a loss 1. In a
 * forfeited match the team that lost is the one that forfeited, for 0 points.
 */
function addResult(
  standing: Standing,
  scored: number,
  conceded: number,
  forfeit: boolean,
): void {
  standing.gamesPlayed += 1;
  standing.pointsFor += scored;
  standing.pointsAgainst += conceded;
  standing.pointDifference += scored - conceded;

  if (scored > conceded) {
    standing.gamesWon += 1;
    standing.points += POINTS.WIN;
  } else if (forfeit) {
    standing.gamesForfeited += 1;
    standing.points += POINTS.FORFEIT;
  } else {
    standing.gamesLost += 1;
    standing.points += POINTS.LOSS;
  }
}

/**
 * A pool's standings, best first: by points, then point difference, then team
 * id so that the order of tied teams is stable. Tied teams share a rank.
 *
 * Every team gets a row, played or not. A match is ignored when it has no
 * score, and a side is ignored when its team is not in `teamIds`.
 *
 * @param teamIds - the pool's teams
 * @param matches - the pool's completed matches
 * @returns one ranked row per team
 */
export function computeStandings(
  teamIds: readonly number[],
  matches: readonly StandingMatch[],
): (Standing & { rank: number })[] {
  const byTeam = new Map(teamIds.map((id) => [id, emptyStanding(id)]));

  for (const match of matches) {
    const { homeTeamScore: home, awayTeamScore: away, forfeit } = match;
    if (home === null || away === null) continue;

    const homeStanding = byTeam.get(match.homeTeamId);
    if (homeStanding) addResult(homeStanding, home, away, forfeit);
    const awayStanding = byTeam.get(match.awayTeamId);
    if (awayStanding) addResult(awayStanding, away, home, forfeit);
  }

  const ordered = [...byTeam.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.pointDifference - a.pointDifference ||
      a.teamId - b.teamId,
  );
  return assignRankByCount(ordered);
}
