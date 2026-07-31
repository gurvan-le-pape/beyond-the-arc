---
description: Backend Jest 30 testing conventions, and the frontend having no test runner at all.
paths:
  - "src/backend/**/*.spec.ts"
  - "src/backend/jest.config.js"
---

# Testing

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

## Current state, stated plainly

- **Backend:** `jest@30.4.2`, `ts-jest@29.4.9`, `@types/jest@30.0.0`, `@nestjs/testing@11.1.12`. Test script: `prisma generate && jest`. `[manifest]`
- **Frontend:** **no test runner and no test script at all.** No Jest, no Vitest, no Playwright, no Testing Library in the manifest. `[manifest]`

Do not pretend otherwise. If you are asked to add frontend tests, that is a toolchain decision that needs making first — say so rather than writing test files nothing can run. `[manifest]`+`[principle]`

> The backend configuration below is what Jest 30 **requires**, not a description of what `jest.config.*` and `tsconfig.spec.json` currently set. Where they disagree, the config is what changes.

## Backend: running tests

- `npm test` in `src/backend` runs `prisma generate` **first**, because Prisma 7 no longer generates the client automatically — the types the tests compile against do not exist until it runs. Do not bypass it by calling `jest` directly on a fresh clone. `[manifest]`+`[upstream]`
- Specs are `*.spec.ts` colocated with source. The `clean:specs` and `poststart:dev` scripts exist to delete compiled `*.spec.js` from `dist`, which only makes sense if specs live inside the compiled source tree. `[manifest]`
- Keep specs out of the production build. `build` runs `nest build -p tsconfig.build.json` and then `npm run clean:specs` — if you move specs elsewhere, that cleanup step must move with them. `[manifest]`

## Jest 30 changes that will bite

- **`--testPathPattern` was renamed to `--testPathPatterns`** (plural). The old flag is gone. `[upstream]`
- **`expect` matcher aliases were removed.** `eslint-plugin-jest`'s `no-alias-methods` rule autofixes these if you add it. `[upstream]`
- **Non-enumerable properties are now excluded from `toEqual`** and similar object matchers by default. A previously-passing assertion on an object with hidden properties may change behaviour. `[upstream]`
- Node 14/16/19/21 are unsupported; TypeScript 5.4+ is required. Both are satisfied here (Node >= 24, TypeScript 6.0.3). `[upstream]`+`[manifest]`
- Jest 30 bundles its packages into single files — anything reaching into Jest internals will break. `[upstream]`
- New capabilities worth using: `expect.arrayOf()`, auto-restoring spies via `using spy = jest.spyOn(...)`, `jest.advanceTimersToNextFrame()`, and `jest.retryTimes(n, { waitBeforeRetry })`. `[upstream]`
- Global leak detection is on in soft mode by default; tighten with `testEnvironmentOptions: { globalsCleanup: 'on' }` if tests pollute each other. `[upstream]`

## Writing backend tests

- Use `@nestjs/testing`'s `Test.createTestingModule` and override providers at the module boundary rather than reaching into a class's internals. `[manifest]`+`[principle]`
- Nest 11 changed dynamic module resolution to use **object references instead of predictable hashes**. Test stubs that relied on a module's identity hash will not match any more — override by token/provider instead. `[upstream]`
- Test behaviour through the public surface (controller, service method, HTTP route). Tests bound to private methods break on every refactor while proving nothing about what users get. `[principle]`
- Each test states its own setup; no ordering dependencies, no shared mutable module state between test files. `[principle]`
- Assert on one behaviour per test and name the test after that behaviour, not after the method: `it('rejects a Widget with a duplicate name')`, not `it('createWidget')`. `[principle]`
- Pin the time zone and freeze the clock in any test that touches dates — see `dates-and-timezones.md`. `[principle]`

## Database in tests

- Prisma 7 requires an explicit driver adapter and no longer auto-loads `.env`, so a test run needs its connection configured deliberately. See `backend-prisma.md`. `[upstream]`
- Prefer testing services against a real database in a disposable schema over mocking the Prisma client. A mocked client asserts that you called the ORM a certain way, not that the query is correct. `[principle]`
- Never point tests at a shared or production database. `[principle]`

**There is no test database.** Prisma is mocked entirely: specs provide a plain mock object for `PrismaService` via `{ provide: PrismaService, useValue: mockPrismaService }` in `Test.createTestingModule`. Assert on what the service asked of Prisma and on what it returned — never introduce a real connection, and don't reach for an in-memory Postgres. `[project]`

## Fixing a bug

- Write the failing test first, watch it fail for the right reason, then fix. A test written after the fix proves only that the code does what it does. `[principle]`
- The test should encode the *reported* symptom, not your theory of the cause. `[principle]`
