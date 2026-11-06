// src/backend/test/integration/leaderboard-triggers.integration.spec.ts
import type { Client } from "pg";

import {
  completeMatch,
  connect,
  createPool,
  insertScheduledMatch,
  type PoolFixture,
} from "./harness";

const ZERO = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  gamesForfeited: 0,
  pointsFor: 0,
  pointsAgainst: 0,
  pointDifference: 0,
  points: 0,
};

describe("leaderboard triggers", () => {
  let client: Client;
  let pool: PoolFixture;
  let home: number;
  let away: number;

  const standing = async (teamId: number) => {
    const { rows } = await client.query(
      `SELECT games_played AS "gamesPlayed", games_won AS "gamesWon",
              games_lost AS "gamesLost", games_forfeited AS "gamesForfeited",
              points_for AS "pointsFor", points_against AS "pointsAgainst",
              point_difference AS "pointDifference", points
         FROM leaderboards WHERE pool_id = $1 AND team_id = $2`,
      [pool.poolId, teamId],
    );
    return rows[0] as typeof ZERO | undefined;
  };

  const homeWin = {
    gamesPlayed: 1,
    gamesWon: 1,
    gamesLost: 0,
    gamesForfeited: 0,
    pointsFor: 80,
    pointsAgainst: 70,
    pointDifference: 10,
    points: 2,
  };
  const awayLoss = {
    gamesPlayed: 1,
    gamesWon: 0,
    gamesLost: 1,
    gamesForfeited: 0,
    pointsFor: 70,
    pointsAgainst: 80,
    pointDifference: -10,
    points: 1,
  };

  beforeAll(async () => {
    client = await connect();
  });

  afterAll(async () => {
    await client.end();
  });

  beforeEach(async () => {
    await client.query("BEGIN");
    pool = await createPool(client);
    [home, away] = pool.teamIds;
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
  });

  describe("team assignment", () => {
    it("gives a team a zeroed row when it joins a pool", async () => {
      expect(await standing(home)).toEqual(ZERO);
    });

    it("keeps the row's results when the assignment is written again", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 80, 70);

      await client.query("UPDATE teams SET pool_id = $1 WHERE id = $2", [
        pool.poolId,
        home,
      ]);

      expect(await standing(home)).toEqual(homeWin);
    });
  });

  describe("recording a result", () => {
    it("counts nothing for a scheduled, generating or failed match", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);

      for (const status of ["generating", "failed", "scheduled"]) {
        await client.query("UPDATE matches SET status = $1 WHERE id = $2", [
          status,
          match,
        ]);
        expect(await standing(home)).toEqual(ZERO);
        expect(await standing(away)).toEqual(ZERO);
      }
    });

    it("gives the winner 2 points and the loser 1 when the home team wins", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);

      await completeMatch(client, match, 80, 70);

      expect(await standing(home)).toEqual(homeWin);
      expect(await standing(away)).toEqual(awayLoss);
    });

    it("gives the winner 2 points and the loser 1 when the away team wins", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, away, home);

      await completeMatch(client, match, 70, 80);

      expect(await standing(home)).toEqual(homeWin);
      expect(await standing(away)).toEqual(awayLoss);
    });

    it("gives a forfeiting home team 0 points and the away team the win", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);

      await completeMatch(client, match, 0, 20, true);

      expect(await standing(home)).toEqual({
        gamesPlayed: 1,
        gamesWon: 0,
        gamesLost: 0,
        gamesForfeited: 1,
        pointsFor: 0,
        pointsAgainst: 20,
        pointDifference: -20,
        points: 0,
      });
      expect(await standing(away)).toEqual({
        gamesPlayed: 1,
        gamesWon: 1,
        gamesLost: 0,
        gamesForfeited: 0,
        pointsFor: 20,
        pointsAgainst: 0,
        pointDifference: 20,
        points: 2,
      });
    });

    it("adds up results across matches", async () => {
      const first = await insertScheduledMatch(client, pool.poolId, home, away);
      const second = await insertScheduledMatch(
        client,
        pool.poolId,
        away,
        home,
      );

      await completeMatch(client, first, 80, 70);
      await completeMatch(client, second, 90, 60);

      expect(await standing(home)).toEqual({
        gamesPlayed: 2,
        gamesWon: 1,
        gamesLost: 1,
        gamesForfeited: 0,
        pointsFor: 140,
        pointsAgainst: 160,
        pointDifference: -20,
        points: 3,
      });
    });

    it("does not count a result twice when a completed match is written again", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 80, 70);

      await client.query("UPDATE matches SET matchday = 2 WHERE id = $1", [
        match,
      ]);

      expect(await standing(home)).toEqual(homeWin);
    });

    it("creates the row of a team placed in the pool without an assignment update", async () => {
      const {
        rows: [{ id: other }],
      } = await client.query<{ id: number }>(
        `INSERT INTO teams (club_id, season_year, number, category, gender, pool_id)
         VALUES ($1, '2099-2100', 9000, 'U18', 'male', $2) RETURNING id`,
        [pool.clubIds[0], pool.poolId],
      );
      expect(await standing(other)).toBeUndefined();

      const match = await insertScheduledMatch(
        client,
        pool.poolId,
        other,
        away,
      );
      await completeMatch(client, match, 80, 70);

      expect(await standing(other)).toEqual(homeWin);
    });

    it("counts a match inserted with its result", async () => {
      await client.query(
        `INSERT INTO matches (pool_id, matchday, starts_at, home_team_id, away_team_id,
                              home_team_score, away_team_score, status)
         VALUES ($1, 1, now(), $2, $3, 80, 70, 'completed')`,
        [pool.poolId, home, away],
      );

      expect(await standing(home)).toEqual(homeWin);
      expect(await standing(away)).toEqual(awayLoss);
    });
  });

  describe("removing a match", () => {
    it("takes back the result of a completed match", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 80, 70);

      await client.query("DELETE FROM matches WHERE id = $1", [match]);

      expect(await standing(home)).toEqual(ZERO);
      expect(await standing(away)).toEqual(ZERO);
    });

    it("takes back a forfeit", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 0, 20, true);

      await client.query("DELETE FROM matches WHERE id = $1", [match]);

      expect(await standing(home)).toEqual(ZERO);
      expect(await standing(away)).toEqual(ZERO);
    });

    it("changes nothing when the match had no result", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);

      await client.query("DELETE FROM matches WHERE id = $1", [match]);

      expect(await standing(home)).toEqual(ZERO);
    });

    it("allows deleting a pool with completed matches", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 80, 70);

      await client.query("DELETE FROM pools WHERE id = $1", [pool.poolId]);

      expect(await standing(home)).toBeUndefined();
    });
  });

  describe("changing a recorded result", () => {
    it("applies a corrected score", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 80, 70);

      await client.query(
        "UPDATE matches SET home_team_score = 85, away_team_score = 90 WHERE id = $1",
        [match],
      );

      expect(await standing(home)).toEqual({
        gamesPlayed: 1,
        gamesWon: 0,
        gamesLost: 1,
        gamesForfeited: 0,
        pointsFor: 85,
        pointsAgainst: 90,
        pointDifference: -5,
        points: 1,
      });
    });

    it("takes back a forfeit the correction removes", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 0, 20, true);

      await client.query(
        "UPDATE matches SET home_team_score = 80, away_team_score = 70, forfeit = false WHERE id = $1",
        [match],
      );

      expect(await standing(home)).toEqual(homeWin);
      expect(await standing(away)).toEqual(awayLoss);
    });

    it("moves the result when the match changes pool", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 80, 70);
      const other = await createPool(client, { division: 2 });

      await client.query("UPDATE matches SET pool_id = $1 WHERE id = $2", [
        other.poolId,
        match,
      ]);

      expect(await standing(home)).toEqual(ZERO);
      const moved = await client.query(
        "SELECT points FROM leaderboards WHERE pool_id = $1 AND team_id = $2",
        [other.poolId, home],
      );
      expect(moved.rows).toEqual([{ points: 2 }]);
    });

    it("takes back the result of a match reset to scheduled", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 80, 70);

      await client.query(
        `UPDATE matches
            SET home_team_score = NULL, away_team_score = NULL, status = 'scheduled'
          WHERE id = $1`,
        [match],
      );

      expect(await standing(home)).toEqual(ZERO);
      expect(await standing(away)).toEqual(ZERO);
    });

    it("allows deleting a match whose score was corrected", async () => {
      const match = await insertScheduledMatch(client, pool.poolId, home, away);
      await completeMatch(client, match, 80, 70);
      await client.query(
        "UPDATE matches SET home_team_score = 85, away_team_score = 90 WHERE id = $1",
        [match],
      );

      await client.query("DELETE FROM matches WHERE id = $1", [match]);

      expect(await standing(home)).toEqual(ZERO);
    });
  });

  describe("constraints", () => {
    let match: number;

    beforeEach(async () => {
      match = await insertScheduledMatch(client, pool.poolId, home, away);
    });

    it.each([
      ["an unknown status", "status = 'done'", "matches_status_check"],
      [
        "one score alone",
        "home_team_score = 80, status = 'completed'",
        "matches_scores_paired",
      ],
      [
        "a result on a match that is not completed",
        "home_team_score = 80, away_team_score = 70",
        "matches_result_iff_completed",
      ],
      [
        "a completed match with no result",
        "status = 'completed'",
        "matches_result_iff_completed",
      ],
      [
        "a negative score",
        "home_team_score = -1, away_team_score = 70, status = 'completed'",
        "matches_scores_non_negative",
      ],
      [
        "a draw",
        "home_team_score = 70, away_team_score = 70, status = 'completed'",
        "no_draws_allowed",
      ],
      [
        "a forfeit with no result",
        "forfeit = true",
        "matches_flags_need_result",
      ],
      [
        "overtime with no result",
        "overtime = true",
        "matches_flags_need_result",
      ],
    ])("rejects %s on a match", async (_name, assignment, constraint) => {
      await expect(
        client.query(`UPDATE matches SET ${assignment} WHERE id = $1`, [match]),
      ).rejects.toThrow(constraint);
    });

    it("rejects a team playing itself", async () => {
      await expect(
        insertScheduledMatch(client, pool.poolId, home, home),
      ).rejects.toThrow("matches_distinct_teams");
    });

    it.each([
      [
        "a negative counter",
        "points = -1",
        "leaderboards_counters_non_negative",
      ],
      [
        "games that do not add up",
        "games_played = 1",
        "leaderboards_games_add_up",
      ],
      [
        "a wrong point difference",
        "point_difference = 5",
        "leaderboards_difference_matches",
      ],
    ])("rejects %s on a standing", async (_name, assignment, constraint) => {
      await expect(
        client.query(
          `UPDATE leaderboards SET ${assignment} WHERE pool_id = $1`,
          [pool.poolId],
        ),
      ).rejects.toThrow(constraint);
    });
  });
});
