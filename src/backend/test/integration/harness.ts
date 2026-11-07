// src/backend/test/integration/harness.ts
import { Client } from "pg";

const TEST_DATABASE_SUFFIX = "_test";

/**
 * The connection string for the test database. These suites write and delete
 * rows, so a database whose name does not end in `_test` is refused: a stray
 * DATABASE_URL must not reach the dev or production data.
 *
 * @returns the connection string
 * @throws Error if DATABASE_URL is unset or names any other database
 */
export function testDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");

  const database = new URL(url).pathname.slice(1);
  if (!database.endsWith(TEST_DATABASE_SUFFIX)) {
    throw new Error(
      `Refusing to run against "${database}": the database name must end in "${TEST_DATABASE_SUFFIX}".`,
    );
  }
  return url;
}

/** @returns a connected client on the test database */
export async function connect(): Promise<Client> {
  const client = new Client({ connectionString: testDatabaseUrl() });
  await client.connect();
  return client;
}

/** Ids of a championship's pool and the teams assigned to it. */
export interface PoolFixture {
  championshipId: number;
  poolId: number;
  teamIds: number[];
  clubIds: number[];
  leagueId: number;
  committeeId: number;
}

/** What a fixture pool's championship and teams are. */
export interface PoolOptions {
  level?: "regional" | "departmental";
  category?: string;
  gender?: "male" | "female";
  division?: number;
  letter?: string;
  teamCount?: number;
}

let nextTeamNumber = 1;

/**
 * Creates a championship and a pool, with teams from the seeded clubs assigned
 * to it the way the scheduler assigns them, through an update of `pool_id`.
 *
 * @param client - the connection to write on
 * @param options - the championship and pool to create
 * @returns the ids of what was created
 */
export async function createPool(
  client: Client,
  options: PoolOptions = {},
): Promise<PoolFixture> {
  const {
    level = "regional",
    category = "U18",
    gender = "male",
    division = 1,
    letter = "A",
    teamCount = 2,
  } = options;

  const { rows: clubs } = await client.query<{
    id: number;
    committee_id: number;
    league_id: number;
  }>(
    `SELECT c.id, c.committee_id, m.league_id
       FROM clubs c JOIN committees m ON m.id = c.committee_id
      WHERE c.committee_id = (
        SELECT committee_id FROM clubs
         GROUP BY committee_id ORDER BY count(*) DESC, committee_id LIMIT 1
      )
      ORDER BY c.id LIMIT $1`,
    [teamCount],
  );
  const { committee_id: committeeId, league_id: leagueId } = clubs[0];

  const {
    rows: [{ id: championshipId }],
  } = await client.query<{ id: number }>(
    `INSERT INTO championships
       (category, season_year, level, division, gender)
     VALUES ($1, '2099-2100', $2, $3, $4) RETURNING id`,
    [category, level, division, gender],
  );
  const {
    rows: [{ id: poolId }],
  } = await client.query<{ id: number }>(
    `INSERT INTO pools (championship_id, letter)
     VALUES ($1, $2) RETURNING id`,
    [championshipId, letter],
  );

  const teamIds: number[] = [];
  for (const club of clubs) {
    const {
      rows: [{ id }],
    } = await client.query<{ id: number }>(
      `INSERT INTO teams (club_id, season_year, number, category, gender)
       VALUES ($1, '2099-2100', $2, $3, $4) RETURNING id`,
      [club.id, nextTeamNumber++, category, gender],
    );
    await client.query("UPDATE teams SET pool_id = $1 WHERE id = $2", [
      poolId,
      id,
    ]);
    teamIds.push(id);
  }

  return {
    championshipId,
    poolId,
    teamIds,
    clubIds: clubs.map((club) => club.id),
    leagueId,
    committeeId,
  };
}

/**
 * Inserts a scheduled match, as the season generator does.
 *
 * @param client - the connection to write on
 * @param homeTeamId - the home team
 * @param awayTeamId - the away team
 * @param startsAt - tip-off, an ISO 8601 instant
 * @returns the match's id
 */
export async function insertScheduledMatch(
  client: Client,
  homeTeamId: number,
  awayTeamId: number,
  startsAt = "2099-01-01T12:00:00Z",
): Promise<number> {
  const {
    rows: [{ id }],
  } = await client.query<{ id: number }>(
    `INSERT INTO matches (matchday, starts_at, home_team_id, away_team_id)
     VALUES (1, $1, $2, $3) RETURNING id`,
    [startsAt, homeTeamId, awayTeamId],
  );
  return id;
}

/**
 * Records a result with the statement the scheduler runs
 * (`db/python/db/repositories/match_repository.py`).
 *
 * @param client - the connection to write on
 * @param matchId - the match
 * @param homeScore - the home team's score
 * @param awayScore - the away team's score
 * @param forfeit - whether the home team forfeited
 */
export async function completeMatch(
  client: Client,
  matchId: number,
  homeScore: number,
  awayScore: number,
  forfeit = false,
): Promise<void> {
  await client.query(
    `UPDATE matches
        SET home_team_score = $1, away_team_score = $2, overtime = false,
            forfeit = $3, status = 'completed'
      WHERE id = $4`,
    [homeScore, awayScore, forfeit, matchId],
  );
}
