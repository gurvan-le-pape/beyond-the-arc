# Data Pipeline

> How Beyond The Arc's data is produced: static seeding via SQL, season generation, match simulation, and the long-running scheduler that ties it all together.

---

## Overview

Beyond The Arc's data comes from two distinct sources handled in two different ways:

**Static data** — the real-world competition structure (leagues, committees, clubs) is seeded via SQL files.
This data changes rarely and benefits from being human-readable and directly inspectable.

**Dynamic data** — teams, players, championships, match schedules, match results, statistics, and shot charts are all produced by a Python pipeline. This runs as a dedicated Docker Compose service (`scheduler`) that boots with the application and keeps running indefinitely.

The pipeline is entirely self-contained: it connects directly to PostgreSQL via psycopg3, with no dependency on the NestJS backend. The NestJS API only ever reads from the database — it plays no role in data generation.

---

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     scheduler service                     │
│                                                           │
│  run_scheduler.py                                         │
│       │                                                   │
│       └── Scheduler                                       │
│               │                                           │
│               ├── SeasonGenerator (once per season)       │
│               │       ├── teams + players                 │
│               │       ├── championships + pools           │
│               │       └── match schedule                  │
│               │                                           │
│               └── poll loop (every 60s)                   │
│                       └── MatchGenerator                  │
│                               ├── PlaytimeGenerator       │
│                               └── MatchSimulator          │
│                                       ├── GameStateManager│
│                                       └── EventGenerator  │
└───────────────────────────────────────────────────────────┘
                        │
                        ▼
                  PostgreSQL
