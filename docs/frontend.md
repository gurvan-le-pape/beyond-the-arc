# Frontend

> Key decisions made in the Next.js frontend: routing and rendering strategy, data fetching architecture, internationalisation, design system, map integration, shot chart, and error handling.

---

## Overview

The frontend is a Next.js 15 application using the App Router. It is not a pure server-rendered app nor a pure SPA — it uses a deliberate split: server components and SSR for the initial page load, TanStack Query for client-side data that needs to stay fresh or respond to user interaction. The rest of this document covers each area where a non-obvious decision was made.

How feature code is organized on disk — component folder structure, hooks/types placement, naming, barrels — is defined and lint-enforced separately in [frontend-conventions.md](./frontend-conventions.md).

---

## Routing and rendering

### Route structure

Two route groups under `app/[locale]/` split the app by the shell it needs. Groups add no URL segment, so the split is invisible in the URLs:

- **`(chrome)/`** — everything with the standard shell. Its layout renders the header, footer and page background; a page contributes only its `<main>`, through `PageLayout`. Inside it, `(public)/` groups the basketball data pages (championships, matches, players, teams, organisations, search) and scopes the error boundary they share; the informational pages (`about`, `architecture`, `contact`, `docs`, `features`) and the home page sit beside it, under the group's own `error.tsx`.
- **`(fullscreen)/`** — the clubs map, and only the map. Header, no footer, pinned to the viewport height so the map fills what is left. It is a map application rather than a document, and a footer under it would either be unreachable or shrink the map.

**The chrome is a layout, not part of `PageLayout`, because Next renders `error.tsx` and `not-found.tsx` *instead of* the page.** While the header and footer lived inside `PageLayout`, an error boundary had to rebuild the entire shell to keep it, a 404 lost it completely — `notFound()` fell through to Next's built-in page — and a `loading.tsx` could not be added at all without blanking the chrome during navigation. The home page still uses `PageLayout`'s `edgeToEdge` variant for its bento sections.

The boundary between server and client is drawn around interactivity, not data. If a component renders once and never changes in response to user input, it is a server component. If it needs to filter, paginate, or update reactively, it becomes a client component backed by a TanStack Query hook.

### Rendering strategies

Four patterns are in use, chosen per page based on data volatility and interactivity needs.

**ISR with server-fetched props** — the server component fetches data using the server-side service, passes it directly as props to child components, and exports a `revalidate` constant. No TanStack Query is involved.

```
export const revalidate = 3600;

export default async function ClubPage({ params }) {
  const club = await serverClubsService.getById(clubId);
  return <ClubDetail club={club} />;
}
```

Used by: club detail, committees list, leagues list, and other organisation pages where data changes rarely (hourly or 24-hour revalidation).

**`Promise.all` server fetch** — for pages that need multiple independent data sources fetched in parallel before rendering. All results are passed as props to child components, which are pure presentational server components.

```
const [player, matches, matchEvents] = await Promise.all([
  serverPlayersService.getById(playerId),
  serverPlayersService.getMatches(playerId),
  serverMatchesService.getEventsByPlayerId(playerId),
]).catch(handleServerError);
```

Shot charts (`PlayerShotChart`, `TeamShotChart`) receive their `matchEvents` as props this way — they are presentational components, not client-side fetchers. `isLoading={false}` and `error={null}` are passed directly because the data is already resolved on the server.

Used by: player detail, team detail, match detail, map page, league detail, committee detail.

None of these pre-build. League and committee detail once declared a `generateStaticParams` that enumerated every ID, but the image build has no backend to enumerate against, so it returned an empty list in every build that shipped — and `next dev` never prerenders either, so it never ran anywhere else. Both were removed. `dynamicParams = true` plus an hourly `revalidate` is what actually serves these routes: each page is generated on first request and the rendered HTML is then cached.

**Dynamic server fetch with client islands** — for a page whose data depends on a search param. The route is `force-dynamic`, reads the param, fetches on the server and passes the result down as props. The interactive parts are small client components that do nothing but write the URL; the server re-render that navigation triggers is what refreshes the data.

```
export const dynamic = "force-dynamic";

export default async function ChampionshipsDetailPage({ params, searchParams }) {
  const { pool: poolParam } = await searchParams;
  const poolId = resolvePoolId(pools, poolParam);
  const leaderboard = await serverLeaderboardsService.getAll({ poolId });

  return (
    <LeaderboardTable
      leaderboards={leaderboard}
      dropdown={<ChampionshipPoolSelect pools={pools} selectedPoolId={poolId} />}
    />
  );
}
```

Used by: championship detail. The selected pool lives in `?pool=`; `ChampionshipPoolSelect` only calls `router.replace`, and `LeaderboardTable` stays a server component that receives the client picker through its `dropdown` slot. Because the URL holds the state, sibling islands do not need a common client parent to share it — the match panel beside the leaderboard takes `poolId` as a prop and still fetches through TanStack Query, which is what lets it prefetch on pool hover.

