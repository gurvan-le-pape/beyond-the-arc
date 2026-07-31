---
description: Backend throws Nest HTTP exceptions with log-only messages; the frontend never renders them and supplies its own translated copy.
paths:
  - "src/backend/**/*.ts"
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
---

# Error handling

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice · `[project]` = a project convention stated directly by the maintainer.

The single rule that shapes everything else: **an exception message is a message to you, never to a user.** It goes to logs and Sentry. No component reads `error.message`. `[project]`

## Backend — throw Nest HTTP exceptions

- Services throw NestJS HTTP exceptions directly — `NotFoundException`, `BadRequestException`, `ConflictException`, `ForbiddenException`. There is no domain-error layer and no `Result` type. `[project]`

  ```ts
  const thing = await this.prisma.thing.findUnique({ where: { id } });
  if (!thing) throw new NotFoundException(`Thing ${id} not found`);
  ```
- The trade-off this accepts: services know about HTTP. Keep that knowledge at the **edge** of the service method — the guard clause that throws — and out of anything the method calls. A private helper three levels down that throws `NotFoundException` is where this convention stops paying for itself. `[project]`+`[principle]`
- Throw the most specific exception that fits. A `BadRequestException` for something that is really a conflict makes the client retry a request that can never succeed. `[principle]`
- Exception messages carry **debugging identifiers** — which entity, which id, which operation — because that is who reads them. `[project]`
- Exception messages must **never** carry user-facing prose, personal data, credentials, or raw input echoed back. They are logged and shipped to a third party. See `security.md` and `backend-observability.md`. `[project]`+`[principle]`
- Express 5 automatically forwards rejected promises from async handlers into the error pipeline, so no `try/catch` exists purely to call `next(err)`. `[upstream]`
- Never swallow an error into an empty `catch`. Either handle it meaningfully or let it propagate. A `catch` that only logs and continues is swallowing it with extra steps. `[principle]`
- Log an error once, where it is handled. Catch-log-rethrow at every layer turns one failure into five entries that look like five failures. `[principle]`
- Expected, handled outcomes — a 404, a validation rejection — are not Sentry events. Sending them there buries the failures that matter. `[principle]`

## Backend — validation and ORM errors

- `ValidationPipe` with `class-validator` already produces 400s for malformed input. Do not hand-roll shape checks that duplicate a DTO decorator. See `backend-nestjs.md`. `[manifest]`+`[principle]`
- **A raw Prisma error must never reach the client.** Its message can name models, fields, and constraints — that is schema disclosure on a public API. Catch the known error codes at the service and translate them: `[manifest]`+`[principle]`

  ```ts
  // unique constraint violation → a conflict the caller can act on
  catch (e) {
    if (isUniqueConstraintError(e)) throw new ConflictException(`Thing ${id} already exists`);
    throw e; // unknown → 500, logged, captured
  }
  ```
- Anything you did not anticipate should become a 500 with a generic body and a full log entry — not a passthrough of whatever the underlying library said. `[principle]`

- A global exception filter **does** exist — `common/filters/all-exceptions.filter.ts` — and runs alongside the direct-throw convention. It owns the response body shape and the Sentry hand-off. Enforce "no internal detail in the body" **there, once**, rather than defensively in every service. Do not build an error response by hand in a controller. `[project]`

## Frontend — two tiers of error copy

The user-visible message is chosen by the frontend, from the message catalogue, and never derived from the error object. `[project]`

**Tier 1 — inline failure, the surrounding page still works.** The call site supplies the copy, because only the call site knows what failed: `[project]`

```tsx
const t = useTranslations('widgets.list');
const { data, isPending, isError } = useWidgetQuery(filters);

if (isPending) return <WidgetListSkeleton />;
if (isError) return <InlineError message={t('loadFailed')} onRetry={refetch} />;
if (data.length === 0) return <WidgetEmptyState />;
```

**Tier 2 — the render itself is dead.** A route segment's `error.tsx` (or a shared error boundary) owns the copy; individual components do not try to render a broken tree. `[project]`

- **Never read `error.message` in a component.** It is a backend or library string: untranslated, possibly detailed, and not written for a user. `[project]`
- A TanStack Query `error` is a **branch signal**, not copy. Use `isError` to choose a state; use the catalogue for what that state says. `[upstream]`+`[project]`
- **Loading, empty, and error are three distinct states.** An empty result is a successful answer — rendering it as a failure is a bug that makes users think the system is broken. `[principle]`
- Give recoverable failures a retry affordance. An error state with no way forward is a dead end. `[principle]`
- React 19 no longer re-throws errors to the console by default; root-level handling is `onUncaughtError` / `onCaughtError`. In the App Router, use `error.tsx` boundaries rather than wiring those by hand. `[upstream]`
- Mutations report failure where the user acted — next to the button they pressed, not in a global banner they may never look at. `[principle]`

## Both sides

- Sentry is installed on the frontend and the backend. Scrub personal data before capture; the payload leaves your infrastructure. See `security.md`. `[manifest]`+`[principle]`
- Errors crossing the frontend/backend boundary are correlated by request id, not by matching message strings. See `backend-observability.md`. `[principle]`
- When an error is genuinely impossible, make it impossible in the types rather than throwing on it — a discriminated union beats a runtime guard. See `typescript.md`. `[principle]`
