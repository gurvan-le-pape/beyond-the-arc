# Cross-boundary assumptions

> What the scheduler, the backend and the frontend assume about each other beyond what any check enforces — and what to look at when a change touches one of them.

---

## Why this list exists

The three parts of the system are separate programs. The backend and the scheduler never import each other, and the frontend talks to the backend only over HTTP. Most changes stay inside one of them and can be reviewed there.

One coupling is mechanically checked: **the response shapes.** Backend DTOs produce `docs/openapi.json`, the frontend generates `shared/types/api.generated.ts` from it, and the `openapi-drift` CI job fails when either is stale. A renamed or retyped field breaks the frontend typecheck. See [`api.md`](./api.md).

Everything below is a coupling that **no type and no check carries**. A change on one side compiles, passes its own tests, and breaks the other side silently. When a change touches anything in this list, review the other side too.

---

## 1. The timestamp is the game clock

The simulator writes every event at `starts_at + game seconds`, with no stoppages. Elapsed time therefore *is* the game clock, and two readers rely on it:

| reader | what it derives | file |
| --- | --- | --- |
| backend | the event's `period` (1–4, then 5, 6, … for overtime) | `src/backend/modules/matches/match-period.ts` |
| frontend | the `mm:ss` clock shown on each timeline event | `formatGameClock` in `src/frontend/features/matches/components/detail/match-events/event-timeline/TimelineEventBlock.tsx` |

The period lengths are mirrored, not shared: `QUARTER_LENGTH` and `OVERTIME_LENGTH` in `src/backend/db/python/simulation/match_simulator.py`, `QUARTER_SECONDS` and `OVERTIME_SECONDS` in `match-period.ts`. Each side pins its own copy — `src/backend/db/python/tests/test_quarters.py` asserts the buzzers, `match-period.spec.ts` the boundaries — but nothing compares the two.

**Breaks when:** the simulator changes a period's length, or starts modelling stoppages (timeouts, breaks between quarters). At that point the period must be stored by the simulator rather than derived.

## 2. The response envelope

`TransformInterceptor` (`src/backend/common/interceptors/transform.interceptor.ts`) wraps every response in `{ data, timestamp, path, statusCode }`, and paginated results nest `items` inside `data`. Both frontend clients unwrap `data` by hand — `src/frontend/lib/services/server/server-api-client.ts` and `src/frontend/lib/services/client/api-client.ts` — and the generated types describe the unwrapped payload.

**Breaks when:** the envelope changes shape. Every fetch fails at runtime with no type error.

## 3. Vocabularies mirrored by hand

Event types, roles, positions, genders, categories and competition levels each exist in up to four places:

| place | file |
| --- | --- |
| database | CHECK constraints in `src/backend/prisma/migrations/0_init/migration.sql` — the source of truth |
| backend | `src/backend/common/constants/` |
| frontend | `src/frontend/shared/constants/` (the kebab-case files) |
| scheduler | `src/backend/db/python/event_rules.py` and `simulation/game_config.json` |

The generated API types carry the backend's values as string unions, but the frontend constants are not typed against them. The competition time zone follows the same posture; see [The competition time zone is mirrored in three languages, on purpose](./architecture.md#the-competition-time-zone-is-mirrored-in-three-languages-on-purpose).

**Breaks when:** a value is added or renamed in one place. An event type the frontend does not know renders with a generic icon, in the "other" category.

## 4. Freshness is decided in three places

How stale a page can be is the combination of:

| layer | setting | file |
| --- | --- | --- |
| backend | `CACHE_TTL`, applied by the cache interceptor | `src/backend/common/constants/cache-ttls.ts` |
| frontend server | `ServerRevalidate` on `fetchApi` | `src/frontend/lib/services/server/server-api-client.ts` |
| frontend client | `staleTime` / `gcTime` per query | the table in [`frontend.md`](./frontend.md) |

**Breaks when:** one layer changes alone. A shorter client `staleTime` does nothing if the backend serves a cached response for longer.

## 5. What the simulator says is shown as fact

The match card and the timeline present the scheduler's output as basketball: `overtime`, `forfeit`, the event roles (who shot, who assisted, who fouled), and the absence of draws (enforced by the `no_draws_allowed` constraint on `matches`). The frontend checks none of it.

**Breaks when:** the simulator changes what a field means. Run the season sample (see `CLAUDE.md`) before and after, and look at a match page — the aggregate numbers alone do not show a label that now lies.

## 6. What a DTO contains

Which fields a response carries, and which derivations happen on the backend rather than in a component, is a joint decision. Unused fields and frontend-side recomputation are both invisible from one side: the backend sees a valid response, the frontend sees data it can use.

**Look for:** a frontend function that combines several fields of one response into a new value, and a DTO field no component reads.

---

## Checklist for a change

1. Does it change how the simulator writes time, periods, or any event field? → §1, §5
2. Does it change the interceptor, the error filter, or pagination? → §2
3. Does it add or rename an enum value anywhere? → §3
4. Does it change a cache lifetime on any layer? → §4
5. Does it add a field to a DTO, or a derivation to a frontend component? → §6