Passing a client component into a server component's slot is what keeps the boundary small here. Marking the parent `"use client"` instead would pull the whole subtree — table, header, breadcrumb — into the bundle to be hydrated for nothing.

There is no `HydrationBoundary` prefetching in the app. `QueryProvider` accepts an optional `dehydratedState`, but no route passes one; server-owned data reaches components as props, not through a dehydrated cache.

**Pure client — filter/search/tab state** — pages that are inherently interactive from the first render. They use TanStack Query hooks for data, local state for filters, and `useSearchParams` for URL-synced tabs.

Used by: clubs list (debounced search + cascading league/committee selects + pagination), championships list, search page.

### URL-driven tab state

Tabs whose state should survive navigation or be shareable via URL use a `QueryTabs` component that reads the active tab from the `tab` search param via `useSearchParams()`, with a fallback to a default if the param is absent or invalid. Used on: championships list, search page.

### What each route directive is for

**The route decides when a page renders. The fetch decides how long its data lives.** Build time renders markup, never data — the frontend image is built with no backend reachable, so nothing that fetches can be pre-rendered.

That gives three cases, and every page is one of them:

- **No directives** — the page fetches nothing server-side, so it prerenders as a static shell. Any data arrives client-side through TanStack Query. Used by: organizations landing, clubs list, about, contact, features, architecture, docs.
- **`dynamic = "force-dynamic"`** — the page fetches server-side, so it must stay out of the prerender pass. Rendering per request is cheap: the backend call underneath is served from the Data Cache (see [Cache timing policy](#cache-timing-policy)), so a render is a cache read rather than a query. Used by: home, map, committees list, leagues list. Championship detail is also here, but for the ordinary reason — it reads `?pool=`.
- **`dynamicParams = true` + `revalidate`** — dynamic routes with far too many IDs to enumerate. Nothing is pre-built; each page is generated on first request and the rendered HTML is then cached for the window. Used by: the six detail pages, all at 1 hour.

An earlier version of this document claimed `revalidate` and `force-dynamic` were complementary. They are not. `force-dynamic` opts the route out of the Full Route Cache entirely, which is what `revalidate` writes to, so pairing them leaves the `revalidate` inert — and it was inert a second time over, because the fetch beneath it was uncacheable regardless. Five pages carried the pair; the `revalidate` has been removed from all of them and the real caching now lives on `fetchApi`.

---

## Data fetching architecture

### Dual service layer

Every feature has two service modules:

- `*.service.ts` — a client-side service using an Axios instance (`api-client`). Used by TanStack Query hooks in client components.
- `*.server.ts` — a server-side service using a `fetchApi` wrapper around the native `fetch` API. Used by server components during SSR.

Both modules expose the same method signatures against the same backend endpoints, so switching from server to client fetching is a mechanical change with no business logic to re-implement.

**`fetchApi`** uses `INTERNAL_API_URL` as its base, falling back to `http://backend:4000/api` — the Docker service name — if the env var is absent. This means SSR requests go directly to the backend container over the internal Docker network without going through Nginx or the public domain. It handles one backend-specific detail: the standard API response envelope (`{ data: ... }`) is unwrapped automatically, so server services work with typed data directly rather than needing to extract `.data` at every call site. Errors are normalised through `parseApiError` and re-thrown as `ApiError` instances, consistent with what client-side Axios interceptors produce. `buildQueryString` is a utility exported alongside `fetchApi` that serialises a params object to a query string, used by server services that need filter or pagination parameters.

`fetchApi` also decides how long its response lives in Next's Data Cache, via a `revalidate` option defaulting to one hour — see [Cache timing policy](#cache-timing-policy). This is the layer that caching belongs on. A `revalidate` exported from a page caches rendered HTML, cannot apply to a `force-dynamic` route, and does nothing at all unless the fetch underneath is cacheable; in Next 15 a fetch that passes neither `cache` nor `next.revalidate` is `no-store`, so before this option existed every server-rendered page issued a fresh backend query on every request regardless of what the page declared.

### Query Options pattern

Client-side data fetching is organised around the **Query Options pattern**, implemented in four files per feature. Using players as an example:

**`playersKeys.ts`** — a key factory that produces typed, hierarchical cache keys:

```typescript
export const playersKeys = {
  all: ["players"] as const,
  lists: () => [...playersKeys.all, "list"] as const,
  list: (filters?: PlayerFilters) => [...playersKeys.lists(), filters] as const,
  details: () => [...playersKeys.all, "detail"] as const,
  detail: (id: number) => [...playersKeys.details(), id] as const,
  matches: (id: number) => [...playersKeys.detail(id), "matches"] as const,
};
```

The hierarchy matters: invalidating `playersKeys.all` cascades to every players-related query. Invalidating `playersKeys.details()` only clears detail queries, leaving list queries intact.

**`playersQueries.ts`** — a query options factory that co-locates the query key, query function, and cache configuration in one place:

```typescript
export const playersQueries = {
  detail: (id: number) => ({
    queryKey: playersKeys.detail(id),
    queryFn: () => playersService.getById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }),
};
```

This is the single source of truth for each query. `useQuery`, `prefetchQuery`, and any future `useSuspenseQuery` calls all spread the same options object — there is no risk of key or config drift between call sites.

**`use-players.ts`** — thin hooks that spread query options and expose a clean API to components:

```typescript
export function usePlayer(id: number, options?: { enabled?: boolean }) {
  return useQuery<Player, ApiError>({
    ...playersQueries.detail(id),
    enabled: options?.enabled ?? !!id,
  });
}
```

Components import hooks, never query options or services directly.

**Prefetch utilities** — `playersQueries.ts` also exports a `playersPrefetch` object with functions that can be attached to hover or focus events to warm the cache before the user navigates:

```typescript
export const playersPrefetch = {
  detail: (queryClient: QueryClient) => (playerId: number) => {
    queryClient.prefetchQuery(playersQueries.detail(playerId)).catch(() => {});
  },
};
```

The `usePlayersPrefetch` hook composes these with `useQueryClient` so components get a stable, queryClient-bound prefetch function without touching the query infrastructure directly.

### Cache timing policy

Cache lifetimes are set per feature based on how often the data realistically changes:

| Data                   | `staleTime` | `gcTime` | Rationale                          |
| ---------------------- | ----------- | -------- | ---------------------------------- |
| Player / team metadata | 5 min       | 10 min   | Changes rarely within a session    |
| Match history          | 2 min       | 10 min   | Results update throughout the week |

The server half of the dual service layer answers the same question with its own
tiers, declared as `ServerRevalidate` in `server-api-client.ts` and passed
through `fetchApi`'s `revalidate` option:

| Tier        | Window | Endpoints                                              |
| ----------- | ------ | ------------------------------------------------------ |
| `REFERENCE` | 24 h   | `/clubs*`, `/committees*`, `/leagues*`                 |
| `DEFAULT`   | 1 h    | `/players`, `/teams`, `/championships`, `/pools`       |
| `LIVE`      | 60 s   | `/matches*`, `/stats`, `/leaderboards`, `*/matches`    |

`DEFAULT` applies to any call that does not ask for something else, so a new
server service is cached whether or not its author thought about it.

---

## Internationalisation

Internationalisation is handled by **next-intl**. The `[locale]` dynamic segment at the top of the route tree drives locale detection and message loading. All user-facing strings are accessed via the `useTranslations` hook in client components and `getTranslations` in server components — no raw strings appear in component JSX.

The locale segment is present in every URL but is invisible in terms of layout: the `(chrome)` route group wraps the pages under a shared layout without adding a URL segment of its own.

---

## Design system

### Tailwind design tokens

Rather than using Tailwind's default colour palette directly in components, all colours, spacing, shadows, and radii are defined as named semantic tokens in `tailwind.config.js` and referenced by name throughout the codebase.

**Colour categories:**

- `primary` / `secondary` — brand colours used for interactive elements and accents
- `surface.base` / `surface.subtle` / `surface.raised` — layered background surfaces, each step slightly elevated from the one before. There is no `-dark` counterpart: the same three names resolve per theme (see below).
- `divide` — the single border and divider colour
- `text.*` — a semantic text scale, `muted` → `secondary` → `body` → `emphasis` → `heading`. **`secondary` is the lightest step that may carry text a reader is meant to read**; `muted` is for decorative icons, separators and disabled controls. That line is a contrast floor, not a preference: on the light theme's `surface-raised`, `muted` is 2.05:1 and cannot be darkened to AA without collapsing into `secondary`. `secondary` itself is a computed value rather than a palette step, because Tailwind has no gray between 500 (3.90:1 on `surface-raised`) and 600 (which is `body`'s own colour); it clears 4.5:1 on all three surfaces in all three themes.
- `team.male` / `team.female` — gender-coded accent colours used on team and player pages
- `national` / `regional` / `departmental` — competition level colours that encode hierarchy visually
- `clubs` — a distinct purple used for club-related UI
- `success` / `error` / `warning` / `info` — status colours

Every category ramp (`clubs`, `teams`, `players`, `matches`, `national`, `regional`, `departmental`, …) has three steps, and **which step you take is decided by what you are colouring, not by taste**: `-subtle` fills, the bare token is for icons, arrows and other non-text marks, and `-strong` is the only one for text. The mid step is chosen for its presence against a fill, so it does not carry text contrast — `text-clubs` is 2.60:1 on surface-base, where `text-clubs-strong` is 10.48:1. The ramps invert per theme, so `-strong` stays the readable end in all three.

That rule is why the `-subtle` / `-strong` pair is the only combination a filled chip should use, **and why swapping them is safe while reaching for the mid tone is not**. Contrast is symmetric, so `bg-{x}-strong text-{x}-subtle` reads exactly as well as `bg-{x}-subtle text-{x}-strong` — that is how `Badge`'s three `-on-header` variants get an inverted chip for a level-tinted card header without a second set of numbers to verify. Filling with the bare mid token instead puts a pale tint on a mid tone, which is where those variants had been sitting at 3.63 / 2.21 / 1.85:1.

**`primary` and `secondary` are eleven-step ramps, not three-step ones, and their names do not line up with the category ramps.** `primary-subtle` is the fourth of eleven — a mid tone (`#6d86c0`), not a tint — so it behaves like a category ramp's bare step, and `text-primary-strong` on it is 2.75:1. The tint at the bottom of the brand ramp is `primary-ghost`; that is what a badge or a chip fill wants. Treat the shared word `subtle` as a false friend between the two ramp shapes.

**Structural tokens:**

- `borderRadius.card` (12px), `borderRadius.button` (8px), `borderRadius.input` (6px) — consistent rounding per surface type
- `boxShadow.card` / `boxShadow.card-hover` — elevation shadows
- `spacing.sidebar`, `spacing.panel`, `spacing.panel-lg`, `spacing.panel-xl` — named widths for layout panels

**There are three themes, not two, and no component knows which one is active.** Every token in `tailwind.config.js` is `var(--color-…)`; the values live in `styles/globals.css` as three custom-property blocks — `:root` (light), `.dark`, `.high-contrast`. `next-themes` puts the class on `<html>` and the variables re-resolve, so `text-text-body` or `border-divide` is correct in all three with no theme variant at the call site. That is the point of the indirection: a `dark:` pair per token would be a *triple* here, on every element, and would have to be remembered every time a token is used. Exactly one `dark:` remains in the app — `dark:prose-invert` in the docs accordion, which styles the Tailwind typography plugin rather than a token of ours.

Two consequences worth knowing before adding tokens. **A `dark:` prefix on a themed token is a bug**, not a redundancy — it pins the value and breaks high-contrast. And **a new token needs a value in all three blocks**, or it silently inherits the light one; the `-subtle` / `-strong` pairs in the category ramps deliberately *swap* between light and dark for exactly this reason, so that `text-clubs-strong` stays the readable end everywhere.

On top of the tokens sits a **surface context system**, which is runtime and does live partly in the Tailwind config. The structural classes `.surface-base` / `.surface-subtle` / `.surface-raised` each set their own background *and* publish `--surface-bg`, `--surface-inset` and `--surface-ring-offset`. Utilities defined in `tailwind.config.js` read those — `.bg-surface-own`, `.bg-surface-inset`, `.ring-offset-surface`, `.scroll-shadow-x` — so a component can say "one step above whatever I am sitting on" without knowing where it was mounted. Elevation runs base → subtle → raised and must not be skipped or reversed. **`raised` is the ceiling**: it publishes `--surface-inset` as *itself*, so `bg-surface-inset` inside a `surface-raised` ancestor is a no-op — which is how the old table body made both its zebra striping and its row hover invisible at once.

`ThemeProvider` (`lib/providers/theme-provider.tsx`) is mounted in `app/providers.tsx`, defaults to `light`, registers `["light", "dark", "high-contrast"]` and respects the OS preference (`enableSystem: true`). Adding a fourth theme means a new class block in `globals.css` overriding only what differs, plus its name in that array. `suppressHydrationWarning` is set on `<html>` to suppress the inevitable mismatch between the server-rendered class and the client-resolved theme. Components that depend on the resolved theme — such as `Logo`, which switches between light and dark image assets — use `useTheme()` with a `mounted` guard, rendering a neutral placeholder until after hydration to avoid visual flicker. `ThemeToggle` in the header follows the same pattern.

### CVA component variants

Reusable primitives use **class-variance-authority (CVA)** to define typed variant APIs. The pattern keeps all Tailwind classes co-located with the component, avoids conditional class strings in consumer code, and makes the variant contract explicit via TypeScript.

The `Button` primitive illustrates the approach:

```typescript
const buttonVariants = cva(BASE, {
  variants: {
    variant: {
      primary:
        "rounded-button bg-primary-strong text-white hover:bg-primary-bold ...",
      outline: "rounded-button border-2 border-primary-strong ...",
      ghost: "rounded-button text-primary-strong hover:bg-primary-ghost ...",
      control:
        "rounded-button border border-divide-light bg-surface-raised ...",
      // ...
    },
    size: {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
```

Components that share a base style but differ in layout context are split into separate exports in the same file rather than added as variants to a single component. `Button.tsx` exports three components:

- `Button` — universal action primitive (form submits, modal triggers, mutations). No layout knowledge.
- `NavButton` — navigation and list-item patterns. These variants know they live in a sidebar or tab bar (`navActive`, `navInactive`, `listItem`, `categoryHeader`).
- `PillButton` — round-selector and carousel patterns. Non-standard sizes and visual treatments (`pillActive`, `pillInactive`, `carouselArrow`) that don't belong in a general-purpose button.

The split is justified by layout context: `NavButton` variants know they are inside a navigation structure; `PillButton` variants know they have `rounded-full` treatment. Keeping them separate prevents `Button` from accumulating layout-specific knowledge it should not have.

**Navigation is a link, everywhere, and the primitives enforce it.** A `<button>` that calls `router.push` looks identical and behaves worse: no `href`, so no status-bar URL, no middle-click, no open-in-new-tab, no prefetch, and nothing for a crawler to follow. `Card` therefore takes `href` (renders a `Link`, gets the clickable styling for free) or `clickable` + `onClick` (renders a `<button>`), and its props type is a union so the two cannot be mixed. Where a primitive has no link mode, wrap the `Link` in the variant classes instead — `buttonVariants({ variant, size })` on a `Link` is the established form, used by the home page CTA and the club map popup. For links inside a table cell, see `TableCellLink` in the DataTable section.

The `Text` typography primitive follows the same CVA pattern, additionally implementing a **`variantTagMap`** that maps each variant to its semantically correct HTML element. `h1`–`h4` variants render the matching heading tag by default; `body` renders `<p>`; `caption`, `label`, and `overline` render `<span>`. The rendered element can be overridden with the `as` prop, but the default is always semantically appropriate. The `label` variant defaults to `<span>` rather than `<label>` specifically to avoid accidental form associations — consumers that need a real form label must pass `as="label" htmlFor="input-id"` explicitly.

**There is no `muted` variant, and its absence is load-bearing.** It was `text-sm text-text-muted`, identical to `caption` but a step lighter — and that step is below AA on every surface (2.31:1 on `surface-subtle`). Because `muted` cannot be darkened to AA without becoming `secondary`, the fix is not a colour but a rule: the token is for decorative icons, separators and disabled controls, and `Text` is for text, so `Text` does not offer it. `caption` is the floor. Anything that wants to sit below `caption` in the hierarchy should demote the thing above it instead — see `ChampionshipCard`, which moved its pair from muted/secondary to secondary/body rather than reaching further down.

### DataTable

Every table in the app is `DataTable` (`shared/components/table`), driven by a `TableColumn<T>[]`. The `table/` module exports exactly those two names: the `th`/`td`/`tr` primitives live in `parts.tsx` and the CVA definitions in `variants.ts`, both kept out of the barrel by a `barrelsby.json` exclude, so `enforce-barrel-import` blocks any deep import of them.

**Presentation is a closed set of typed variants — there are no `className` props**, on the table, the header, the cells or the rows. This is the CVA rule above applied strictly, and it is load-bearing rather than stylistic: when the props were `variant`/`size` plus four class-string hatches, four tables accumulated three different framings and two different stripe recipes, and the box score had already reached past the `variant` enum to hand-write its own border. A look `DataTable` cannot express is a request for a new named variant, reviewed once in `variants.ts`.

Table-level axes:

| Prop | Values | Meaning |
| --- | --- | --- |
| `frame` | `none` \| `outline` | Whether the table draws its own border. `none` inside a `Section`, which is already a bordered `Card` — a framed table inside one draws a second border a padding-width in. `outline` for a table that stands alone. Drawn on the **scroll container**, not the `<table>`: a border radius on a `<table>` does not clip the rows inside it, so anything painted to the edge squares the corners back off, and a border on the table would scroll away with the content. |
| `density` | `comfortable` \| `cozy` \| `compact` | Cell padding only. Pick by column count — `comfortable` (`px-4 py-3.5`) up to a handful, `cozy` (`px-3 py-2.5`) around eight to ten, `compact` (`px-2 py-1.5`) for a full stat line. |
| `wrap` | boolean | Whether cells may wrap. Separate from `density` so a table can be dense without being forced onto one line. |
| `stickyLead` | boolean | Pins the first column while the rest scrolls sideways. Only worth setting when the lead column identifies the row — the box score's `name` column was moved to the front for exactly this reason, because pinning its jersey number would have kept a bare digit on screen while the player left. |
| `emptyMessage` | string, **required** | A header with nothing under it and no explanation is never right, and while this was optional three of the four tables shipped without one. |

There is no zebra axis. A `striped` prop existed and three of the four tables set it, but it was close to a no-op: its odd band was `bg-surface-inset`, which resolves `--surface-inset` from the nearest surface ancestor — `TableBody`'s own `surface-raised` — and `surface-raised` publishes `--surface-inset: --color-surface-raised`, the body colour. So odd rows matched the body and only the even rows tinted, in a blue drawn from the brand ramp rather than the neutral one. Row separation is the `divide-y` on `TableBody`, and only that.

Column-level axes on `TableColumn<T>` — `numeric`, `divider`, `emphasis` and `width` — apply to the header cell **and** the body cells. `align`, `density`, `wrap`, `width`, `divider` and `numeric` are declared once in `variants.ts` and shared between `headVariants` and `cellVariants`, so a column's header and its body cells cannot drift apart. They previously could: column styling was a `className` that reached only `<td>`, so the player-stats column-group rules stopped below the header row.

**Columns of numbers set `numeric`, not `align`.** It applies `tabular-nums` and defaults the alignment to `right`. The first half matters more than it sounds: the UI font uses proportional digits, so `1` is narrower than `0` and a stat column is ragged down its own axis, shifting a pixel or two per row. Lining figures are what make a column of numbers read as a column, and the design system already relies on them in `MatchScore`, `StatValue` and `StatCell`. An explicit `align` still wins, for the cases where a numeric column reads better centred — the box score's jersey `number` takes both, being an identifier rather than a quantity.

**Row navigation is `getRowHref`, never an `onClick`.** A `<tr>` with an `onClick` is not focusable, has no role and has no key handler — the match-history tables were mouse-only. An `<a>` cannot wrap a `<tr>`, so the lead cell's content becomes a `Link` from `@/navigation` (locale-aware) whose `::after` stretches over the row: one tab stop per row, a focus ring around the whole row, and real link behaviour — Enter, middle-click, open-in-new-tab, a status-bar URL. Pass `getRowLabel` whenever the lead cell does not identify the row; a date does not. Row hover is derived from `getRowHref` rather than being its own prop, so a row cannot advertise a click it does not have.

`getRowHref` cannot be combined with `wrap={false}` or with `stickyLead`, and **the props type enforces it** — `DataTableProps` is a union of a navigating variant and a plain one, so either combination is a compile error. Both break the overlay the same way and both do it silently, leaving a working link that has quietly shrunk to the lead cell: `wrap={false}` puts `overflow-hidden` on every cell, which clips the overlay, and `stickyLead` makes the lead `<td>` a positioned element, so the overlay's `inset-0` resolves against that cell instead of the `relative` `<tr>`. These used to be a comment in `variants.ts`, and the only thing keeping them true was that the single `wrap={false}` table happened not to use row links.

**The tables that cannot take a row link use `TableCellLink`.** Refusing `getRowHref` on the box score keeps a broken overlay out of the codebase, but it does not by itself make those rows reachable — the box score's player name was a `<button>` calling `router.push`, which is not navigation: no href, no status-bar URL, no middle-click, no open-in-new-tab, nothing for a crawler to follow. `TableCellLink` is the fallback, a real `Link` scoped to the one cell that identifies the row. It lives in the table module rather than at the call sites for the same reason `DataTable` takes no `className` — table link presentation is the module's to own. Its focus ring uses `ring-offset-1`, not the usual `2`: cells are as tight as `px-2 py-1.5` at `compact` density and the ring has to fit inside that padding, because `wrap={false}` puts `overflow-hidden` on the cell. Prefer `getRowHref` wherever the table can accept it; the whole row is the better target.

**The header has no fill, and the reason is contrast.** It used to be a `bg-primary-subtle` band under a `border-primary` rule with `Text variant="label"` on top, which in the light theme is `#374151` on `#6d86c0` — 2.86:1, below the 4.5:1 AA needs for body text and below even the 3:1 large-text floor. It now separates itself typographically instead: the shared `overline` token over the same hairline the rows use, with no local override — `overline` itself carries `text-text-body` (see below), which is 6.87:1 on surface-subtle and stays recessive against the cells' `text-text-emphasis`.

**`overline` is `text-text-body`, and that is a contrast decision, not a taste one.** The variant is 12px semibold by definition, so it needs the full 4.5:1 — the large-text exemption starts at 18.66px bold or 24px. Its original `text-text-secondary` (#6b7280) is 4.39:1 on surface-subtle and 3.90:1 on surface-raised, so it failed on every Card in the app: `InfoBox`, `StatCell`, `Footer`, the homepage section labels and the table headers alike. `text-text-body` (#4b5563) is 6.87:1 and 6.11:1 on those two surfaces and rises in the dark and high-contrast themes, where the token inverts. Because the colour lives on the variant, a consumer overriding it must beat `Text`'s own `<span>` — a colour on a parent element is merely inherited and loses, which is exactly why the table's old `headerClassName` prop was a no-op.

**Wide tables get a scroll affordance and a pinned lead column, but no sticky header.** The affordance is the `.scroll-shadow-x` utility (`tailwind.config.js`): edge shadows that appear only while there is content past that edge, built from `background-attachment: local, local, scroll, scroll` — two covers painted in the container's background that scroll with the content and hide the shadow beneath them at either extreme. It is pure CSS on purpose, because `DataTable` renders inside server components and a JS overflow observer would push a `"use client"` boundary onto every table in the app.

A sticky `<thead>` was considered and **rejected**. It cannot stick to the viewport from inside the scroll container: setting `overflow-x: auto` forces the used value of `overflow-y` to `auto` as well, so the header positions against that container's scrollport — which, its height being content-driven, never scrolls vertically, so the header never engages. Making it work means giving the table a `max-height` and turning it into a bounded scroll region, and at present row counts (leaderboard ~14, box score ~12) a `70vh` cap never engages on a desktop window either. That is an axis that does nothing, permanently coupling a `max-height` into the API, which is the opposite of the closed-variant discipline above. Revisit if row counts grow; the sticky *lead column* is what makes the box score usable narrow.

The empty row deliberately does **not** use `feedback/EmptyState`. That component renders its title as `<Text variant="h3">`, and every table already sits inside a `Section` with an `<h2>`; nesting a heading that describes an absence inside the section's own table would pollute the document outline, and its icon/description/action slots are dead weight in a `<td>`.

---

## Map integration

The interactive France map is built with **react-map-gl** (v8), which wraps **MapLibre GL** and provides a React component API over it. Turf.js (`@turf/centroid`) is used for label placement — computing the centroid of each region and department polygon so club-count labels are positioned at the visual centre of each boundary shape.

### Data loading

All map data — region stats, department stats, and the full club list — is fetched server-side in the map page's `Promise.all` call and passed as props to `ClubsMapClient`. There is no lazy loading by zoom level or viewport; the full dataset arrives with the initial server render. The map page uses a 24-hour ISR revalidation window, reflecting that club geography changes rarely.

GeoJSON boundary data for regions and departments is served as static assets bundled with the frontend, keeping the backend and database free from geometry concerns.

### SSR exclusion

`ClubsMap` is loaded via `next/dynamic` with `ssr: false`. MapLibre GL requires browser APIs that are not available in the Node.js server environment, so the component is excluded from SSR entirely. `ClubsMapClient` wraps the dynamic import and shows a `LoadingMap` skeleton while the bundle loads on the client. The server-fetched data is passed through `ClubsMapClient` as props so it is available immediately when `ClubsMap` mounts — the map renders with data on first paint rather than waiting for a client-side fetch.

### Zoom-based layer switching

Three layers are rendered based on the current zoom level, controlled by `ZOOM_THRESHOLDS` constants:

- **Below `ZOOM_THRESHOLDS.DEPARTMENTS`** — `RegionsLayer` is shown, with each region filled and labelled with its club count.
- **Between `ZOOM_THRESHOLDS.DEPARTMENTS` and `ZOOM_THRESHOLDS.CLUBS`** — `DepartmentsLayer` is shown with per-department club counts.
- **Above `ZOOM_THRESHOLDS.CLUBS`** — `ClubsLayer` is shown, rendering individual club markers with MapLibre's built-in clustering. Clicking a cluster calls `getClusterExpansionZoom` and zooms in; clicking an individual marker opens a `Popup` with club details.

Region and department labels are generated via `generateLabelFeatures`, which computes centroids from the GeoJSON feature collection and attaches the club count for each shape. Labels are recomputed with `useMemo` whenever the active layer or data changes.

### Map tile source

The map uses OpenStreetMap raster tiles, configured inline as a MapLibre style object. There is no external style provider or API key required.

### Search and filtering

A `SidePanel` sits over the map and provides a search input and filter toggles. Search results flow through `useSearch` (text matching against the club list) then `useFilters` (categorical filters). Filter state changes are wrapped in `useTransition` to keep the map interaction responsive while the filtered club list updates. Clicking a club in the side panel sets the view state to zoom to that club's coordinates and opens its popup.

---

## Shot chart

The shot chart is a custom SVG renderer built in React, using D3 for coordinate scaling and geometry. It renders a FIBA half-court (15m × 14m) from scratch as composable SVG components, then overlays shot data in one of three display modes.

### Court rendering

The court is built from a set of atomic SVG components, each responsible for a single court marking: `Backboard`, `Rim`, `Block`, `Paint`, `PaintTicks`, `FreeThrow`, `ThreePointArc`, `NoCharge`, `CentreCircle`, `Baseline`, `BoundaryRect`. These are composed into a `Basket` group and assembled into the full `CourtBoundary`.

All coordinates are defined in real-world metres and converted to SVG pixel space via `xScale` and `yScale` functions passed as props. Stroke widths scale proportionally with SVG width (`(LINE_WIDTH * svgWidth) / COURT_WIDTH`) so the court renders correctly at any size without fixed pixel values.

Court geometry constants (`BASKET_X`, `BASKET_Y`, `COURT_WIDTH`, `PAINT_HEIGHT`, `THREE_PT_RADIUS`, etc.) are defined in `shared/constants` and shared across both the court renderer and the zone system.

### Display modes

Three overlay variants are implemented, each with its own header, overlay component, and where relevant, legend:

- **Scatter** — plots individual shot attempts as points, colour-coded by make/miss. `ScatterOverlay` renders one SVG element per shot event.
- **Heatmap** — divides the court into a grid of cells and colour-codes each cell by shot volume or efficiency. `HeatmapOverlay` renders `HeatmapCell` elements. `HeatmapFilterBar` lets the user switch the metric being visualised. `HeatmapLegend` explains the colour scale.
- **Hotspots** — aggregates shots into named court zones and renders `ZoneStatLabel` elements showing make rate or volume per zone. `HotspotsOverlay` composes eight zone group components (`PaintZones`, `Corner3Zones`, `WingZones`, `AboveWingZones`, `TopKeyZones`, `ArcZones`, `ApexStripeZones`, `ArcApexSidelineZones`).

The two entry points are `PlayerShotChart` and `TeamShotChart` in `variants/`, which select the appropriate overlay and header for their context.

### Zone system

The hotspot zone system classifies each shot coordinate into a named court region. Each zone module (e.g. `shotZonesAboveWing.ts`) exports a `get*Zones()` function returning an array of zone descriptors, each with:

- `key` — a unique zone identifier
- `polygon` — an array of `[x, y]` points (in metres) defining the zone boundary for SVG rendering
- `contains(x, y)` — a function that tests whether a shot coordinate falls inside the zone

Zones with curved boundaries (anything adjacent to the three-point arc) use a `get3ptArcXAtY` helper to sample points along the arc at regular intervals, building a smooth polygon approximation. The `contains` function for these zones combines bounding-box checks with an arc intersection test rather than relying on the polygon alone, which is more reliable for the thin crescent shapes that appear near the arc.

`binShotsByZones.ts` iterates shot events and calls each zone's `contains` function to produce a per-zone aggregation used by `HotspotsOverlay`.

### Rendering context

The shot chart is always a client component — SVG rendering and D3 scaling require DOM dimensions. Shot event data arrives from the API and is transformed by `transformShotEvents.ts` in the relevant feature's `utils/` folder before being passed to the chart. This keeps the API-to-chart transformation testable independently of the SVG rendering. Tooltip positioning is handled by `getTooltipPosition.ts`, which keeps the tooltip within the SVG bounds regardless of where on the court the user hovers.

---

## Error handling

Error handling is layered across three levels, matching the boundary at which the error can be meaningfully caught and recovered from.

**Global rendering errors — `global-error.tsx`**

The root `global-error.tsx` catches errors that escape the entire React tree — typically crashes in the root layout. It renders outside any Next.js infrastructure, so it cannot use `useTranslations` or any layout component. It captures the error to Sentry and renders Next.js's built-in error page as a fallback.

**Route-level errors — `[locale]/(chrome)/error.tsx`**

Errors thrown by a page are caught here, with a closer boundary at `(chrome)/(public)/error.tsx` for the data pages and one at `(fullscreen)/error.tsx` for the map. Each has access to next-intl and renders inside its group's layout — the chrome survives the error — so the result is a styled error card with a translated message and a retry button (`unstable_retry`), captured to Sentry via a `useEffect`.

**Server-side 404s — `handleServerError`**

Server components call `handleServerError(error)` in their catch blocks. If the error is an `ApiError` with `statusCode === 404`, it calls Next.js's `notFound()`, which triggers the nearest `not-found.tsx` boundary. Any other error is re-thrown, bubbling up to `error.tsx`. This means 404s produce proper not-found pages rather than generic error screens.

**API error normalisation — `parseApiError`**

Client-side Axios errors are normalised to a typed `ApiError` class by `parseApiError`. It handles three cases: Axios errors with a structured backend response body, Axios network errors (no response), and unexpected non-Axios errors. The result is a consistent `ApiError` instance with `statusCode`, `message`, and `error` fields regardless of what the underlying failure was. TanStack Query hooks type their error generics as `ApiError`, so components can inspect `error.statusCode` directly without defensive casting.

---

## Known limitations

**Design token inconsistency.** The `(public)` data pages use the semantic token system consistently. Some informational pages (`about`, `architecture`) use raw Tailwind colour values for decorative gradient elements. This is called out in comments as intentional for one-off decorative use, but it means those pages are not fully covered by the token system.

**`unstable_retry` in the error boundary.** The retry callback passed to `error.tsx` uses the `unstable_` prefix, signalling it is an experimental Next.js API that may change or be removed in a future release.

**No client-side error boundary below the route level.** Errors in client components are caught at the nearest route boundary, which covers the entire route. There are no finer-grained error boundaries around individual sections of a page, so a rendering error in one widget takes down the whole page rather than degrading gracefully.

**Internationalisation covers two locales.** The app supports `en` and `fr`. Adding a new locale requires updates to translation files, `generateStaticParams`, and locale validation in the layout — there is no automated process for this.
