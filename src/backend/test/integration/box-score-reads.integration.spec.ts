// src/backend/test/integration/box-score-reads.integration.spec.ts
import { MatchesService } from "@modules/matches/matches.service";
import { PlayersService } from "@modules/players/players.service";
import { TeamsService } from "@modules/teams/teams.service";
import type { Client } from "pg";
import { PrismaService } from "prisma/prisma.service";

import {
  completeMatch,
  connect,
  createPool,
  insertScheduledMatch,
  type PoolFixture,
} from "./harness";

/** A stored box-score line, as compute_box_score writes it. */
const line = (points: number, playtime: number[][] = [[0, 600]]) => ({
  points,
  fouls: 1,
  three_points_made: 0,
  three_points_attempted: 1,
  two_points_int_made: 1,
  two_points_int_attempted: 2,
  two_points_ext_made: 0,
  two_points_ext_attempted: 0,
  free_throws_made: 0,
  free_throws_attempted: 0,
  assists: 2,
  turnovers: 0,
  rebounds_offensive: 1,
  rebounds_defensive: 2,
  steals: 0,
  blocks: 0,
  playtime_intervals: playtime,
});

/**
 * The reads of `matches.box_score` through real Prisma: the match box score,
 * a team's season stats, and the player history's raw query, which picks one
 * player's line out of each box score.
 */
describe("box score reads", () => {
  let client: Client;
  let prisma: PrismaService;
  let pool: PoolFixture;
  let home: number;
  let away: number;
  let starter: number;
  let benched: number;
  let opponent: number;
  const matches: Record<string, number> = {};

  const insertPlayer = async (teamId: number, number: number) => {
    const { rows } = await client.query<{ id: number }>(
      `INSERT INTO players (name, number, position, height_cm, weight_kg, birthdate, team_id)
       VALUES ($1, $2, 'SF', 190, 85, '2008-01-01', $3) RETURNING id`,
      [`Fixture ${number}`, number, teamId],
    );
    return rows[0].id;
  };

  beforeAll(async () => {
    client = await connect();
    prisma = new PrismaService();
    await prisma.onModuleInit();

    pool = await createPool(client, { letter: "Z" });
    [home, away] = pool.teamIds;
    starter = await insertPlayer(home, 4);
    benched = await insertPlayer(home, 5);
    opponent = await insertPlayer(away, 6);

    matches.first = await insertScheduledMatch(
      client,
      home,
      away,
      "2099-01-01T12:00:00Z",
    );
    matches.second = await insertScheduledMatch(
      client,
      away,
      home,
      "2099-01-08T12:00:00Z",
    );
    matches.upcoming = await insertScheduledMatch(
      client,
      home,
      away,
      "2099-01-15T12:00:00Z",
    );
    await completeMatch(client, matches.first, 80, 70, false, {
      [starter]: line(12, [
        [0, 300],
        [600, 900],
      ]),
      [benched]: line(3),
      [opponent]: line(30),
    });
    // The benched player has no line in the second match.
    await completeMatch(client, matches.second, 65, 60, false, {
      [starter]: line(8),
      [opponent]: line(25),
    });
  });

  afterAll(async () => {
    await client.query("DELETE FROM matches WHERE home_team_id = ANY($1)", [
      pool.teamIds,
    ]);
    await client.query("DELETE FROM teams WHERE id = ANY($1)", [pool.teamIds]);
    await client.query("DELETE FROM championships WHERE id = $1", [
      pool.championshipId,
    ]);
    await prisma.onModuleDestroy();
    await client.end();
  });

  it("returns a player's matches with their line, newest first", async () => {
    const history = await new PlayersService(prisma).findPlayerMatchHistory(
      starter,
    );

    expect(history.matches.map((m) => [m.id, m.player.stats.points])).toEqual([
      [matches.second, 8],
      [matches.first, 12],
    ]);
    expect(history.matches[0]).toMatchObject({
      status: "completed",
      homeTeamScore: 65,
      awayTeamScore: 60,
      homeTeam: { id: away, club: { id: pool.clubIds[1] } },
      awayTeam: { id: home, club: { id: pool.clubIds[0] } },
    });
    expect(history.matches[1].player.stats.playtimeIntervals).toEqual([
      [0, 300],
      [600, 900],
    ]);
    expect(history.career.points).toBe(20);
  });

  it("leaves out the matches a player has no line in", async () => {
    const history = await new PlayersService(prisma).findPlayerMatchHistory(
      benched,
    );

    expect(history.matches.map((m) => m.id)).toEqual([matches.first]);
  });

  it("reads a match's box score with each line's player", async () => {
    const boxScore = await new MatchesService(
      prisma,
    ).findPlayerMatchStatsByMatchId(matches.first);

    expect(
      boxScore.stats.map((s) => [s.player.id, s.player.teamId, s.stats.points]),
    ).toEqual([
      [starter, home, 12],
      [benched, home, 3],
      [opponent, away, 30],
    ]);
    expect(boxScore.stats[0].stats.playtimeSeconds).toBe(600);
    expect(boxScore.homeTeamStats.assists).toBe(4);
  });

  it("reads no lines for a match not played yet", async () => {
    const boxScore = await new MatchesService(
      prisma,
    ).findPlayerMatchStatsByMatchId(matches.upcoming);

    expect(boxScore.stats).toEqual([]);
  });

  it("sums a team's lines into its players' and its season stats", async () => {
    const teams = new TeamsService(prisma);
    const detail = await teams.findTeamById(home);
    const history = await teams.findTeamMatchHistory(home);

    expect(
      detail.players.map((p) => [
        p.id,
        p.seasonStats.gamesPlayed,
        p.seasonStats.points,
      ]),
    ).toEqual([
      [starter, 2, 20],
      [benched, 1, 3],
    ]);
    expect(history.seasonStats).toMatchObject({
      gamesPlayed: 2,
      points: 23,
      players: 2,
    });
  });
});
