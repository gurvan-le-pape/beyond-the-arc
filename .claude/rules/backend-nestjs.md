---
description: NestJS 11 on Express 5 — routing changes, framework changes, structure, validation.
paths:
  - "src/backend/**/*.ts"
  - "src/backend/nest-cli.json"
---

# Backend — NestJS and Express

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/backend`. **Locked:** `@nestjs/core@11.1.11`, `@nestjs/common@11.1.11`, `@nestjs/platform-express@11.1.11`, `express@5.2.1`, `rxjs@7.8.2`, `class-validator@0.14.3`, `class-transformer@0.5.1`, `@nestjs/cache-manager@3.1.0` + `cache-manager@7.2.8`, `@nestjs/terminus@11.0.0`. `[manifest]`

Nest 11 runs on **Express 5**. That is the source of most behaviour changes below, and Express 4 examples — which is nearly all Express material — will mislead you. `[manifest]`+`[upstream]`

## Routing syntax changed

- Wildcards must be **named**: `'/*'` is invalid, `'/*splat'` is correct. `[upstream]`
- Optional segments use braces, not `?`: `'/:file.:ext?'` → `'/:file{.:ext}'`. `[upstream]`
- Regex-style alternation in a path is unsupported: `'/[a|b]/:slug'` → pass an array `['/a/:slug', '/b/:slug']`. `[upstream]`
- Wildcard parameters are **arrays**: `/*splat` matching `/x/y` yields `{ splat: ['x', 'y'] }`. `[upstream]`
- `req.params` now has a **null prototype**, and unmatched parameters are omitted entirely rather than being `undefined` or `''`. `[upstream]`
- The same applies to middleware paths — `'(.*)'` no longer matches everything; use `'*splat'`. `[upstream]`

## Request handling changes

- **`req.query`'s default parser is now `simple`**, so nested objects and arrays in query strings no longer parse. `?filter[tone]=accent` gives you a flat string key. Restore v4 behaviour explicitly where you need it: `app.use(express.urlencoded({ extended: true }))`. `[upstream]`
- `req.query` is a getter and is no longer writable. Do not mutate it in a middleware or interceptor — transform into a DTO instead. `[upstream]`+`[principle]`
- **`req.body` is `undefined`, not `{}`,** when no body parser has run. Code doing `req.body.field` on an unparsed request now throws instead of yielding `undefined`. `[upstream]`
- Express 5 **automatically forwards rejected promises** from async handlers to the error pipeline. Manual `.catch(next)` wrappers are no longer needed. `[upstream]`
- Removed: `res.json(obj, status)`, `res.send(body, status)`, `res.send(status)`, `res.redirect(url, status)`, `res.sendfile()`, `req.param(name)`, `app.del()`. Use `res.status(n).json(obj)`, `res.sendStatus(n)`, `res.redirect(status, url)`, `res.sendFile()`, `req.params`/`req.body`/`req.query`, `app.delete()`. `[upstream]`
- `res.status()` accepts only integers 100–999. `[upstream]`
- Static files: dotfiles are ignored by default in v5. `[upstream]`

## Nest 11 framework changes

- **`Reflector.getAllAndOverride` returns `undefined` at runtime when no target carries the metadata** — its declared return type does not say so (`reflector.service.d.ts` returns bare `TTransformed`/`TResult` in 11.1.11), which makes this easier to miss, not less real. Guards and interceptors reading metadata must handle the missing case rather than assuming a value. `[upstream]`
- **Termination lifecycle hooks run in reverse order** to their initialisation counterparts. Shutdown logic that assumed the old ordering needs rechecking. `[upstream]`
- **Global middleware now runs before** middleware registered by imported modules. `[upstream]`
- Dynamic modules are resolved by **object reference** rather than a predictable hash. Test stubs keyed on module identity need to override by token instead — see `testing.md`. `[upstream]`
- `@nestjs/cache-manager@3` sits on `cache-manager@7`, which is built on **Keyv**. External stores are configured through Keyv adapters, not the old `store` option. `[manifest]`+`[upstream]`
- `@nestjs/terminus@11` replaces the legacy `HealthIndicator` base class with **`HealthIndicatorService`**. Custom health indicators must use the new API. `[upstream]`
- Minimum Node is v20; this repo requires >= 24. `[upstream]`+`[manifest]`

## Structure

- One concern per module: a module owns its controller, its service, and its providers, and exports only what other modules genuinely need. `[principle]`
- Controllers do HTTP: parse, validate, delegate, shape the response. Business logic belongs in services; data access belongs behind the Prisma layer. A controller that queries the database directly has no seam to test. `[principle]`
- Depend on injected providers, never on module-level singletons or imported instances. The DI container is what makes the service testable. `[principle]`
- Cross-cutting behaviour goes in the mechanism Nest provides for it — guards for authorisation, interceptors for response shaping, pipes for validation and transformation, filters for error mapping. Do not reimplement these as helper calls repeated in every handler. `[principle]`
- Circular module imports are a design smell before they are a `forwardRef` problem. Extract the shared piece instead. `[principle]`

## Validation

- Every request body, query, and param is a DTO class carrying `class-validator` decorators, applied through a `ValidationPipe`. `[manifest]`+`[principle]`
- Enable `whitelist` (strip undeclared properties) and `forbidNonWhitelisted`, so a client cannot smuggle fields past the DTO. `[principle]`
- Validate at the boundary only. Once inside a service the type should be trustworthy; re-validating everywhere hides where the real contract is. `[principle]`
- Keep `@nestjs/swagger` decorators on the same DTOs — the documented contract and the enforced contract must be one object. See `api-contract.md`. `[manifest]`+`[principle]`

## Scripts

| script | what it does |
|---|---|
| `start:dev` | `prisma generate` (via `prestart:dev`) → `nest start --watch --ts-config tsconfig.build.json` → removes `*.spec.js` from `dist` |
| `build` | `prisma generate && nest build -p tsconfig.build.json && tsc-alias -p tsconfig.build.json && clean:specs` |
| `start:prod` | `node dist/main` |

`[manifest]`

- `tsc-alias` runs **after** `nest build` to rewrite `paths` aliases in the emitted JavaScript. Any change to `paths` must keep both steps working, and TypeScript 6 deprecated `baseUrl` — see `typescript.md`. `[manifest]`+`[upstream]`
- `prisma generate` precedes both build and dev start because Prisma 7 no longer generates implicitly. Do not remove those steps. `[manifest]`+`[upstream]`

There is **no `@nestjs/config`, no `ConfigModule`, and no config directory.** Environment variables are read directly via `process.env` at their point of use — `main.ts` (`PORT`, `FRONTEND_URL`), `app.module.ts` (`NODE_ENV`), `instrument.ts` (`SENTRY_DSN`), `prisma.config.ts` (`DATABASE_URL`), `prisma/prisma.service.ts` (`DATABASE_URL` again — a second, independent reader) and `common/filters/all-exceptions.filter.ts`. Follow that pattern rather than introducing a config layer; adding one is an architectural change, not a convenience. Always supply a sensible fallback (`process.env.PORT || 4000`) so a missing variable degrades predictably. `[project]`
