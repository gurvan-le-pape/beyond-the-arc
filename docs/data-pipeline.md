# Data Pipeline

> How Beyond The Arc's data is produced: static seeding via SQL, season generation, match simulation, and the long-running scheduler that ties it all together.

---

## Overview

Beyond The Arc's data comes from two distinct sources handled in two different ways:

**Static data** — the real-world competition structure (leagues, committees, clubs, geographic boundaries) is seeded via SQL files. This data changes rarely and benefits from being human-readable and directly inspectable.

**Dynamic data** — teams, players, championships, match schedules, match results, statistics, and shot charts are all produced by a Python pipeline. This runs as a dedicated Docker Compose service (`scheduler`) that boots with the application and keeps running indefinitely.

The pipeline is entirely self-contained: it connects directly to PostgreSQL via psycopg2, with no dependency on the NestJS backend. The NestJS API only ever reads from the database — it plays no role in data generation.

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
│               ├── SeasonGenerator (once)                  │
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

The organisational hierarchy (leagues, committees, clubs) and French geographic data (region and department boundaries) are loaded via SQL files at database initialisation time, baked into the database Docker image.

**Organisational data**

Each organisation type (leagues, committees, clubs) has its own SQL file or set of files under `04_data/`. Records are inserted with their key attributes and committee or league membership resolved by name via subqueries. This data reflects the real French basketball organisational hierarchy.

**Geographic boundaries**

Region and department geometries are stored as PostGIS `MultiPolygon` shapes (SRID 4326) in `region_geometries` and `department_geometries`. The GeoJSON source data comes from [gregoiredavid/france-geojson](https://github.com/gregoiredavid/france-geojson) and was converted to SQL via `ST_GeomFromGeoJSON()` at seeding time. Baking it into the migration files removes the runtime dependency on that external source — the map works entirely from the database, with no outbound requests at startup or during normal operation. The extractor scripts that produced these SQL files live in `geojson/extractors/` in the Python pipeline.

The split between SQL and Python is a deliberate choice: static reference data that a developer might want to inspect or patch directly belongs in SQL, while anything that involves logic (randomness, scheduling, simulation) belongs in Python.

The database schema and modelling decisions are covered in → [`data-model.md`](./data-model.md)

---

## Scheduler — entry point

`run_scheduler.py` is the service entry point. It initialises the connection pool, then delegates everything to `Scheduler`.

`Scheduler` does two things on startup, then enters a poll loop:

1. **Recover stuck matches** — any match left in `generating` status from a previous crash is reset to `scheduled` so it will be retried. This makes the service safe to restart at any time.
2. **Ensure season setup** — delegates to `SeasonGenerator`, which is idempotent (see below).

After startup, it polls the database every 60 seconds for matches whose `scheduled_at` has passed and dispatches them for generation via a `ThreadPoolExecutor` (8 workers by default).

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

For each committee in the league, clubs are fetched from the database (seeded via SQL). A number of teams proportional to the club count is generated and distributed randomly across clubs. Each team gets 12 players with French names generated via `Faker("fr_FR")`, using gender-appropriate first names.

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

---

## Match generator

`MatchGenerator` is called by the scheduler for each due match. It orchestrates the full simulation and persistence of a single match.

### Sequence

1. **Load players** — fetch home and away players from the database.
2. **Generate playtime** — `PlaytimeGenerator` assigns each player a sequence of on-court intervals (5 players active at a time, rotated via substitutions throughout the 40-minute game).
3. **Simulate** — `MatchSimulator` runs the full match event by event.
4. **Prevent draws** — if the score is tied at the end of regulation, two points are added to the home team and a deciding basket event is appended. Draws do not exist in basketball.
5. **Detect overtime** — any event timestamped beyond the 2400-second mark (40 minutes) marks the match as overtime.
6. **Persist** — all results are written in a specific order: match result → shot locations → events → event players → player stats → playtime intervals → substitutions.

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

The result is a dict of `player_id → [(start_sec, end_sec), ...]` intervals, plus a list of substitution events. The simulator uses these intervals at each clock tick to determine which players are on court when assigning roles.

---

## Database layer

All database access in the pipeline is handled by three repository modules (`match_repository`, `team_repository`, `championship_repository`), each following the same discipline: **no business logic, pure SQL in, data out**. Cursors are passed in from the caller, keeping transaction control in the hands of the generator and scheduler rather than the repositories.

A threaded connection pool (`psycopg2.pool.ThreadedConnectionPool`, min 2 / max 20) is initialised at startup and shared across the worker threads.

Bulk inserts use `executemany` throughout. Shot locations use an upsert pattern with a local cache to avoid inserting duplicate coordinates across multiple events in the same match.

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

**Incomplete static data.** Presidents, gyms, and club locations (coordinates, addresses) are only partially seeded — coverage varies by department and some fields have not been retrieved yet. This is a work in progress.

**Overtime is not properly simulated.** When a match ends in a draw, the current implementation simply adds 2 points to the home team and appends a single deciding basket event — it does not simulate an actual overtime period. The correct behaviour would be to run one or more additional 5-minute periods through the same state machine loop, generating events exactly as regulation quarters do, until one team leads at the end of a period. This means overtime matches currently have artificially low event counts and no overtime player statistics, and the `overtime` flag on the match is never actually set by this path (it is only set when a pre-scheduled event falls past the 2400-second mark, which cannot happen here). Fixing this requires extracting the game loop into a reusable function and calling it for each overtime period until the tie is broken.

**No retry for failed matches.** Matches that fail generation are marked `failed` and left for manual inspection. An automatic retry with backoff would be a reasonable improvement.

**Players have no individual skill ratings.** Every player is equally likely to shoot, assist, or rebound. A skill model (e.g. a shooting percentage per player) would make statistics more realistic and less uniformly distributed.

**Shot clock precision.** The shot clock implementation is an approximation — it advances with the game clock rather than independently. This is sufficient for generating plausible data but does not accurately model real shot clock mechanics.
