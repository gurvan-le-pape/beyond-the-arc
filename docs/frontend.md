# Frontend

> Key decisions made in the Next.js frontend: routing and rendering strategy, data fetching architecture, internationalisation, design system, map integration, shot chart, and error handling.

---

## Overview

The frontend is a Next.js 15 application using the App Router. It is not a pure server-rendered app nor a pure SPA — it uses a deliberate split: server components and SSR for the initial page load, TanStack Query for client-side data that needs to stay fresh or respond to user interaction. The rest of this document covers each area where a non-obvious decision was made.

How feature code is organized on disk — component folder structure, hooks/types placement, naming, barrels — is defined and lint-enforced separately in [frontend-conventions.md](./frontend-conventions.md).

---

## Routing and rendering

### Route structure

The app has two distinct areas under `app/[locale]/`:

- **`(public)/`** — the main basketball data pages (championships, matches, players, teams, organisations, map, search). This route group exists purely for layout scoping and adds no URL segment.
- **Top-level pages** — `about`, `architecture`, `contact`, `docs`, `features`, and the home page (`/`) live directly under `[locale]/` outside the `(public)` group. These are primarily informational pages about the project itself and do not share the `(public)` layout.

The home page is a special case: it fetches live platform stats from `serverStatsService` and renders its own `<Header />` and `<Footer />` inline rather than delegating to `PageLayout`.

The boundary between server and client is drawn around interactivity, not data. If a component renders once and never changes in response to user input, it is a server component. If it needs to filter, paginate, or update reactively, it becomes a client component backed by a TanStack Query hook.

### Rendering strategies

Five patterns are in use, chosen per page based on data volatility and interactivity needs.

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

Used by: player detail, team detail, match detail, map page, league detail, committee detail. League and committee detail pages pre-build all pages at deploy time via `generateStaticParams` (with a try/catch fallback to an empty array when the backend is unavailable at build time), and revalidate hourly. `dynamicParams = true` ensures pages not pre-built are generated on first request and then ISR-cached.

**HydrationBoundary prefetch** — for pages where the initial data needs to be server-rendered but a client component will continue managing it (refetching on focus, responding to in-page navigation). The server component prefetches into a `QueryClient`, dehydrates the cache, and passes it to `HydrationBoundary`. The client component mounts with the cache already populated and TanStack Query takes over.

```
async function prefetchData(championshipId: number) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: championshipsKeys.detail(championshipId),
    queryFn: () => serverChampionshipsService.getById(championshipId),
  });
  return dehydrate(queryClient);
}

export default async function ChampionshipsDetailPage({ params }) {
  const dehydratedState = await prefetchData(championshipId);
  return (
    <HydrationBoundary state={dehydratedState}>
      <ChampionshipDetailPage />
    </HydrationBoundary>
  );
}
```

Used by: championship detail (5-minute revalidation), where the client component manages pool navigation and leaderboard tabs.

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

The locale segment is present in every URL but is invisible in terms of layout: the `(public)` route group wraps all public pages under a shared layout without adding a URL segment of its own.

---

## Design system

### Tailwind design tokens

Rather than using Tailwind's default colour palette directly in components, all colours, spacing, shadows, and radii are defined as named semantic tokens in `tailwind.config.js` and referenced by name throughout the codebase.

**Colour categories:**

- `primary` / `secondary` — brand colours used for interactive elements and accents
- `surface.base` / `surface.subtle` / `surface.raised` — layered background surfaces, each step slightly elevated from the one before. Dark equivalents are `surface.*-dark`.
- `divide.light` / `divide.dark` — border and divider colours
- `text.*` — a full semantic text scale from `text.muted` (placeholders) through `text.heading` (page titles), with dark equivalents
- `team.male` / `team.female` — gender-coded accent colours used on team and player pages
- `national` / `regional` / `departmental` — competition level colours that encode hierarchy visually
- `clubs` — a distinct purple used for club-related UI
- `success` / `error` / `warning` / `info` — status colours

