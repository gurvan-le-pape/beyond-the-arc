# Data Model

> The database schema for Beyond The Arc: how the domain is structured, the key tables, and the reasoning behind notable design decisions.

---

## Overview

The schema models the French basketball competition hierarchy from top to bottom — national leagues down to individual match events. It is split into three broad areas:

- **Organisations** — regions, departments, leagues, committees, clubs, gyms
- **Competition** — championships, pools, teams, players, leaderboards, matches
- **Match detail** — events, event players, shot locations, player stats

The schema is owned by `prisma/schema.prisma` and applied through Prisma Migrate: the `0_init` baseline migration carries the full schema (including a hand-maintained section for what Prisma's schema language cannot express — CHECK constraints, the leaderboard triggers, and partial indexes), and every later change is a new migration: generated from a `schema.prisma` edit via `prisma migrate dev`, or written by hand when it is one of those inexpressible objects.

A migration file is not a transaction. `prisma migrate deploy` commits each statement on its own (measured on Prisma 7.9.1 against `postgres:18`), which has three consequences:

- A statement that fails leaves the earlier ones applied, and the migration is recorded as failed until someone recovers it by hand. A file that must be all-or-nothing says `BEGIN` and `COMMIT` itself.
- A lock ends with the statement that took it, so a later statement in the same file does not extend it.
- `CREATE INDEX CONCURRENTLY` can run in a migration, alongside other statements, as long as the file has no `BEGIN`.

The comments in `20261016140000_players_name_trigram_index` and `20261103120000_match_integrity_checks` assume the opposite. Those files are applied and cannot change, so this section is the one to trust.

Every string column that the API reads as a closed set carries a CHECK constraint listing its values, matching the constant in `common/constants`: `level`, `gender` and `category` on championships, `gender` and `category` on teams, `position` on players, `event_type` on match events and `role` on match event players. The `as Category`-style casts in the services rely on it.

---

## Organisations

```
regions ──< leagues ──< committees ──< clubs
regions ──< departments ──< committees
gyms ──< clubs
```

**Leagues** belong to a region and represent the top level of the French basketball hierarchy. **Departments** also belong to a region — a department's own region and the region of the league that governs its committee should always agree, though this is only enforced by convention (both ultimately trace back to the same real geography, but nothing in the schema cross-checks it — see [Known limitations](#known-limitations)). **Committees** belong to both a department and a league — `department_id` is a single required FK, one department per committee. **Clubs** belong to a committee and optionally reference a gym.

A handful of real FFBB committees actually cover two departments where club counts are too low to justify a standalone one (e.g. one committee jointly serving Aube and Haute-Marne). Rather than relax `department_id` to accommodate that, the seed data models it as two committee rows — one per department, sharing the same name source and address — so every club still resolves to exactly one department-scoped committee. See [`data-pipeline.md`](./data-pipeline.md) for where this data comes from.

No organisation carries contact details — no phone, no email, no president. They are FFBB's to publish and keep current, and mostly a volunteer's own; the API instead gives each league, committee and club an `ffbbUrl`, its page on the FFBB site, derived from the clubs' FFBB `code` (see `common/utils/ffbb-links.util.ts`).

A gym is a standalone `gyms` row rather than an address string on the club: a venue with its own identity that a club references. Gyms carry a `code` for robust cross-referencing during the seeding process, independent of auto-generated ids.

---

## Competition

```
leagues / committees ──< championships ──< pools ──< matches
                                               ──< leaderboards
clubs ──< teams ──< players
pools ──< teams (pool assignment)
```

### Championships

Championships carry a `level` (`departmental`, `regional`, or `national`), a `category` (U11 through Seniors), a `gender`, a `division` number, and a `season_year`. A check constraint enforces organisational consistency: departmental championships must reference both a committee and a league, regional and national championships reference only a league. For the same reason both foreign keys are `ON DELETE RESTRICT`: a committee or league that runs a championship cannot be deleted, since nulling the reference would break this rule.

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

Because only the triggers write these rows, CHECK constraints guard what they write: every counter is non-negative (`leaderboards_counters_non_negative`), games played are wins plus losses plus forfeits (`leaderboards_games_add_up`), and the point difference is points for minus points against (`leaderboards_difference_matches`). A trigger that miscounts fails the match write instead of storing a wrong standing.

### Matches

Matches belong to a pool and reference home and away teams. Scores are nullable — a match starts with no result and is filled in by the Python pipeline when simulated. The `status` field tracks the match through its lifecycle (`scheduled → generating → completed`, or `failed`).

The rules a match row obeys are CHECK constraints, so a scheduler bug is rejected at the write rather than stored:

- `matches_status_check` — `status` is one of `scheduled`, `generating`, `completed`, `failed`. The leaderboard triggers compare against `'completed'`, so any other spelling would leave the standings untouched without an error.
- `matches_scores_paired` and `matches_result_iff_completed` — a result is both scores, and a match has one exactly when it is `completed`.
- `matches_scores_non_negative`, `matches_distinct_teams` — no negative score, no team playing itself.
- `matches_flags_need_result` — `forfeit` and `overtime` are set only on a completed match. They are flags beside the score, not part of it: a forfeit still has a score (0–20 by convention), and overtime changes how the statistics read.
- `no_draws_allowed` — the two scores differ. Draws do not exist in basketball.

All but `no_draws_allowed` are in `20261103120000_match_integrity_checks`, added `NOT VALID` and validated by the next migration so that neither step holds an exclusive lock on `matches` during a scan.

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

Leaderboard rows are maintained by two PostgreSQL triggers rather than application code. This keeps the leaderboard consistent regardless of how matches are written to the database, and removes the need for the NestJS API to perform any write operations on leaderboards.

### Initialisation trigger

`team_pool_assignment_trigger` fires after a team's `pool_id` is set. It inserts a zero-initialised leaderboard row for that team in the corresponding pool. `ON CONFLICT DO NOTHING` ensures existing rows with match results are never overwritten on re-assignment.

### Match trigger

`match_leaderboard_trigger` fires after every insert, update and delete on `matches`. If the old row was completed, it takes that result back; if the new row is completed, it adds that result. Every change follows from those two steps: completing a match adds its result, correcting a score or moving a match to another pool swaps the old result for the new one, and resetting or deleting a match takes its result back.

A result gives 2 competition points for a win and 1 for a loss. A forfeit is always the home team's: it gets 0 points and a forfeit, and the away team gets the win and 2 points whatever the score. The `no_draws_allowed` CHECK on `matches` rules out a draw.

Adding a result creates the team's row if it is missing. Taking one back creates nothing, because a deleted pool may already have cascaded to its rows. Taking back a result from counters that don't hold it fails the leaderboard CHECK constraints, so the trigger relies on the counters being correct; `update_leaderboards_on_match_change` is the only code that should change them.

---

## Indexes

Thirteen indexes are defined beyond the primary keys and unique constraints, twelve of them in the `0_init` baseline migration:

- `idx_match_events_match_id` — on `match_events(match_id)`, supporting fast lookup of all events for a given match (used on every match page load).
- `idx_match_event_players_event_id` — on `match_event_players(event_id)`, supporting fast lookup of players for a given event when assembling event timelines.
- `idx_match_event_players_player_id` — on `match_event_players(player_id)`, supporting a player's event history.
- `idx_player_match_stats_player_id` — on `player_match_stats(player_id)`, supporting a player's stat history across matches.
- `idx_matches_status_starts_at` — a partial index on `matches(status, starts_at)` filtered to `WHERE status = 'scheduled'`. This is the index used by the scheduler's polling query. Because it only indexes scheduled matches, it shrinks automatically as matches are completed and stays small throughout the season.
- `idx_matches_pool_id_starts_at` — composite on `matches(pool_id, starts_at)`, serving pool and championship match listings (filter by pool, order by tip-off) with a single index.
- `idx_matches_home_team_id` / `idx_matches_away_team_id` — on `matches(home_team_id)` and `matches(away_team_id)`, supporting team match history queries (`WHERE home_team_id = X OR away_team_id = X`) on every team page.
- `idx_matches_starts_at` — on `matches(starts_at)`, supporting the global match list (`ORDER BY starts_at DESC`, paginated) and date-range filters.
- `idx_teams_pool_id` — on `teams(pool_id)`, supporting pool rosters and pool-scoped team filters.
- `idx_clubs_committee_id` — on `clubs(committee_id)`, supporting committee- and league-scoped filters; clubs, teams, players, and matches queries all join through this column.
- `idx_players_name_trgm` — a GIN trigram index (`gin_trgm_ops`, from the `pg_trgm` extension) on `players(name)`, added by `20261016140000_players_name_trigram_index`. It serves the player name search, a case-insensitive `contains` that Prisma emits as `ILIKE '%term%'`, which a B-tree cannot use. Terms shorter than three characters have no trigram and still scan the table.

Foreign-key columns not listed here are already covered by the leading column of a unique constraint (`players(team_id)`, `leaderboards(pool_id)`, `teams(club_id)`, `pools(championship_id)`, `player_match_stats(match_id)`), or belong to tables too small to benefit (`committees`, `leagues`, `departments`).

There is also `unique_championship_no_committee`, a partial *unique* index on `championships` covering regional/national rows: `committee_id` is NULL at those levels and NULLs never collide in the main unique constraint, so without it duplicate regional/national championships would be allowed.

Every index that Prisma's schema language can express is declared as an `@@index` in `prisma/schema.prisma` (with `map:` pinning the SQL name). The two partial indexes (`idx_matches_status_starts_at`, `unique_championship_no_committee`) cannot be expressed in PSL and live only in the migration SQL — comments in the relevant models point to them. New plain indexes are added by editing `schema.prisma` and generating a migration; they reach every environment, including production, through `prisma migrate deploy` at the next deployment.

---

## Seeding checkpoints

The `seeding_checkpoints` table is used exclusively by the Python pipeline to track which leagues have been fully set up for the current season. Each row records an `(entity_type, entity_id)` pair with a `status` and `completed_at` timestamp. The primary key on both columns makes the checkpoint write idempotent. See the data pipeline documentation for details on how this interacts with the season generator → [`data-pipeline.md`](./data-pipeline.md)

---

## Known limitations

**No cross-check between a team's organisational lineage and its competition lineage** — a team belongs to a club, which belongs to a committee (a permanent, org-side fact); a team is also assigned to a pool, which belongs to a championship run by a committee or league (a seasonal, competition-side fact). Both facts are real and both are needed, but nothing enforces that they agree — a team could in principle be pool-assigned into a championship run by a different committee than its own club's. In practice this can't happen because pools are only ever populated from a committee's/league's own team list in the first place, so it's a structural gap rather than an observed bug.

