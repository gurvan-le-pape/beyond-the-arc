# Data Model

> The database schema for Beyond The Arc: how the domain is structured, the key tables, and the reasoning behind notable design decisions.

---

## Overview

The schema models the French basketball competition hierarchy from top to bottom — national leagues down to individual match events. It is split into four broad areas:

- **Geography** — regions, departments, and their GeoJSON boundaries
- **Organisations** — leagues, committees, clubs, gyms, presidents
- **Competition** — championships, pools, teams, players, leaderboards, matches
- **Match detail** — events, event players, shot locations, player stats, playtime intervals, substitutions

The schema is defined in `migrations/01_schema/01_create_schema.sql` and mirrored in the Prisma schema used by the NestJS backend.

---

## Geography

```
regions ──< region_geometries
departments ──< department_geometries
```

Regions and departments are stored as simple lookup tables with a `code` and `name`. Their boundaries are stored separately in `region_geometries` and `department_geometries` as PostGIS `MultiPolygon` geometries (SRID 4326), with a `geojson_code` field mapping back to the source GeoJSON file.

The geometry is split into a dedicated table rather than inlined on the parent row because the boundary data is large and only needed by the map feature — keeping it separate means it is never fetched incidentally when querying organisational data.

---

## Organisations

```
regions ──< leagues ──< committees ──< clubs
departments ──< committees
presidents ──< leagues / committees / clubs
gyms ──< clubs
```

**Leagues** belong to a region and represent the top level of the French basketball hierarchy. **Committees** belong to both a department and a league. **Clubs** belong to a committee and optionally reference a gym and a president.

Presidents are stored in a standalone `presidents` table rather than as inline fields on each organisation. This reflects the real structure — a president is a named individual with contact details who holds a role, rather than just a name field — and avoids duplicating contact information if the same person holds multiple roles.

The `gyms` table follows the same logic: a gym is a venue with its own identity that can be referenced by a club, not just an address string on the club row.

Both `presidents` and `gyms` use a `code` field for robust cross-referencing during the seeding process, independent of auto-generated ids.

---

## Competition

```
leagues / committees ──< championships ──< pools ──< matches
                                               ──< leaderboards
clubs ──< teams ──< players
pools ──< teams (pool assignment)
```

### Championships

Championships carry a `level` (`departmental`, `regional`, or `national`), a `category` (U11 through Seniors), a `gender`, a `division` number, and a `season_year`. A check constraint enforces organisational consistency: departmental championships must reference both a committee and a league, regional and national championships reference only a league.

A unique constraint across `(season_year, category, gender, level, division, committee_id, league_id)` prevents duplicate championships from being created, which is particularly important given the idempotent season generation process.

### Pools

A championship is divided into pools (lettered A, B, C, …). Each pool has its own leaderboard and match schedule. The `(championship_id, letter)` pair is unique.

### Teams

Teams belong to a club and are assigned to a pool. The `number` field distinguishes a club's first team from its reserve teams — only first teams (`number == 1`) are eligible for league-level championships. Teams also carry a `category` and `gender` matching the championship they compete in.

### Players

Players belong to a team and carry a jersey `number`, which is unique per team. Names are generated via `Faker("fr_FR")` by the Python pipeline.

### Leaderboards

