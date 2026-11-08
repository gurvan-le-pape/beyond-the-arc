# Data Model

> The database schema for Beyond The Arc: how the domain is structured, the tables, and the reasoning behind notable design decisions.

---

## Overview

The schema models the French basketball competition hierarchy from top to bottom — leagues down to individual match events — in nine tables:

- **Organisations** — `leagues`, `committees`, `clubs`
- **Competition** — `championships`, `pools`, `teams`, `players`, `matches`
- **Match detail** — `match_events`

A table holds what cannot be derived from the others. Standings, a championship's organiser and a match's pool are all computed on read from the rows that decide them, so no copy of them can drift.

The schema is owned by `prisma/schema.prisma` and applied through Prisma Migrate: the `0_init` baseline migration carries the original schema (including a hand-maintained section for what Prisma's schema language cannot express — CHECK constraints and partial indexes), and every later change is a new migration: generated from a `schema.prisma` edit via `prisma migrate dev`, or written by hand when it is one of those inexpressible objects. The migrations from `20261107120000_wipe_generated_data` to `20261108150000_forfeit_result` took the schema from seventeen tables to nine; see [History](#history).

A migration file is not a transaction. `prisma migrate deploy` commits each statement on its own (measured on Prisma 7.9.1 against `postgres:18`), which has three consequences:

- A statement that fails leaves the earlier ones applied, and the migration is recorded as failed until someone recovers it by hand. A file that must be all-or-nothing says `BEGIN` and `COMMIT` itself.
- A lock ends with the statement that took it, so a later statement in the same file does not extend it.
- `CREATE INDEX CONCURRENTLY` can run in a migration, alongside other statements, as long as the file has no `BEGIN`.

The comments in `20261016140000_players_name_trigram_index` and `20261103120000_match_integrity_checks` assume the opposite. Those files are applied and cannot change, so this section is the one to trust.

Every string column that the API reads as a closed set carries a CHECK constraint listing its values, matching the constant in `common/constants`: `level`, `gender` and `category` on championships, `position` on players, `status` on matches and `event_type` on match events. The `as Category`-style casts in the services rely on it.

---

## Organisations

```
leagues ──< committees ──< clubs
```

A **league** governs one region, and a **committee** one department, so each carries its area's code and name (`region_code`/`region_name`, `department_code`/`department_name`, both codes unique) rather than referencing a separate geography table. The pairs are one to one in the seed data: 13 leagues for the 13 metropolitan regions, 96 committees for the 96 departments. A committee belongs to a league (`ON DELETE CASCADE`), and a department's region is its committee's league's.

A handful of real FFBB committees actually cover two departments where club counts are too low to justify a standalone one (e.g. one committee jointly serving Aube and Haute-Marne). The seed data models it as two committee rows — one per department, sharing the same name source and address — so every club still resolves to exactly one department. See [`data-pipeline.md`](./data-pipeline.md) for where this data comes from.

A **club** belongs to a committee, with `ON DELETE RESTRICT`: a club cannot exist unaffiliated, so deleting a committee that has clubs must be an explicit, ordered operation. It carries an address, a postcode and city, and the coordinates the map plots, geocoded at import.

No organisation carries contact details — no phone, no email, no president. They are FFBB's to publish and keep current, and mostly a volunteer's own; the API instead gives each league, committee and club an `ffbbUrl`, its page on the FFBB site, derived from the clubs' FFBB `code` (see `common/utils/ffbb-links.util.ts`).

---

## Competition

```
championships ──< pools ──< teams ──< players
clubs ──< teams
teams ──< matches (home and away)
```

### Championships

A championship is one season of one competition: a `level` (`departmental`, `regional` or `national`), a `category` (U11 through Seniors), a `gender`, a `division` number and a `season_year`. It has no name — pages build their own localised title from those columns — and no link to its organiser.

The organiser is read off the teams: a championship's pools hold teams, a team belongs to a club, and the club's committee and league are the organiser. A committee runs a departmental championship, its league a regional one, and a national championship has no organiser. Season setup only ever fills a departmental pool from one committee's clubs and a regional pool from one league's, so any team gives the answer (`championships.service.ts`).

Nothing in the database rejects a duplicate championship: the columns that would have keyed one went with the organiser links. Season setup guarantees it instead, by building each league's championships in one transaction and skipping a league that already has teams this season — see [`data-pipeline.md`](./data-pipeline.md).

### Pools

A championship is divided into pools (lettered A, B, C, …). The `(championship_id, letter)` pair is unique. A pool's standings and schedule are its teams' matches.

### Teams

A team row is one club's entry into **one pool**, and through it one championship and one season. Its category, gender and season are its championship's, so the row stores none of them: a club's "team 2" that is U18 this year and Seniors next year is two rows, each in its own pool. Nothing is overwritten in place.

`pool_id` is required and `ON DELETE RESTRICT`, so a pool that still has teams cannot be deleted. The `number` field distinguishes a club's first team from its reserves — only first teams (`number = 1`) are eligible for regional and national championships — and `(pool_id, club_id, number)` is unique.

### Players

Players belong to a team and carry a jersey `number`, unique per team. Names are generated via `Faker("fr_FR")` by the scheduler.

### Matches

A match references its home and away teams; its pool is the home team's. Scores are nullable — a match starts with no result and the scheduler fills it in when it simulates the match. The `status` field tracks the match through its lifecycle (`scheduled → generating → completed`, or `failed`).

A completed match also carries its **box score**: `box_score`, a JSONB object keyed by player id, each value one player's stat line — sixteen counters (points, fouls, made and attempted shots by zone, free throws, assists, turnovers, rebounds, steals, blocks) and `playtime_intervals`, the player's stints on court as `[start, end]` pairs in seconds. The scheduler computes it once from the match's events and writes it with the result (`compute_box_score`). It denormalises what the events already say, so that a box score, a player's history or a team's season totals never scan events.

The JSON has no schema in the database beyond being an object. The backend reads every box score through one mapper, `parseBoxScore` in `common/utils/box-score.mapper.ts`, which rejects a line with a missing, extra or negative counter, or a malformed interval. Its spec parses the scheduler's `STAT_COLUMNS`, so the two sides cannot disagree on the keys. A player with no line did not play.

The rules a match row obeys are CHECK constraints, so a scheduler bug is rejected at the write rather than stored:

- `matches_status_check` — `status` is one of `scheduled`, `generating`, `completed`, `failed`.
- `matches_scores_paired` and `matches_result_iff_completed` — a result is both scores and a box score, and a match has one exactly when it is `completed`.
- `matches_box_score_is_object` — the box score is a JSON object.
- `matches_scores_non_negative`, `matches_distinct_teams` — no negative score, no team playing itself.
- `matches_flags_need_result` — `forfeit` and `overtime` are set only on a completed match.
- `matches_forfeit_result` — a forfeited match was not played: it scores 20–0 for the side that turned up, and its box score is empty.
- `no_draws_allowed` — the two scores differ. Draws do not exist in basketball.

### Forfeits

A forfeit is a flag beside the score. The side that forfeited scores 0 and the other 20 (`FORFEIT_SCORE` in the scheduler's `config.py`); either side can forfeit, at a rate set per level (`FORFEIT_ODDS`). The match has no events and an empty box score, so it counts in neither side's statistics.

### Standings

There is no standings table. `computeStandings` (`common/utils/standings.util.ts`) builds a pool's table from its teams and their completed matches on each request: 2 points for a win, 1 for a loss and 0 for a forfeit — in a forfeited match the side that lost is the side that forfeited. Teams rank by points, then point difference, and tied teams share a rank. The largest pool has twelve teams and 132 matches, so the read is cheap, and the standings can never disagree with the results.

---

## Match detail

```
matches ──< match_events >── players (player, other player)
```

### Match events

Each match produces a sequence of `match_events` — tip-offs, shots, fouls, turnovers, rebounds, substitutions, quarter ends — each with its `occurred_at` time. The valid event types are a CHECK constraint on `event_type`. The events are the source the box score is computed from; there is no separate table for substitutions or playtime.

An event names at most two players, by roles its type fixes. `player_id` is the main one — the shooter, fouler, rebounder, stealer, the player leaving on a substitution — and `other_player_id` the other — the assister, the victim, the blocker, the player coming on. `EVENT_PLAYER_ROLES` lists the roles of each type, in the scheduler's `event_rules.py` and in the backend's `common/constants`, whose spec checks that the two agree. The API turns the two columns back into a list of players with roles. `match_events_other_needs_player` rejects an event with an other player but no main one. Both foreign keys are `ON DELETE RESTRICT`: a player who appears in an event cannot be deleted.

A shot carries its location: `shot_x` and `shot_y`, in metres on a FIBA half-court (15 m × 14 m). `match_events_shot_paired` sets both or neither.

---

## Indexes

Beyond the primary keys and unique constraints:

- `idx_match_events_match_id` — on `match_events(match_id)`: a match's events, on every match page.
- `idx_match_events_player_id_shots` — a partial index on `match_events(player_id)` `WHERE shot_x IS NOT NULL`: a player's or a team's shots, for the shot charts. Only shots carry a location, so it covers a fraction of the table.
- `idx_matches_status_starts_at` — a partial index on `matches(status, starts_at)` `WHERE status = 'scheduled'`: the scheduler's polling query. Because it only indexes scheduled matches, it shrinks as matches complete.
- `idx_matches_home_team_id` / `idx_matches_away_team_id` — a team's matches (`WHERE home_team_id = X OR away_team_id = X`), on every team page, and a pool's matches through its teams.
- `idx_matches_starts_at` — on `matches(starts_at)`: the global match list (`ORDER BY starts_at DESC`, paginated) and date-range filters.
- `idx_clubs_committee_id` — on `clubs(committee_id)`: committee- and league-scoped filters; clubs, teams, players and matches queries all join through it.
- `idx_players_name_trgm` — a GIN trigram index (`gin_trgm_ops`, from the `pg_trgm` extension) on `players(name)`, added by `20261016140000_players_name_trigram_index`. It serves the player name search, a case-insensitive `contains` that Prisma emits as `ILIKE '%term%'`, which a B-tree cannot use. Terms shorter than three characters have no trigram and still scan the table.

The unique constraints cover the remaining lookups by their leading column: `players(team_id, number)`, `teams(pool_id, club_id, number)`, `pools(championship_id, letter)`. `teams(club_id)` has no index of its own; the table holds one season of teams, about 60,000 rows.

Every index that Prisma's schema language can express is declared in `prisma/schema.prisma` (with `map:` pinning the SQL name). The two partial indexes cannot be expressed in PSL and live only in the migration SQL — comments in the relevant models point to them. New plain indexes are added by editing `schema.prisma` and generating a migration; they reach every environment, including production, through `prisma migrate deploy` at the next deployment.

---

## History

The migrations from `20261107120000_wipe_generated_data` on simplified the schema from seventeen tables to nine. The first emptied every generated table, so the rest ran on empty tables and the scheduler regenerated the season. Each later one removed a table or a stored copy:

| Migration | Removed | Now |
|---|---|---|
| `20261107130000_drop_gyms_website_team_color` | `gyms`, club websites, team colours | — (nothing read them) |
| `20261107140000_drop_championship_and_pool_names` | championship and pool names | built by the pages |
| `20261107150000_merge_regions_departments` | `regions`, `departments` | code and name on leagues and committees |
| `20261107160000_drop_leaderboards` | `leaderboards` and its triggers | `computeStandings` |
| `20261107170000_drop_championship_organiser` | championships' committee and league | read off the teams |
| `20261107180000_drop_match_pool` | `matches.pool_id` | the home team's pool |
| `20261107190000_teams_belong_to_pools` | teams' category, gender and season; `seeding_checkpoints` | the pool's championship; season setup skips a league with teams |
| `20261108120000_shots_on_events` | `shot_locations`, event descriptions | `shot_x`/`shot_y` on the event |
| `20261108130000_event_players_on_events` | `match_event_players` | `player_id`/`other_player_id` on the event |
| `20261108140000_box_score_on_matches` | `player_match_stats` | `box_score` on the match |

`1_seed_static_data` still inserts gyms, regions and departments on a fresh database; the migrations above fold them away right after.

---

## Known limitations

**A pool's teams are not constrained to one organiser.** A championship's organiser is read off any one of its teams, which is right only while every team in it comes from the same committee (departmental) or league (regional). Season setup builds pools that way, but the database does not check it, and a team inserted by hand into another committee's pool would change what a championship reports depending on which team is read.

**A box score's shape is checked on read, not on write.** The database only knows `box_score` is an object. A line written with a wrong key fails the request that reads it, through `parseBoxScore`, rather than the write.