```

---

## Static data — SQL seeding

The organisational hierarchy (regions, departments, leagues, committees, clubs, gyms, presidents) is loaded by the `1_seed_static_data` Prisma migration, applied together with the schema by `prisma migrate deploy`. It covers metropolitan France only.

**Provenance**

This isn't hand-authored placeholder data — it's real French basketball organisational data, scraped from FFBB's public site (`competitions.ffbb.com`) by `scripts/ffbb-import/`:

1. `scrape.py` crawls every metro league, committee, and club page (~4480 pages, at the 1 req/s their `robots.txt` asks for) and pulls name/contact/president/gym info out of each page's embedded Next.js data, checkpointing progress to `ffbb_data/*.jsonl` so an interrupted run resumes instead of restarting.
2. `build_migration.py` geocodes each club's address via the French government's BAN API (`api-adresse.data.gouv.fr`) for real coordinates, resolves each club's department from its own postcode (not a committee-wide guess — see below), and regenerates `1_seed_static_data/migration.sql` from scratch, sorted for readability.

Run both via `make refresh-static-data` (host-side, not Docker — takes roughly 1h20, dominated by the crawl-delay). It's a rare, occasional operation for refreshing contact info as it drifts, not something CI or `make up-dev` ever triggers on its own.

**The environment they run in is built by `make venv`**, which `refresh-static-data` depends on, from the pinned `scripts/ffbb-import/requirements.txt`. That target exists because the two scripts import `requests` and the venv is gitignored: before it, the documented command called `venv/bin/python3` on a directory no clean clone had, against a dependency declared in no manifest anywhere. Both Python manifests here — the scraper's and the scheduler's (`src/backend/db/python/requirements.txt`) — pin every version exactly, transitive dependencies included, and each file carries the command that regenerates it. `.python-version` at the repo root names the interpreter, matching the `python:3.14-slim` the scheduler image is built from.

Pinning the scheduler's half is not housekeeping: that image generates every match, stat and shot chart in the product and `faker` names the players, so an unconstrained `faker` meant two builds of the same commit could produce different data generators. The other requirement had already drifted without anyone deciding to — the code was written against psycopg 3.2, and `>=3.2` has been installing 3.3.x since December 2025.

**A refresh only reaches a database that has never applied `1_seed_static_data`.** `build_migration.py` regenerates that migration in place, and `prisma migrate deploy` doesn't checksum migrations it has already applied — it branches on the pending count, finds nothing pending, prints "No pending migrations to apply." and exits 0. So a fresh environment (a new dev box, a rebuilt VPS, a restore) picks the new data up and every existing one, production included, silently keeps the old. Nothing reports the divergence, which is why the `migration-immutability` CI job blocks the edit by default. Landing a refresh takes two deliberate steps: `[refresh-static-data]` in the PR title, and the catch-up SQL in the PR body so the same change can be applied to production by hand.

Fill rates reflect what FFBB itself publishes, not scraper gaps (the crawl has zero parse errors across all pages): ~91% of clubs have a president, ~83% a gym, ~97% real coordinates, ~99% phone/email. A small number of committees genuinely cover two departments where club counts are too low to justify a standalone one (e.g. Aube/Haute-Marne) — since `committees.department_id` is a single required FK (see [`data-model.md`](./data-model.md)), these are split into one committee row per department rather than collapsed into one, each keeping the shared contact info.

The generated `clubs` INSERT resolves `president_id`/`gym_id`/`committee_id` via a single set-based join against `presidents`/`gyms`/`departments`/`committees` (matching by business key: code or name), not a correlated subquery per row. That distinction matters: an earlier per-row-subquery version of this same statement (~4368 rows × 3 lookups each) caused a real production incident applying this migration — sustained CPU/disk load severe enough to require a hard power-cycle. Adding indexes on the looked-up columns didn't fix it; the per-row execution pattern itself was the problem. Don't reintroduce correlated subqueries here for a "simpler-looking" diff.

The split between SQL and Python is a deliberate choice: static reference data that a developer might want to inspect or patch directly belongs in SQL, while anything that involves logic (randomness, scheduling, simulation) belongs in Python.

The database schema and modelling decisions are covered in → [`data-model.md`](./data-model.md)

---

## Scheduler — entry point

`run_scheduler.py` is the service entry point. It initialises the connection pool, then delegates everything to `Scheduler`.

`Scheduler` does two things on startup, then enters a poll loop:

1. **Recover stuck matches** — any match left in `generating` status from a previous crash is reset to `scheduled` so it will be retried. This makes the service safe to restart at any time.
2. **Ensure season setup** — delegates to `SeasonGenerator`, which is idempotent (see below).

After startup, it polls the database every 60 seconds for matches whose `scheduled_at` has passed and dispatches them for generation via a `ProcessPoolExecutor` (8 workers by default) — separate processes, not threads, since match simulation is CPU-bound and would otherwise be serialised by the GIL.

### Match status lifecycle

```
scheduled → generating → completed
                       ↘ failed
```

`failed` matches are not retried automatically — they require manual inspection. This is intentional: a failed match most likely indicates a data integrity issue rather than a transient error.

---

## Season generator

`SeasonGenerator` runs once per season and builds the entire competition structure from scratch. It is **idempotent**: each league is checkpointed in a `seeding_checkpoints` table, so if the process is interrupted and restarted, already-completed leagues are skipped.

The sequence for each league:

### 1. Teams and players

For each committee in the league, clubs are fetched from the database (seeded via SQL). A number of teams proportional to the club count is generated and distributed randomly across clubs, tagged with the current `SEASON_YEAR`. Each team gets 12 players with French names generated via `Faker("fr_FR")`, using gender-appropriate first names.

Because a team row belongs to one season, running the generator again for a new season inserts a fresh set of team rows rather than reusing or overwriting last season's — see [Teams](./data-model.md#teams) in the data model doc.

### 2. Championships, divisions, and pools

Teams are split **80/20** per gender and category:

- ~80% compete at **committee level** (departmental championships)
- ~20% are promoted to **league level** (regional championships)

Only first teams (`number == 1`) are eligible for league level — reserve teams always stay at committee level.

The `compute_divisions_and_pools` utility then determines how many divisions and pools are needed given the team count, capping at 12 teams per pool and 4 pools per division.

### 3. Match schedule

For every pool, a full **round-robin schedule** is generated — one home leg and one return leg. Each matchday is assigned a datetime: a Saturday or Sunday slot (14:00, 19:00, or 22:00 Paris time) chosen randomly from a fixed set of options, starting from the configured season start week.

Match shells are inserted into the database with `status = 'scheduled'` and a `scheduled_at` datetime. They have no result yet — the scheduler will fill them in as their date arrives.

### Checkpointing

Each league's setup is wrapped in a single database transaction. The checkpoint is written inside that transaction and committed atomically with the data. If the process crashes mid-league, the partial data is rolled back and the league will be re-processed on the next run.

The checkpoint's entity type is `league_setup_{SEASON_YEAR}`, not a bare `league_setup` — scoping it to the season is what makes running the generator again for a new season actually work: a new `SEASON_YEAR` produces a new checkpoint type, so leagues aren't skipped just because a *previous* season already set them up.

---

## Match generator

`MatchGenerator` is called by the scheduler for each due match. It orchestrates the full simulation and persistence of a single match.

### Sequence

1. **Load players** — fetch home and away players from the database.
2. **Generate playtime** — `PlaytimeGenerator` assigns each player a sequence of on-court intervals (5 players active at a time, rotated via substitutions throughout the 40-minute game).
3. **Simulate** — `MatchSimulator` runs the full match event by event. The starting five for each team (from the playtime generator's initial rotation) are tagged with role `starter` on the opening `tip_off` event, and every substitution becomes its own `substitution` event with `exiting_player`/`entering_player` roles — this is what lets playtime be reconstructed from events alone later.
4. **Prevent draws** — if the score is tied at the end of regulation, two points are added to the home team and a deciding basket event is appended. Draws do not exist in basketball.
5. **Detect overtime** — any event timestamped beyond the 2400-second mark (40 minutes) marks the match as overtime.
6. **Persist** — all results are written in a specific order: match result → shot locations → events (including substitutions and starters) → event players → player stats (including playtime, computed from those same events).

The entire persist step runs within a single transaction. The caller (`Scheduler`) commits on success or rolls back and marks the match `failed` on error.

---

## Match simulator

`MatchSimulator` drives the game using a **finite state machine** defined in `game_config.json`. The simulator is fully configuration-driven — changing the JSON changes the game without touching Python code.

### States

| State          | Meaning                                        |
| -------------- | ---------------------------------------------- |
| `possession`   | A team has the ball and is advancing           |
| `shot_attempt` | A shot is being taken                          |
| `rebound`      | The ball is loose after a missed shot          |
| `dead_ball`    | Play is stopped (foul, violation, made basket) |

### Transitions

Each state defines weighted probabilities to the next state. For example, from `possession`:

- 85% → `shot_attempt`
- 15% → `dead_ball` (turnover, foul, etc.)

Each transition also carries a list of possible events with their own odds (e.g. from `possession` → `dead_ball`: traveling 15%, bad pass 25%, steal 15%, blocking foul 6%, …).

Some event categories have sub-events with their own weighted selection — for instance, a 2-point shot attempt resolves into either interior (`int`) or exterior (`ext`), then into specific shot types (layup, dunk, fadeaway, pull-up jumper).

### Event generation

`EventGenerator` resolves each event type into a full event dict with:

- **Player roles** — shooter, assister, rebounder, fouler, stealer, blocker, victim — drawn randomly from the players currently on court at that moment.
- **Shot location** — for all shot events, a `(x, y)` coordinate is generated on a FIBA half-court (15m × 14m). The location is constrained by shot type: interior shots land in the paint, three-pointers are sampled along the arc radius with a small variance, mid-range shots fall between the paint and the three-point line.
- **Description** — a human-readable string describing the event.

### Game clock

The clock advances by a randomised number of seconds per state:

- `possession`: 10–15 seconds
- `shot_attempt`: 2–5 seconds
- `rebound`: 1–3 seconds
- `dead_ball`: 0 seconds (instantaneous)

A 24-second shot clock is tracked separately and resets appropriately on turnovers, made baskets, defensive rebounds, and certain fouls. A shot clock violation is triggered if it reaches zero.

---

## Playtime generator

`PlaytimeGenerator` simulates rotations for one team before the simulator runs. It maintains exactly 5 active players at all times and rotates them through the bench in order. Each stint lasts 300–480 seconds (5–8 minutes).

The result is a dict of `player_id → [(start_sec, end_sec), ...]` intervals, plus a list of substitution events. The simulator uses these intervals at each clock tick to determine which players are on court when assigning roles, and reads the initial (`t=0`) rotation to tag the starting five per team with role `starter` on the match's opening `tip_off` event.

---

## Database layer

All database access in the pipeline is handled by three repository modules (`match_repository`, `team_repository`, `championship_repository`), each following the same discipline: **no business logic, pure SQL in, data out**. Cursors are passed in from the caller, keeping transaction control in the hands of the generator and scheduler rather than the repositories.

A connection pool (`psycopg.pool.ConnectionPool`) is initialised once per worker process at startup. Each worker process manages its own pool — no sharing across processes.

Bulk inserts that need returned IDs (shot locations, match events) use a single batched `INSERT INTO ... VALUES (...), (...) RETURNING` with `fetchall()` for deterministic ordering. Other bulk inserts use `executemany`. Shot locations have no deduplication — two events at the same coordinate get two rows, which is intentional.

---

## Configuration

| Parameter          | Location                      | Value                            |
| ------------------ | ----------------------------- | -------------------------------- |
| Season year        | `config.py`                   | `2025-2026`                      |
| Season start       | `config.py`                   | Week 39, 2024                    |
| Categories         | `config.py`                   | U11, U13, U15, U18, U21, Seniors |
| Genders            | `config.py`                   | male, female                     |
| Game state machine | `simulation/game_config.json` | Weights and event lists          |
| Poll interval      | `scheduler.py`                | 60 seconds                       |
| Worker threads     | `scheduler.py`                | 8                                |

---

## Known limitations

**Data is simulated, not real.** All match results, player statistics, and shot charts are produced by the simulator. The competition structure (leagues, committees, clubs) reflects the real French basketball hierarchy, but the gameplay data is synthetic. This is intentional for a portfolio project — it allows the full platform to function with realistic-looking data without requiring a live data feed.

**Static data covers metropolitan France only.** Overseas regions/departments/clubs (DROM, COM, TAAF, Nouvelle-Calédonie, Polynésie) aren't seeded — the platform doesn't model them. Within metro France, a small residual gap remains (~9% of clubs have no president, ~17% no gym, ~11 clubs out of 4379 were dropped entirely for lacking any address to place them) — this reflects gaps in what FFBB itself publishes rather than scraper failures, and isn't expected to reach 100%.

**Overtime is not properly simulated.** When a match ends in a draw, the current implementation simply adds 2 points to the home team and appends a single deciding basket event — it does not simulate an actual overtime period. The correct behaviour would be to run one or more additional 5-minute periods through the same state machine loop, generating events exactly as regulation quarters do, until one team leads at the end of a period. This means overtime matches currently have artificially low event counts and no overtime player statistics, and the `overtime` flag on the match is never actually set by this path (it is only set when a pre-scheduled event falls past the 2400-second mark, which cannot happen here). Fixing this requires extracting the game loop into a reusable function and calling it for each overtime period until the tie is broken.

**No retry for failed matches.** Matches that fail generation are marked `failed` and left for manual inspection. An automatic retry with backoff would be a reasonable improvement.

**Players have no individual skill ratings.** Every player is equally likely to shoot, assist, or rebound. A skill model (e.g. a shooting percentage per player) would make statistics more realistic and less uniformly distributed.

**Shot clock precision.** The shot clock implementation is an approximation — it advances with the game clock rather than independently. This is sufficient for generating plausible data but does not accurately model real shot clock mechanics.
