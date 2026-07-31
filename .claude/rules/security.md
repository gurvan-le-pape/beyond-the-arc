---
description: An unauthenticated, unthrottled, public-internet API over personal data — what that forbids and what must be escalated.
paths:
  - "src/backend/**/*.ts"
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
---

# Security

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice · `[project]` = a project fact stated directly by the maintainer.

## The posture, stated plainly

| | |
|---|---|
| Authentication | **None** `[project]` |
| Authorization | **None** `[project]` |
| Network exposure | **Reachable from the public internet** `[project]` |
| Data handled | **Includes personal data** `[project]` |
| Rate limiting | **None** — not in the app, not at the edge `[project]`+`[manifest]` |
| Secrets | Environment variables only, never committed `[project]` |

The manifests corroborate the middle rows: neither application declares `@nestjs/passport`, `@nestjs/jwt`, `passport`, `jsonwebtoken`, `bcrypt`, `argon2`, `next-auth`, `helmet`, `@nestjs/throttler`, `cookie-parser`, or any CSRF or HTML-sanitizer package. `[manifest]`

**Every endpoint is therefore a world-readable endpoint over personal data, with nothing limiting how fast anyone can call it.** That is worth raising with whoever owns this system — it is a posture decision, not a coding one, and no rule below fixes it. Until it changes, the rules below are what keep the blast radius small. Write code for the system as it is; do not write code that quietly assumes an authentication layer that is not there. `[project]`+`[principle]`

> Deployment topology, where TLS terminates, how CORS is configured, and which specific personal data the system handles are not settled here. The rules below are stated by category and hold however those are answered.

## Because there is no authorization

- **Treat every identifier that appears in a URL as public.** Knowing an id is not evidence of anything, so an id can never be the basis of an access decision. There is no "only the owner has this link." `[project]`+`[principle]`
- Where a sequential identifier would let anyone enumerate the whole dataset by counting, prefer a non-guessable one. This does not create authorization — it removes a free bulk-export. `[principle]`
- Do not add an endpoint that returns more personal data than the screen calling it needs. With no auth, "we only call it from our own UI" is not a control. `[principle]`
- `select`-narrow every Prisma query rather than returning whole rows. A column added to the schema next month should not silently start appearing in a public response. See `backend-prisma.md`. `[principle]`
- Never expose a field just because the ORM already loaded it. `[principle]`

## Because there is no rate limiting

- **Every unbounded `findMany` is a free denial-of-service and a free bulk download.** Paginate, and cap the page size server-side — a client-supplied `limit` must be clamped, not trusted. `[principle]`
- Bound anything else a caller can make expensive: result-set size, query depth, upload size, and any endpoint that fans out to another service. `[principle]`
- Expensive read paths belong behind the cache layer that is already installed (`@nestjs/cache-manager`), not behind an assumption that traffic will be modest. `[manifest]`+`[principle]`

## Input

- Every body, query, and param is a DTO validated by `class-validator`, through a `ValidationPipe` configured with `whitelist: true` and `forbidNonWhitelisted: true` — so undeclared properties are stripped and rejected rather than carried along. See `backend-nestjs.md`. `[manifest]`+`[principle]`
- Validate types **and** ranges. `@IsInt()` on a page size that can be `1e9` has validated nothing that matters. `[principle]`
- Prefer Prisma's typed query API. Where raw SQL is unavoidable, use the tagged-template form so parameters are bound — never build SQL by concatenation or interpolation. `[principle]`
- Express 5's default `simple` query parser no longer builds nested objects from query strings, which narrows the prototype-pollution surface. Do not re-enable `extended` parsing without a concrete need. `[upstream]`+`[principle]`
- Validate on the server regardless of what the generated API types say. Types are erased at runtime and guarantee nothing. See `api-contract.md`. `[upstream]`+`[principle]`

## Secrets and configuration

- **All credentials come from environment variables. Nothing sensitive is committed.** `[project]`
- Prisma 7 no longer auto-loads `.env`, so configuration is supplied deliberately — see `backend-prisma.md`. Do not "fix" a missing variable by hard-coding a fallback with a real value in it. `[upstream]`+`[project]`
- The Sentry source-map upload token lives in `.env.sentry-build-plugin` and stays gitignored. `[upstream]`
- **`NEXT_PUBLIC_`-prefixed variables are shipped to the browser.** They are public by definition — never a key, token, or connection string. `[upstream]`+`[principle]`
- Anything the frontend can read, an attacker can read. Map style URLs, tile endpoints, and analytics keys included. `[principle]`
- Rotate anything that has ever been committed, even in a deleted commit. `[principle]`

## Data leaving the system

- **Never log personal data, credentials, tokens, full request bodies, or connection strings.** Configure pino's `redact` paths for fields that could carry them, so a field added later does not leak by default. See `backend-observability.md`. `[principle]`
- Sentry payloads go to a third party. Scrub before capture, on both the backend and the frontend. `[manifest]`+`[principle]`
- Exception messages are logged and captured, so they must not contain personal data — see `error-handling.md`. `[project]`+`[principle]`
- A raw ORM error reaching the client discloses schema. Translate known error codes; return a generic 500 otherwise. `[principle]`
- The Prometheus metrics endpoint must not be publicly reachable, and metric labels must never contain personal data or unbounded values. `[principle]`

## Frontend

- The frontend talks to the backend over HTTP and holds no data client — no database driver, no ORM, in its manifest. Keep it that way; a credential in the frontend is a published credential. `[manifest]`+`[principle]`
- **No HTML sanitizer is installed.** `dangerouslySetInnerHTML` therefore has no safe path in this repo — if you genuinely need to render untrusted markup, that is a dependency decision to raise, not something to hand-roll with a regex. `[manifest]`+`[principle]`
- Do not build URLs, redirects, or `window.open` targets from unvalidated input. Validate against an allowlist of known destinations. `[principle]`
- Do not put personal data in `localStorage`, query strings, or anything that ends up in a log or a shared link. `[principle]`
- CORS on the backend must name its allowed origins explicitly. `*` on an API that returns personal data lets any page on the internet read it from a visitor's browser. `[principle]`

## Dependencies

- The lockfiles are the supply-chain record. Commit them, review their diffs, and never regenerate one to resolve a conflict — see `dependencies-and-lockfiles.md`. `[principle]`
- Run `npm audit` per project (there are three) and treat a new advisory in a runtime dependency as work, not noise. `[manifest]`+`[principle]`
- Adding a dependency adds everything it depends on. Prefer the standard library or an existing installed package before adding another name to the tree. `[principle]`

## When you find something

- If a change would make the exposure worse — a new endpoint returning more personal data, a new unbounded query, a new third-party sink — say so in the PR rather than shipping it quietly. `[principle]`
- Do not work around the missing auth layer with a partial one (a shared secret header, a hidden route, an obscure id). Half an access-control system is harder to reason about than none, and it invites people to trust it. Raise it instead. `[project]`+`[principle]`
