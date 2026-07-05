# Data Model

> The database schema for Beyond The Arc: how the domain is structured, the key tables, and the reasoning behind notable design decisions.

---

## Overview

The schema models the French basketball competition hierarchy from top to bottom — national leagues down to individual match events. It is split into three broad areas:

- **Organisations** — regions, departments, leagues, committees, clubs, gyms, presidents
- **Competition** — championships, pools, teams, players, leaderboards, matches
- **Match detail** — events, event players, shot locations, player stats

The schema is defined in `migrations/01_schema/01_create_schema.sql` and mirrored in the Prisma schema used by the NestJS backend.

---

## Organisations

```
regions ──< leagues ──< committees ──< clubs
regions ──< departments ──< committees
presidents ──< leagues / committees / clubs
gyms ──< clubs
```

**Leagues** belong to a region and represent the top level of the French basketball hierarchy. **Departments** also belong to a region — a department's own region and the region of the league that governs its committee should always agree, though this is only enforced by convention (both ultimately trace back to the same real geography, but nothing in the schema cross-checks it — see [Known limitations](#known-limitations)). **Committees** belong to both a department and a league. **Clubs** belong to a committee and optionally reference a gym and a president.

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

A team row is one club's entry into **one season** of competition, not a permanent identity that persists unchanged across seasons. This matters because a team's `category` ages up as its players get older (a club's "team 2" might be U18 this year and Seniors next year), and its pool assignment resets every season — so each season gets its own `teams` row: same `club_id` and `number`, a new `season_year`, and a fresh `category`/`gender`/`pool_id`. Nothing is overwritten in place.

The `number` field distinguishes a club's first team from its reserve teams — only first teams (`number == 1`) are eligible for league-level championships. The uniqueness constraint reflects this scoping directly: `(club_id, category, gender, number, season_year)` — a club can field a "U11 male team 1" and a "Seniors female team 1" in the same season, both legitimately numbered `1`, because uniqueness is scoped per category/gender bracket, not per club overall.

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
```

### Match events

Each match produces a sequence of `match_events` — tip-offs, shots, fouls, turnovers, rebounds, substitutions, and so on. The full list of valid event types is enforced via a `CHECK` constraint on the `event_type` column. This is the single source of truth for everything that happens in a match — there is no separate table for substitutions or playtime; both are derived from this event stream (see below).

Events reference players indirectly through `match_event_players`, which records each player's role in the event (shooter, assister, rebounder, fouler, stealer, blocker, victim, exiting/entering player on a substitution, etc.). This join table allows an event to involve multiple players with distinct roles without needing a column per role on the event row itself — a made shot might tag both a `shooter` and an `assister`, and the match's opening `tip_off` event tags all ten starting players with role `starter` alongside the jump-ball `winner`.

### Shot locations

Shot coordinates are stored in a separate `shot_locations` table rather than directly on the event row. This allows the same `(x, y)` coordinate to be referenced by multiple events without duplication — coordinates are upserted with a local cache in the pipeline to avoid inserting duplicates within a single match. The coordinates are in metres on a FIBA half-court (15m × 14m).

### Player match stats

Aggregate per-player, per-match statistics (points, rebounds, assists, fouls, shooting breakdowns by zone and type) are stored in `player_match_stats`. This denormalises data that could in principle be derived from `match_events`, but having it pre-aggregated avoids expensive event scans every time a box score is requested — the same reasoning that motivates the leaderboard triggers below.

The `playtime_intervals` column on this table is a JSONB field holding each player's on-court stints as `(start_time, end_time)` pairs, in seconds. It's computed once from `match_events` when the match is generated (the `starter` role marks who began the game on court, and `substitution` events mark every stint boundary after that) and stored here — there is no separate playtime table to keep in sync.

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

Five indexes are defined beyond the primary keys and unique constraints, all in `migrations/02_indexes/02_create_indexes.sql`:

- `idx_match_events_match_id` — on `match_events(match_id)`, supporting fast lookup of all events for a given match (used on every match page load).
- `idx_match_event_players_event_id` — on `match_event_players(event_id)`, supporting fast lookup of players for a given event when assembling event timelines.
- `idx_match_event_players_player_id` — on `match_event_players(player_id)`, supporting a player's event history.
- `idx_player_match_stats_player_id` — on `player_match_stats(player_id)`, supporting a player's stat history across matches.
- `idx_matches_status_date` — a partial index on `matches(status, date)` filtered to `WHERE status = 'scheduled'`. This is the index used by the scheduler's polling query. Because it only indexes scheduled matches, it shrinks automatically as matches are completed and stays small throughout the season.

`docker-entrypoint.sh` previously only applied `01_schema` and `03_triggers`, silently skipping this `02_indexes` step entirely — meaning none of these indexes actually existed on a database built the normal way, despite the migration file being correct. This has been fixed; the entrypoint now applies all four migration directories in order.

---

## Seeding checkpoints

The `seeding_checkpoints` table is used exclusively by the Python pipeline to track which leagues have been fully set up for the current season. Each row records an `(entity_type, entity_id)` pair with a `status` and `completed_at` timestamp. The primary key on both columns makes the checkpoint write idempotent. See the data pipeline documentation for details on how this interacts with the season generator → [`data-pipeline.md`](./data-pipeline.md)

---

## Known limitations

**Leaderboard insert trigger is effectively dead code** — matches are always inserted without scores, so the null check causes it to exit immediately every time. Only the update trigger actually fires meaningfully.

**No cross-check between a team's organisational lineage and its competition lineage** — a team belongs to a club, which belongs to a committee (a permanent, org-side fact); a team is also assigned to a pool, which belongs to a championship run by a committee or league (a seasonal, competition-side fact). Both facts are real and both are needed, but nothing enforces that they agree — a team could in principle be pool-assigned into a championship run by a different committee than its own club's. In practice this can't happen because pools are only ever populated from a committee's/league's own team list in the first place, so it's a structural gap rather than an observed bug.

**Leaderboard counters can go negative** — the delete trigger decrements counters directly with no floor check. Deleting a match that was never properly counted would produce negative values.
