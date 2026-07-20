// src/backend/modules/teams/aggregate-team-season-stats.spec.ts
import { aggregateTeamSeasonStats } from "./aggregate-team-season-stats";
import type { TeamMatchHistoryDto } from "./dto/teams.response.dto";

/**
 * Builds a match-history entry with the given per-team player rows. Only the
 * fields the aggregation reads (player.teamId, player.id, and the counting
 * stats) need to be realistic.
 */
function makeMatch(
  players: { id: number; teamId: number; points: number; assists: number }[],
): TeamMatchHistoryDto {
  return {
    id: 1,
    date: new Date("2024-02-05"),
    homeTeam: { id: 1, number: 1, club: { id: 1, name: "Club A" } },
    awayTeam: { id: 2, number: 1, club: { id: 2, name: "Club B" } },
    homeTeamScore: 80,
    awayTeamScore: 70,
    players: players.map((p) => ({
      player: {
        id: p.id,
        name: `Player ${p.id}`,
        number: p.id,
        position: "PG",
        teamId: p.teamId,
      },
      stats: {
        points: p.points,
        fouls: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
        twoPointsIntMade: 0,
        twoPointsIntAttempted: 0,
        twoPointsExtMade: 0,
        twoPointsExtAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        assists: p.assists,
        turnovers: 0,
        rebounds: { total: 0, offensive: 0, defensive: 0 },
        steals: 0,
        blocks: 0,
        playtimeIntervals: [],
      },
    })),
  };
}

describe("aggregateTeamSeasonStats", () => {
  it("aggregates only the requested team's rows and counts distinct players", () => {
    const teamId = 100;
    const matches = [
      makeMatch([
        { id: 1, teamId: 100, points: 10, assists: 3 },
        { id: 2, teamId: 100, points: 8, assists: 2 },
        // Opponent rows must be ignored.
        { id: 99, teamId: 200, points: 20, assists: 5 },
      ]),
      makeMatch([
        { id: 1, teamId: 100, points: 12, assists: 1 }, // same player again
        { id: 3, teamId: 100, points: 6, assists: 4 },
        { id: 98, teamId: 200, points: 15, assists: 7 },
      ]),
    ];

    const result = aggregateTeamSeasonStats(teamId, matches);

    // Per-game divides by games played (2 matches), not appearances (4 rows).
    expect(result.gamesPlayed).toBe(2);
    expect(result.points).toBe(36); // 10 + 8 + 12 + 6
    expect(result.assists).toBe(10); // 3 + 2 + 1 + 4
    expect(result.pointsPerGame).toBe(18); // 36 / 2 games
    expect(result.assistsPerGame).toBe(5); // 10 / 2 games
    // 3 distinct players (1, 2, 3) — player 1 counted once.
    expect(result.players).toBe(3);
  });

  it("returns zeroed stats and no players for a team with no appearances", () => {
    const result = aggregateTeamSeasonStats(100, [
      makeMatch([{ id: 99, teamId: 200, points: 20, assists: 5 }]),
    ]);

    expect(result.gamesPlayed).toBe(0);
    expect(result.points).toBe(0);
    expect(result.pointsPerGame).toBe(0);
    expect(result.players).toBe(0);
  });
});
