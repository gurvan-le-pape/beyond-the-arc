// src/backend/test/integration/match-constraints.integration.spec.ts
import type { Client } from "pg";

import {
  connect,
  createPool,
  insertScheduledMatch,
  type PoolFixture,
} from "./harness";

describe("match constraints", () => {
  let client: Client;
  let pool: PoolFixture;
  let home: number;
  let away: number;
  let match: number;

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
    match = await insertScheduledMatch(client, home, away);
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
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
    ["a forfeit with no result", "forfeit = true", "matches_flags_need_result"],
    ["overtime with no result", "overtime = true", "matches_flags_need_result"],
  ])("rejects %s on a match", async (_name, assignment, constraint) => {
    await expect(
      client.query(`UPDATE matches SET ${assignment} WHERE id = $1`, [match]),
    ).rejects.toThrow(constraint);
  });

  it("rejects a team playing itself", async () => {
    await expect(insertScheduledMatch(client, home, home)).rejects.toThrow(
      "matches_distinct_teams",
    );
  });
});
