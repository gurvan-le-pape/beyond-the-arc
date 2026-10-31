---
description: TanStack Query v5 and native fetch — which fetching mechanism to use where.
paths:
  - "src/frontend/**"
---

# Frontend — data fetching

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/frontend`. **Locked:** `@tanstack/react-query@5.100.10`, `@tanstack/react-query-devtools@5.100.10`. No HTTP client library is installed — requests go through the platform `fetch`. `[manifest]`

## Three ways to fetch — pick deliberately

- **Server Component `fetch`** for data needed to render the page. Remember Next.js 15 does not cache `fetch` by default. See `frontend-nextjs.md`. `[upstream]`
- **TanStack Query over `fetch`** for client-side data: anything refetched, polled, paginated, invalidated after a mutation, or dependent on client state. `[manifest]`+`[principle]`
- **Route Handlers** only when the browser must not talk to the backend directly (secrets, CORS, response shaping). `[principle]`

Do not fetch the same resource both ways on one page. Two caches with different invalidation rules produce UI that disagrees with itself. `[principle]`

## TanStack Query v5 — the API changed from v4

Everything below is a v5 breaking change. If you have seen v4 code or examples, they will not compile. `[upstream]`

- **Single object signature everywhere.** `useQuery({ queryKey, queryFn })`, `useMutation({ mutationFn })`, `useInfiniteQuery({ … })`, `queryClient.invalidateQueries({ queryKey })`. Positional arguments are gone. `[upstream]`

| v4 | v5 |
|---|---|
| `cacheTime` | `gcTime` |
| `isLoading` | `isPending` |
| `isInitialLoading` | `isLoading` (new meaning) |
| `status: 'loading'` | `status: 'pending'` |
| `<Hydrate>` | `<HydrationBoundary>` |
| `useErrorBoundary` | `throwOnError` |
| `keepPreviousData: true` | `placeholderData: (prev) => prev` |

`[upstream]`

- **Query callbacks are removed** — `onSuccess`, `onError`, `onSettled` no longer exist on `useQuery`. Derive from the returned data during render, or use an effect keyed on the data. They still exist on `useMutation`. `[upstream]`
- Also removed: `isDataEqual` (use `structuralSharing`), custom loggers, `useQuery().remove()` (use `queryClient.removeQueries()`), infinite-query manual mode, `refetchPage` (use `maxPages`), and the `context` prop (pass a `queryClient` instead). `[upstream]`
- `useInfiniteQuery` now **requires an explicit `initialPageParam`**. `[upstream]`

```ts
const widgetKeys = {
  all: ['widgets'] as const,
  list: (filters: WidgetFilters) => [...widgetKeys.all, 'list', filters] as const,
  detail: (id: string) => [...widgetKeys.all, 'detail', id] as const,
};

const { data, isPending, error } = useQuery({
  queryKey: widgetKeys.detail(id),
  queryFn: ({ signal }) => fetchWidget(id, signal),
});
```

## Query keys

- Define keys in one factory per resource, as above, rather than inlining array literals at call sites. Invalidation depends on key structure, and a typo in an inline key produces a cache miss instead of an error. `[principle]`
- Every value the `queryFn` reads must appear in the `queryKey`. A key that omits a filter serves stale results for the wrong filter. `[principle]`
- Use `as const` so the key type is literal and mistakes surface at compile time. `[principle]`

## Mutations

- After a successful mutation, invalidate the affected keys — do not hand-patch unrelated caches. `[principle]`
- Keep optimistic updates to cases where the rollback is genuinely simple; every optimistic update needs an `onError` that restores the prior state. `[principle]`

## fetch

- The generated OpenAPI types are the source of truth for request and response shapes. Annotate explicitly — `response.json()` returns `Promise<any>`, and `openapi-fetch` is **not** installed, so nothing checks the annotation for you. See `api-contract.md`. `[manifest]`+`[upstream]`
- Put base URL, timeout and error handling in **one** wrapper and call it everywhere. Scattered `fetch` calls with ad-hoc base URLs cannot be changed centrally. `[principle]`
- `fetch` **resolves** on a 4xx or 5xx response and rejects only when no response arrived (network failure, abort). Check `response.ok` and throw, or every HTTP error reaches the caller as success. `[upstream]`
- `fetch` has **no default timeout**. Bound it with `AbortSignal.timeout(ms)`, and combine that with the `AbortSignal` TanStack Query gives the `queryFn` through `AbortSignal.any([...])`, so cancelled queries actually cancel their requests. `[upstream]`+`[principle]`
- Normalise errors in the wrapper into one error shape, then let query error states and `error.tsx` boundaries render it. `[principle]`
- On the server, Next.js extends `fetch` with `next: { revalidate }` for its Data Cache; see `frontend-nextjs.md`. The browser's `fetch` has no such option, so client-side freshness is the query's `staleTime`. `[upstream]`

## SSR and hydration

- If you prefetch on the server, pass the dehydrated state through `<HydrationBoundary>` (renamed from `<Hydrate>` in v5). `[upstream]`
- Create the `QueryClient` **inside** a client component (via `useState`), not at module scope. A module-scoped client is shared across requests on the server and leaks one user's data into another's render. `[principle]`
- Set a non-zero default `staleTime` when server-prefetching, or the client refetches everything immediately on mount and the prefetch was wasted. `[principle]`

## Devtools

- `@tanstack/react-query-devtools` is a **devDependency** — it must not ship in the production bundle. Render it behind a development-only check. `[manifest]`+`[principle]`

> Find the existing HTTP client before creating one. The base URL and the request-header conventions belong to it; a second client means two places where those can drift apart.
