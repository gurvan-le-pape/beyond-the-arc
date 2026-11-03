---
description: Next.js 15 and React 19 — async request APIs, opt-in caching, server/client boundary.
paths:
  - "src/frontend/**"
---

# Frontend — Next.js and React

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/frontend`. **Locked:** `next@15.5.18`, `react@19.2.7`, `react-dom@19.2.7`, `@sentry/nextjs@10.53.1`. Scripts: `dev`, `build`, `start`, `typecheck`. `[manifest]`

> Scope: the **App Router**. The caching and async-API rules below do not apply in the same form under the Pages Router.

## Request APIs are asynchronous

Next.js 15 made every request-time API async. This is the single most common source of errors when writing new server code. `[upstream]`

- `cookies()`, `headers()`, `draftMode()` must be awaited. `[upstream]`
- `params` in `layout`, `page`, `route`, `default`, and the metadata image conventions is a `Promise`. `[upstream]`
- `searchParams` in `page` is a `Promise`. `[upstream]`

```tsx
// app/[locale]/widgets/[id]/page.tsx
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function WidgetPage(props: { params: Params; searchParams: SearchParams }) {
  const { id } = await props.params;
  const { view } = await props.searchParams;
  // …
}
```

- In a Client Component, unwrap with `use(props.params)` instead of `await`. `[upstream]`
- The `UnsafeUnwrapped*` synchronous escape hatches exist for migration only. Do not introduce new uses. `[upstream]`+`[principle]`

## Caching is opt-in, not opt-out

- **`fetch` is not cached by default.** Pass `{ cache: 'force-cache' }` per request, or set `export const fetchCache = 'default-cache'` for a segment. `[upstream]`
- **`GET` in a Route Handler is not cached by default.** Opt in with `export const dynamic = 'force-static'`. `[upstream]`
- Page segments are no longer reused from the client router cache on `<Link>` / `useRouter` navigation — only on browser back/forward, and for shared layouts and loading states. Tune with `experimental.staleTimes` if you need the old behaviour. `[upstream]`
- Because nothing caches implicitly, **every cache is a decision someone made**. Write it at the call site and say why in a comment when it is not obvious. `[principle]`

## React 19 removals

These are gone, not deprecated: `propTypes`, `defaultProps` on **function** components, legacy context (`contextTypes` / `getChildContext`), string refs, module-pattern factories, `createFactory`, `ReactDOM.render`, `ReactDOM.hydrate`, `unmountComponentAtNode`, `findDOMNode`, `react-dom/test-utils`, and `react-test-renderer/shallow`. `[upstream]`

- Use ES6 default parameters instead of `defaultProps`. `[upstream]`
- Use ref callbacks or `useRef` instead of string refs and `findDOMNode`. `[upstream]`
- `ref` is now a regular prop — `forwardRef` is no longer required for new components, and `element.ref` is deprecated in favour of `element.props.ref`. `[upstream]`
- `useFormState` is replaced by `useActionState`. `[upstream]`
- **`useRef()` now requires an argument**: `useRef(null)`, not `useRef()`. All refs are mutable; `MutableRef` is deprecated. `[upstream]`
- `ReactElement["props"]` defaults to `unknown` rather than `any`, and the JSX namespace moved from global to `React.JSX`. `[upstream]`
- Errors are no longer re-thrown by default; root-level handling is via `onUncaughtError` / `onCaughtError` on `createRoot`/`hydrateRoot`. In Next.js this is largely handled for you by `error.tsx` boundaries — use those. `[upstream]`+`[principle]`

## Server and Client Components

- Default to Server Components. Add `'use client'` only when the component needs state, effects, browser APIs, or event handlers. `[principle]`
- Push `'use client'` to the leaves. A directive near the top of the tree drags everything below it into the client bundle. `[principle]`
- Never import server-only code (database access, secrets, `pg`, Prisma) into a module that can be pulled into a client boundary. This frontend talks to the backend over HTTP; there is no data client in its manifest, and there should not be one. `[manifest]`+`[principle]`
- Props crossing the server→client boundary must be serialisable. Pass primitives and plain objects, not class instances or functions. `[principle]`

## Sentry

`@sentry/nextjs@10` expects a multi-runtime layout: `[upstream]`

- `instrumentation.ts` — registers the server and edge configs by runtime, and exports `onRequestError = Sentry.captureRequestError`. `[upstream]`
- `instrumentation-client.ts` — browser initialisation. Client init lives **here**, not in a `sentry.client.config.ts`. `[upstream]`
- `sentry.server.config.ts` and `sentry.edge.config.ts` — the Node and edge runtime configs. `[upstream]`
- `next.config` must be wrapped in `withSentryConfig` for source-map upload and tunnelling; `tunnelRoute` routes events through your own origin to survive ad blockers. `[upstream]`
- The auth token for source-map upload belongs in `.env.sentry-build-plugin` and must never be committed. `[upstream]`+`[principle]`
- Do not send personal data in event payloads or breadcrumbs. Scrub before capture, not after. `[principle]`

This layout is in place: `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` all exist, and there is no `sentry.client.config.ts` — the v10 migration is done. Reintroducing a `sentry.client.config.ts` would put client init back in the pre-v10 location, where v10 does not read it. `[project]`

## Other Next.js 15 notes

- `experimental-edge` runtime is an error; use `edge`. `[upstream]`
- `experimental.bundlePagesExternals` → `bundlePagesRouterDependencies`; `experimental.serverComponentsExternalPackages` → `serverExternalPackages`. `[upstream]`
- `NextRequest.geo` and `NextRequest.ip` were removed — those values now come from the hosting provider. `[upstream]`
- Import fonts from `next/font`; `@next/font` is gone. `[upstream]`

## Before opening a PR

From `src/frontend`: `npm run typecheck`, `npm run lint`, `npm run format:check`. `npm run test` (`vitest run`) — see `testing.md`. `[manifest]`
