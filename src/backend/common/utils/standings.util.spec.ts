// src/backend/common/utils/standings.util.spec.ts
import { computeStandings, type StandingMatch } from "./standings.util";

const HOME = 1;
const AWAY = 2;

const match = (
  homeTeamId: number,
  awayTeamId: number,
  homeTeamScore: number | null,
  awayTeamScore: number | null,
  forfeit = false,
): StandingMatch => ({
  homeTeamId,
  awayTeamId,
  homeTeamScore,
  awayTeamScore,
  forfeit,
});

const standing = (matches: StandingMatch[], teamId: number) =>
  computeStandings([HOME, AWAY], matches).find((row) => row.teamId === teamId);

const ZERO = {
  points: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  gamesForfeited: 0,
  pointsFor: 0,
  pointsAgainst: 0,
  pointDifference: 0,
};
const WINNER = {
  points: 2,
  gamesPlayed: 1,
  gamesWon: 1,
  gamesLost: 0,
  gamesForfeited: 0,
  pointsFor: 80,
  pointsAgainst: 70,
  pointDifference: 10,
};
const LOSER = {
  points: 1,
  gamesPlayed: 1,
  gamesWon: 0,
  gamesLost: 1,
  gamesForfeited: 0,
  pointsFor: 70,
  pointsAgainst: 80,
  pointDifference: -10,
};
const FORFEIT_WINNER = {
  points: 2,
  gamesPlayed: 1,
  gamesWon: 1,
  gamesLost: 0,
  gamesForfeited: 0,
  pointsFor: 20,
  pointsAgainst: 0,
  pointDifference: 20,
};
const FORFEITER = {
  points: 0,
  gamesPlayed: 1,
  gamesWon: 0,
  gamesLost: 0,
  gamesForfeited: 1,
  pointsFor: 0,
  pointsAgainst: 20,
  pointDifference: -20,
};

describe("computeStandings", () => {
  it("gives every team a row before any match is played", () => {
    expect(computeStandings([HOME, AWAY], [])).toEqual([
      { teamId: HOME, rank: 1, ...ZERO },
      { teamId: AWAY, rank: 1, ...ZERO },
    ]);
  });

  it("returns nothing for a pool with no teams", () => {
    expect(computeStandings([], [])).toEqual([]);
  });

  it("gives the winner 2 points and the loser 1 when the home team wins", () => {
    const matches = [match(HOME, AWAY, 80, 70)];

    expect(standing(matches, HOME)).toMatchObject(WINNER);
    expect(standing(matches, AWAY)).toMatchObject(LOSER);
  });

  it("gives the winner 2 points and the loser 1 when the away team wins", () => {
    const matches = [match(AWAY, HOME, 70, 80)];

    expect(standing(matches, HOME)).toMatchObject(WINNER);
    expect(standing(matches, AWAY)).toMatchObject(LOSER);
  });

  it("gives a forfeiting home team 0 points and the away team the win", () => {
    const matches = [match(HOME, AWAY, 0, 20, true)];

    expect(standing(matches, HOME)).toMatchObject(FORFEITER);
    expect(standing(matches, AWAY)).toMatchObject(FORFEIT_WINNER);
  });

  it("gives a forfeiting away team 0 points and the home team the win", () => {
    const matches = [match(HOME, AWAY, 20, 0, true)];

    expect(standing(matches, HOME)).toMatchObject(FORFEIT_WINNER);
    expect(standing(matches, AWAY)).toMatchObject(FORFEITER);
  });

  it("adds up results across matches", () => {
    const matches = [match(HOME, AWAY, 80, 70), match(AWAY, HOME, 90, 60)];

    expect(standing(matches, HOME)).toMatchObject({
      points: 3,
      gamesPlayed: 2,
      gamesWon: 1,
      gamesLost: 1,
      gamesForfeited: 0,
      pointsFor: 140,
      pointsAgainst: 160,
      pointDifference: -20,
    });
  });

  it("ignores a match with no score", () => {
    const matches = [match(HOME, AWAY, null, null)];

    expect(standing(matches, HOME)).toMatchObject(ZERO);
    expect(standing(matches, AWAY)).toMatchObject(ZERO);
  });

  it("counts only the side of a team in the pool", () => {
    const rows = computeStandings([HOME], [match(HOME, 99, 80, 70)]);

    expect(rows).toEqual([{ teamId: HOME, rank: 1, ...WINNER }]);
  });

  it("orders by points, then point difference, then team id", () => {
    const rows = computeStandings(
      [1, 2, 3, 4],
      [match(1, 2, 80, 70), match(3, 4, 90, 60), match(3, 1, 50, 60)],
    );

    // 1: 4 points, +20. 3: 3 points, +20. 2 and 4: 1 point, -10 and -30.
    expect(rows.map((row) => row.teamId)).toEqual([1, 3, 2, 4]);
  });

  it("gives tied teams the same rank and skips the next one", () => {
    const rows = computeStandings(
      [1, 2, 3, 4],
      [match(2, 3, 80, 70), match(1, 4, 80, 70)],
    );

    expect(rows.map(({ teamId, rank }) => ({ teamId, rank }))).toEqual([
      { teamId: 1, rank: 1 },
      { teamId: 2, rank: 1 },
      { teamId: 3, rank: 3 },
      { teamId: 4, rank: 3 },
    ]);
  });
});
