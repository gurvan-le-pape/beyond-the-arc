---
description: date-fns / date-fns-tz — store UTC, convert at the edges, never trust the ambient zone.
paths:
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
  - "src/frontend/**/*.mts"
  - "src/backend/**/*.ts"
---

# Dates and time zones

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Locked in both applications:** `date-fns@4.1.0` and `date-fns-tz@3.2.0`. `[manifest]`

The fact that *both* applications carry the same time-zone library is the signal that time zones are a real concern here, not an incidental one. Treat this as a shared discipline. `[manifest]`+`[principle]`

## Declare what you import

- `src/frontend` declares both `date-fns` and `date-fns-tz`. `src/backend` declares **only** `date-fns-tz` and gets `date-fns@4.1.0` transitively. `[manifest]`
- If backend code imports `date-fns` directly, add it to `src/backend/package.json`. Relying on a transitive resolution means a future `date-fns-tz` release can remove it from under you. `[manifest]`+`[principle]`

## Store UTC, convert at the edges

- Persist and transport **a fixed moment in time** — a UTC timestamp or ISO string — and, when the local wall-clock meaning matters, **the time-zone identifier alongside it**. `[upstream]`
- Convert to a zone only at the point of display or of parsing user input. Everything between those two edges is UTC. `[principle]`
- Never let the process's ambient system time zone decide anything. It differs between a developer laptop, a CI runner, and a production container, which makes time-zone bugs unreproducible. `[principle]`

## The `date-fns-tz@3` API

Six exported functions: `[upstream]`

| function | use |
|---|---|
| `formatInTimeZone` | format an instant in a named zone, regardless of system zone |
| `toZonedTime` | UTC instant → a `Date` whose local fields read as that zone's wall clock |
| `fromZonedTime` | wall-clock time in a named zone → the UTC instant |
| `getTimezoneOffset` | offset in milliseconds between a zone and UTC |
| `toDate` | parse a date string that represents time in some zone |
| `format` | `date-fns` `format` extended with full time-zone tokens |

- **Displaying** an instant is one call — do not chain a conversion into a format: `[upstream]`

  ```ts
  import { formatInTimeZone } from 'date-fns-tz';

  const label = formatInTimeZone(resource.createdAt, timeZone, 'yyyy-MM-dd HH:mm zzz');
  ```
- **Reading** a wall-clock value the user typed goes back through `fromZonedTime` immediately, so nothing downstream ever handles an ambiguous local time: `[upstream]`

  ```ts
  import { fromZonedTime } from 'date-fns-tz';

  const startsAt = fromZonedTime(`${form.date}T${form.time}`, timeZone); // UTC instant
  ```
- `toZonedTime` returns a `Date` that **lies about its own zone** — its UTC fields are shifted so the local fields read correctly. It is for extracting calendar parts (day, hour) in a zone, never for storing, serialising, or comparing. `[upstream]`+`[principle]`
- Do not mix a `toZonedTime` result into arithmetic with a real instant. Compare instants to instants. `[principle]`

## General rules

- Time-zone identifiers are IANA names (`Europe/Paris`), never fixed offsets and never abbreviations. Offsets change twice a year; abbreviations are ambiguous. `[principle]`
- Never do date arithmetic with raw milliseconds when a DST transition can fall inside the interval. Use `date-fns` calendar functions (`addDays`, `differenceInCalendarDays`) for calendar questions and millisecond arithmetic only for genuine durations. `[principle]`
- A "date" with no time (a birthday, a reporting day) is not an instant. Keep it as a plain `YYYY-MM-DD` string; converting it to a `Date` attaches a midnight in *some* zone and it will shift by a day for someone. `[principle]`
- Pass the time zone explicitly through the call chain rather than reading it from ambient state deep inside a helper. A function that formats a time should take the zone as an argument. `[principle]`
- Any test asserting on formatted dates must pin the zone explicitly, or it passes only on machines set to the author's zone. `[principle]`

> The display time zone has exactly **one definition**. Whether it comes from a user profile, a request header, the browser, or a fixed business zone is a design decision — but it is defined once, and helpers receive it as an argument rather than reaching for it themselves.
>
> A *fixed* business zone needs no per-request plumbing, only a single exported constant. The failure mode to watch for is therefore duplication, not missing machinery: the same zone identifier written out at several call sites, in several languages, is one rename away from disagreeing with itself.