Each team assigned to a pool gets a leaderboard row tracking wins, losses, forfeits, points scored and conceded, point difference, and competition points (2 for a win, 1 for a loss, 0 for a forfeit). Leaderboard rows are maintained automatically by database triggers — see [Leaderboard triggers](#leaderboard-triggers) below.

### Matches

Matches belong to a pool and reference home and away teams. Scores are nullable — a match starts with no result and is filled in by the Python pipeline when simulated. The `status` field tracks the match through its lifecycle (`scheduled → generating → completed`, or `failed`).

Two constraints are worth noting:

- `no_draws_allowed` — a check constraint prevents equal scores from being persisted. Draws do not exist in basketball, and the pipeline enforces this at the application level too, but the constraint provides a hard guarantee at the database level.
- `forfeit` and `overtime` are boolean flags handled separately from the score, since a forfeit still has a score (0–20 by convention) and overtime affects how statistics are interpreted.

---

## Match detail

```
matches ──< match_events ──< match_event_players
                         ──> shot_locations
matches ──< player_match_stats
matches ──< player_playtime_intervals
matches ──< substitutions
```

### Match events

Each match produces a sequence of `match_events` — tip-offs, shots, fouls, turnovers, rebounds, substitutions, and so on. The full list of valid event types is enforced via a `CHECK` constraint on the `event_type` column.

Events reference players indirectly through `match_event_players`, which records each player's role in the event (shooter, assister, rebounder, fouler, stealer, blocker, victim, etc.). This join table allows an event to involve multiple players with distinct roles without needing a column per role on the event row itself.

### Shot locations

Shot coordinates are stored in a separate `shot_locations` table rather than directly on the event row. This allows the same `(x, y)` coordinate to be referenced by multiple events without duplication — coordinates are upserted with a local cache in the pipeline to avoid inserting duplicates within a single match. The coordinates are in metres on a FIBA half-court (15m × 14m).

### Player match stats

Aggregate per-player, per-match statistics (points, rebounds, assists, fouls, shooting breakdowns by zone and type) are stored in `player_match_stats`. This denormalises data that could in principle be derived from `match_events`, but having it pre-aggregated avoids expensive event scans every time a box score is requested.

The `playtime_intervals` column on this table is a JSONB field that duplicates the data in `player_playtime_intervals`. The dedicated `player_playtime_intervals` table exists for structured querying, while the JSONB column provides a convenient snapshot co-located with the stats row for cases where the full interval detail is needed alongside the stats in a single fetch.

### Player playtime intervals and substitutions

`player_playtime_intervals` records each on-court stint as a `(start_time, end_time)` pair in seconds. `substitutions` records each player swap with its timestamp and the exiting and entering player ids. These are generated by `PlaytimeGenerator` before simulation and persisted after the match result is written.

---

## Leaderboard triggers

Leaderboard rows are maintained by four PostgreSQL triggers rather than application code. This keeps the leaderboard consistent regardless of how matches are written to the database, and removes the need for the NestJS API to perform any write operations on leaderboards.

### Initialisation trigger

`team_pool_assignment_trigger` fires after a team's `pool_id` is set. It inserts a zero-initialised leaderboard row for that team in the corresponding pool. `ON CONFLICT DO NOTHING` ensures existing rows with match results are never overwritten on re-assignment.

### Insert trigger

`match_insert_trigger` fires after a match row is inserted with scores already set. It upserts leaderboard entries for both the home and away team, applying the correct win/loss/forfeit logic and competition points (2 for a win, 1 for a loss, 0 for a forfeit by the home team; the away team receives 2 points on a home forfeit).

### Update trigger

`match_update_trigger` fires after a match row is updated, but only acts when the status transitions to `completed` from a non-completed state. The `OLD.status = 'completed'` guard prevents double-counting if the trigger fires again on an already-completed match.

This is the trigger used in practice by the pipeline — matches are inserted with `status = 'scheduled'` and no scores, then updated to `completed` once simulation finishes. The insert trigger would fire on insertion but skip the leaderboard update because scores are null at that point.

### Delete trigger

`match_delete_trigger` fires after a match row is deleted and reverses the leaderboard contributions of that match, decrementing all affected counters by the same amounts the insert trigger would have added.

---

## Indexes

Three indexes are defined beyond the primary keys and unique constraints:

- `idx_match_events_match_id` — on `match_events(match_id)`, supporting fast lookup of all events for a given match (used on every match page load).
- `idx_match_event_players_event_id` — on `match_event_players(event_id)`, supporting fast lookup of players for a given event when assembling event timelines.
- `idx_matches_status_date` — a partial index on `matches(status, date)` filtered to `WHERE status = 'scheduled'`. This is the index used by the scheduler's polling query. Because it only indexes scheduled matches, it shrinks automatically as matches are completed and stays small throughout the season.

---

## Seeding checkpoints

The `seeding_checkpoints` table is used exclusively by the Python pipeline to track which leagues have been fully set up for the current season. Each row records an `(entity_type, entity_id)` pair with a `status` and `completed_at` timestamp. The primary key on both columns makes the checkpoint write idempotent. See the data pipeline documentation for details on how this interacts with the season generator → [`data-pipeline.md`](./data-pipeline.md)

---

## Known limitations

**Leaderboard insert trigger is effectively dead code** — matches are always inserted without scores, so the null check causes it to exit immediately every time. Only the update trigger actually fires meaningfully.

**JSONB duplication on player_match_stats** — playtime_intervals exists both as JSONB on the stats row and as dedicated rows in player_playtime_intervals. These can drift out of sync with no enforcement.

**No player profile data** — players only have a name and jersey number. No position, age, height, or any other biographical data.

**Leaderboard counters can go negative** — the delete trigger decrements counters directly with no floor check. Deleting a match that was never properly counted would produce negative values.
