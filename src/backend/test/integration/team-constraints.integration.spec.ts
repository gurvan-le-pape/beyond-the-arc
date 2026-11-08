// src/backend/test/integration/team-constraints.integration.spec.ts
import type { Client } from "pg";

import { connect, createPool, type PoolFixture } from "./harness";

describe("team constraints", () => {
  let client: Client;
  let pool: PoolFixture;

  beforeAll(async () => {
    client = await connect();
  });

  afterAll(async () => {
    await client.end();
  });

  beforeEach(async () => {
    await client.query("BEGIN");
    pool = await createPool(client);
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
  });

  it("rejects a team without a pool", async () => {
    await expect(
      client.query("INSERT INTO teams (club_id, number) VALUES ($1, 1)", [
        pool.clubIds[0],
      ]),
    ).rejects.toThrow('null value in column "pool_id"');
  });

  it("rejects a club entering one pool twice under one number", async () => {
    const { rows } = await client.query<{ number: number }>(
      "SELECT number FROM teams WHERE id = $1",
      [pool.teamIds[0]],
    );
    await expect(
      client.query(
        "INSERT INTO teams (pool_id, club_id, number) VALUES ($1, $2, $3)",
        [pool.poolId, pool.clubIds[0], rows[0].number],
      ),
    ).rejects.toThrow("teams_pool_id_club_id_number_key");
  });

  it("refuses to delete a pool that has teams", async () => {
    await expect(
      client.query("DELETE FROM pools WHERE id = $1", [pool.poolId]),
    ).rejects.toThrow("teams_pool_id_fkey");
  });
});