**Structural tokens:**

- `borderRadius.card` (12px), `borderRadius.button` (8px), `borderRadius.input` (6px) — consistent rounding per surface type
- `boxShadow.card` / `boxShadow.card-dark` / `boxShadow.card-hover` — elevation shadows
- `spacing.sidebar`, `spacing.panel`, `spacing.panel-lg`, `spacing.panel-xl` — named widths for layout panels

Dark mode is implemented via Tailwind's `class` strategy. Every semantic token has an explicit dark counterpart applied with the `dark:` prefix — there are no CSS custom properties or runtime theme utilities in the Tailwind config itself. `next-themes` manages the `class` toggle on `<html>` via a `ThemeProvider` in `app/providers.tsx`, which wraps the app inside `NextIntlClientProvider` in the locale layout. The provider defaults to `light` but respects the OS preference (`enableSystem: true`). `suppressHydrationWarning` is set on `<html>` to suppress the inevitable mismatch between the server-rendered class and the client-resolved theme. Components that depend on the resolved theme — such as `Logo`, which switches between light and dark image assets — use `useTheme()` with a `mounted` guard, rendering a neutral placeholder until after hydration to avoid visual flicker. `ThemeToggle` in the header follows the same pattern.

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

The `Text` typography primitive follows the same CVA pattern, additionally implementing a **`variantTagMap`** that maps each variant to its semantically correct HTML element. `h1`–`h4` variants render the matching heading tag by default; `body` renders `<p>`; `caption`, `muted`, `label`, and `overline` render `<span>`. The rendered element can be overridden with the `as` prop, but the default is always semantically appropriate. The `label` variant defaults to `<span>` rather than `<label>` specifically to avoid accidental form associations — consumers that need a real form label must pass `as="label" htmlFor="input-id"` explicitly.

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

**Route-level errors — `[locale]/(public)/error.tsx`**

Errors thrown by any page within the `(public)` layout are caught here. This boundary has access to next-intl and the full layout, so it renders a styled error card with a translated message and a retry button (`unstable_retry`). It also captures to Sentry via a `useEffect`.

**Server-side 404s — `handleServerError`**

Server components call `handleServerError(error)` in their catch blocks. If the error is an `ApiError` with `statusCode === 404`, it calls Next.js's `notFound()`, which triggers the nearest `not-found.tsx` boundary. Any other error is re-thrown, bubbling up to `error.tsx`. This means 404s produce proper not-found pages rather than generic error screens.

**API error normalisation — `parseApiError`**

Client-side Axios errors are normalised to a typed `ApiError` class by `parseApiError`. It handles three cases: Axios errors with a structured backend response body, Axios network errors (no response), and unexpected non-Axios errors. The result is a consistent `ApiError` instance with `statusCode`, `message`, and `error` fields regardless of what the underlying failure was. TanStack Query hooks type their error generics as `ApiError`, so components can inspect `error.statusCode` directly without defensive casting.

---

## Known limitations

**Design token inconsistency.** The `(public)` data pages use the semantic token system consistently. Some informational pages (`about`, `architecture`) use raw Tailwind colour values for decorative gradient elements. This is called out in comments as intentional for one-off decorative use, but it means those pages are not fully covered by the token system.

**`unstable_retry` in the error boundary.** The retry callback passed to `error.tsx` uses the `unstable_` prefix, signalling it is an experimental Next.js API that may change or be removed in a future release.

**No client-side error boundary below the route level.** Errors in client components are caught at the `[locale]/(public)/error.tsx` boundary, which covers the entire route. There are no finer-grained error boundaries around individual sections of a page, so a rendering error in one widget takes down the whole page rather than degrading gracefully.

**Internationalisation covers two locales.** The app supports `en` and `fr`. Adding a new locale requires updates to translation files, `generateStaticParams`, and locale validation in the layout — there is no automated process for this.
