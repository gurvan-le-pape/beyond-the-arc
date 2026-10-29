# Frontend component conventions

> Organization rules for feature code under `src/frontend/features/` — where components, hooks, types, and utils live, how composite components are structured, and how the rules are enforced.

---

## Overview

Every feature follows the same top-level layout: `api/`, `components/`, and — only when they have content — `constants/`, `hooks/`, `types/`, `utils/`. This document defines the rules *inside* that layout. Most are mechanically enforced by custom ESLint rules in `src/frontend/eslint-rules/` (see [Enforcement](#enforcement)), so violations fail lint/CI rather than style review; [Comments](#comments) is the one section with no rule behind it.

`shared/components/` has its own settled category-folder layout (`primitives/`, `blocks/`, `table/`, …) and is not covered here — except by [Comments](#comments), which applies to all of `src/frontend`.

---

## Components

### Composite folders

A component with private sub-parts gets a **kebab-case folder** whose root is **`index.tsx`**, exporting the PascalCase component:

```
components/detail/match-card/
  index.tsx            ← exports MatchCard
  MatchStatus.tsx      ← sub-component, private to the composite
  useMatchCard.ts      ← hook private to the composite
  types.ts             ← view types private to the composite
```

- Consumers import the folder path (`.../detail/match-card`), never a file inside it. Nothing inside a composite folder is exported from the feature barrel.
- No underscore-prefixed root markers (`_MatchCard.tsx`) and no sibling root file next to the folder (`MatchCard.tsx` beside `match-card/`) — the folder's `index.tsx` *is* the root.
- A single-file component stays a single PascalCase file; only create a folder when there are private sub-parts.
- A folder holding only its `index.tsx` is a single-file component in disguise: make it the PascalCase file.

### When to split

The rules above say **how** a component is split. Whether to split is decided by **responsibility, never by line count**: a 250-line component doing one thing stays whole, a 60-line one doing three does not.

Split when the component:

- **derives or fetches data and also renders non-trivial UI** — the derivation moves to a hook (`useMatchEventsView`), the component keeps the markup;
- **contains a piece that is, or is about to be, used elsewhere** — and if that piece can be described without naming a feature, it is not a sub-part at all but a shared primitive (see [The basketball vocabulary](#the-basketball-vocabulary));
- **nests conditional rendering more than two levels deep** — extract the branches;
- **needs a comment to say where one section ends and the next begins** — that boundary is a component.

Do **not** split when:

- the extracted piece is used once and only shortens its parent — that is indirection;
- the split would thread props through a component that does nothing with most of them;
- the length comes from configuration rather than logic. The list filters (`MatchesFilters`, `TeamsFilters`, `PlayersFilters`) are long because they declare chips and cascade steps, and they already assemble shared filter blocks: they stay whole.

`match-events/` is the reference for a good split: the root owns filter state, `event-filters/` is the control panel, `event-timeline/` the display — one role per part, each a sub-composite with its own `index.tsx`.

### The basketball vocabulary

Clubs, teams, matches and their parts are drawn the same way everywhere, so each has **exactly one implementation**, in `shared/components/domain/`:

| Concept | One implementation of |
| --- | --- |
| A club | its mark (monogram), drawn only in a page's header; lists and tables name the club in text, since the monogram's initials do not tell clubs apart |
| A team | its display name (club + number) and its label with link and winning state |
| A match | the two sides and the score, in hero, list and row sizes, with one rule for who won |
| Home and away | one colour each, from the theme |
| A match event | its icon and label |

A feature composes these; it never redraws one (no `<img src="/images/clubs/…">`, no hand-written `club - number`, no local winner comparison). When a feature needs a variant the shared component lacks, the variant is added there.

The folder holds that vocabulary and nothing larger. A section that draws one feature's data — a pool's standings, a season stat line, a match-history column — belongs to that feature, and other features reach it through the [feature layers](#feature-layers), never by parking it in `shared/`.

The same holds one layer down: an interface piece that can be described without naming a feature — a segmented control, a text link, a card — lives in `shared/components/primitives/`, even if only one feature uses it today.

### Sections and depth

- The first level under `components/` may be **section folders** (`detail/`, `list/`, `map/`) grouping components by the page area they serve. Section folders contain component files and composite folders; they have no `index.tsx` of their own.
- **Maximum depth: 3 folder levels below `components/`** (section → composite → sub-composite). Deeper trees flatten into siblings, with ownership expressed by name prefix (`MatchStatusBadge` beside `MatchStatus`, not a `match-status/` folder).
- **Role grouping** (`shot-chart` style: `court/`, `overlays/`, `headers/`) is permitted for a feature that is essentially one component with many small parts — the same depth cap applies.
- No `utils/`, `types/`, or `hooks/` *directories* inside `components/`. Component-private helpers live as files inside their composite folder; anything else belongs in the feature-level directories.

### Focus

Every element reached by the keyboard already shows the focus indicator: `globals.css` sets it on `:focus-visible` for the whole document. Do not remove it (`outline-none`) and do not draw another one (`focus:ring-*`). Vary it only through the utilities:

- `focus-ring-inset` — drawn inside the box, for an element whose container clips overflow (table cells, tab strips, list rows);
- `focus-ring-overlay` — drawn on the element's `::after`, for a link stretched over a larger box (the table row link);
- `[--focus-ring-color:rgb(var(--color-on-solid-primary))]` on a panel filled with a solid role, where the default colour does not stand out: the panel's own `on-solid` colour is the one guaranteed to read on it.

## Placement: shared vs component-private

The feature-level directories (`hooks/`, `types/`, `utils/`, `constants/`) hold only artifacts consumed by **two or more components, or by pages or the `api/` layer**. Anything consumed by exactly one composite lives inside that composite's folder.

- **Promotion rule**: the moment a second consumer appears, the artifact moves up to the feature-level directory (and into the barrel). That's the entire judgement call — don't pre-emptively "share" single-consumer code.
- `api/` is always a feature-level layer: the dual service pattern (`*.service.ts` / `*.server.ts`) and the Query Options quartet (`xKeys.ts`, `xQueries.ts`, `useX.ts`) never colocate.
- The `api/` barrel publishes the client half only. `*.server.ts` is excluded from barrel generation and imported by path (`@/features/players/api/players.server`) — otherwise a client component importing a hook from the barrel pulls the server module into the browser bundle with it.
- Empty layer directories are deleted, not kept with `.gitkeep` placeholders.

## Types

`features/*/types/` contains two kinds of files, and every file is purely one kind:

- **Generated API aliases** — `export type X = components["schemas"]["..."]` over `api.generated.ts` (via `@/shared/types`). Never hand-write API shapes.
- **Shared view types** — hand-written filter state, navigation models, and other types used across layers.

A file must not mix the two: a file importing the generated `components` type may only contain type-alias declarations. Component-private view types don't live in `types/` at all — they go in a `types.ts` inside their composite folder (see Placement).

## Feature layers

Features are ranked in layers, and **a feature imports only from features on a lower layer**. Features on the same layer never import each other, and `shared/` imports no feature at all. So the import graph can't contain a cycle, and reading a feature never requires reading one above it.

| Layer | Features | Built from |
| --- | --- | --- |
| 6 | `search`, `site` | anything below: they aggregate |
| 5 | `teams`, `players` | the matches a profile is made of |
| 4 | `matches` | the pools and championships a match is played in |
| 3 | `competitions` | the leagues and committees that run them |
| 2 | `organizations` | regions, departments, site-wide counts |
| 1 | `geography`, `stats`, `shot-chart` | `shared/` only |

Pages (`app/`) sit above every layer and compose sections from any feature. When two features need to appear together, the page puts them side by side; neither feature imports the other.

- **Placement follows the data.** A component belongs to the feature whose data it draws. A list of a pool's matches is `matches` even when the championship page shows it; a team's match history, fetched from `/teams/:id/matches`, is `teams` even though it reuses `matches`' history table.
- **An upward import is a misplacement, not an exception.** It usually means a type or component lives in the wrong feature (`TeamInfo` described a match side and sat in `teams`) or that a component takes domain data where plain data would do (the shot chart takes `{ x, y, made }` points, not match events).
- Sub-features (`competitions/championships`, `organizations/clubs`) belong to their parent and import each other freely.
- A new feature gets a layer in `FEATURE_LAYERS` in `eslint.config.mjs`. Until it has one, every import from or into it fails lint.

## Barrels

- Barrel directories are defined once in the root `barrelsby.json`; the `enforce-barrel-import` ESLint rule derives its directory list from it, so the two can't drift. Regenerate barrels with `make barrels` / `npm run barrels` after adding files.
- Barrels are **curated**: they export page-consumed components and shared-layer artifacts. Composite-folder internals are excluded from barrel generation (exclusion patterns in `barrelsby.json`) and blocked from direct import by the `no-cross-composite-import` rule.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Component files | PascalCase `.tsx` | `MatchStatus.tsx` |
| Composite/section folders | kebab-case | `match-card/` |
| Hook files (everywhere, `api/` included) | camelCase `useX.ts(x)` | `useMatchesFilterState.ts`, `useTeams.ts` |
| Constants files | camelCase `.ts` | `eventColors.ts` |
| Utils files | camelCase `.ts` (`.tsx` allowed for JSX helpers) | `eventHelpers.ts` |
| Shared view types / API alias files | PascalCase `.ts` in `types/` | `MatchFilters.ts` |
| Component-private types | `types.ts` in the composite folder | `match-card/types.ts` |
| Tests | colocated `x.spec.ts`, beside the module | `shared/utils/teamName.spec.ts` |

Hooks that return JSX (e.g. table column factories) are `.tsx` but still follow `useX` naming and the placement rules above.

**Named exports only.** A module under `features/` or `shared/` exports `function X` by name and is imported as `{ X }` — never `export default`. One symbol then has one name at every import site, and the barrels (`export *`, which carries no default) publish everything a module exports. `app/` is the exception: Next requires a default export from a page, layout or route boundary. Enforced by a `no-restricted-syntax` selector in `eslint.config.mjs`.

## File layout

Every `.tsx` module under `features/` and `shared/` lays out its top-level statements in the same order, so a component opened at random reads the same way as any other:

```tsx
"use client";                              // 1. directive

import { useTranslations } from "next-intl"; // 2. imports

interface ChipOption { … }                 // 3. types other than props

const LABEL_KEYS = { … } as const;         // 4. constants

function toOption(…): ChipOption { … }     // 5. helpers (camelCase functions)

interface CategoryChipsProps { … }         // 6. components, each props interface
export function CategoryChips(…) { … }     //    directly above its component

export { ChipLegend } from "./ChipLegend"; // 7. trailing exports (re-exports)
```

Every section is optional. Each one holds what the sections below it use, so a file reads top to bottom from its vocabulary to the component built from it.

- **Props sit against their component.** `XProps` is immediately followed by `X`, so the contract is next to the function that destructures it, and a file with several components pairs each one with its props. A `*Props` type with no component of that name in the file — a building block of another props type, like `MatchupBaseProps` — is an ordinary type and goes in section 3.
- **Sub-components above the component that renders them.** A private component comes before the exported one, in the same dependency order as the sections.
- **Single-consumer constants stay here.** A lookup table only this component reads — `LABEL_KEYS` in `EventCategoryChips` — lives in the component's file, in section 4; see [Placement](#placement-shared-vs-component-private) for when it moves up.

Route modules under `app/` are out of scope: their shape comes from Next's segment exports (`revalidate`, `generateMetadata`), not from this layout. Enforced by `enforce-component-file-layout`.

## Props

A component's props are a **named, local `interface`**, one per component, called `<Component>Props`.

```tsx
interface BaselineProps {
  /** Chart width in SVG pixels; also scales the stroke. */
  readonly svgWidth: number;
  /** Vertical position, already in SVG pixels — the caller applies `yScale`. */
  readonly y: number;
}

/**
 * The baseline — the court's far edge, spanning the full chart width.
 */
export function Baseline({ svgWidth, y }: BaselineProps) { … }
```

Three separate decisions, with different authorities behind them:

- **`interface`, not `type`.** The TypeScript handbook's own heuristic: *"use `interface` until you need to use features from `type`"*, and interfaces with `extends` are cheaper for the compiler than intersections. Enforced by `@typescript-eslint/consistent-type-definitions`. Reach for `type` only when you need a union, a primitive, or a mapped type — at which point it is no longer a props object.
- **Named, not inline — and this one is ours, not React's.** react.dev shows the inline form first and only suggests naming it *"once you start to have a few fields to describe"*. That is a threshold, and we have chosen uniformity instead: even two props get a name. A name is what a type error quotes, what an editor shows at a call site, and the only place a per-prop doc comment can live — see [Docstrings](#docstrings), which routes prop documentation to interface members. Enforced by `enforce-named-props`.
- **Local, not exported.** Export a props interface only when another component genuinely composes it. Publishing one widens a surface for no consumer, and every court component that exported its props had no importer at all.

Members are `readonly` and carry their own doc comment where they have anything to say. What they should say is the unit, the coordinate space, the sentinel — whatever the type cannot express:

```tsx
/** Tick heights in **court units** — unlike the `_px` props above, these go through `yScale`. */
readonly tickYs: number[];
```

**Never `@param` on the interface.** Those tags belong to functions; on a type declaration they document nothing, render nowhere, and drift from the members beside them. No rule catches this — `check-param-names` validates tags only against a *function's* parameters — so it is on review.

**`React.FC` is not required and not preferred.** react.dev models plain function declarations throughout and never mentions it; the community position is that it is "not needed" since `@types/react` 18 dropped its implicit `children`. It remains in use here and is not worth a sweep of its own, but new components take the plain form.

## Comments

> Scope: unlike the rest of this document, this section governs **all of `src/frontend`** — `app/`, `features/` and `shared/` alike.

**A comment must say something the reader cannot get from the line beneath it.** That is the whole test, and it is applied to the *pair* — the comment together with what it sits above — never to the comment alone. Judging comments by reading a list of them is what lets a restatement pass.

### The next-line test

| The next line is… | The comment is… | |
| --- | --- | --- |
| a named component or element whose name already contains the comment's content | a restatement | **delete** |
| opaque — a raw SVG/DOM element, an expression, a prop whose value is defined elsewhere | the only thing naming it | **keep** |

```tsx
{/* Player Header */}                 // delete — the name is the comment
<PlayerHeader player={player} />

{/* Division → Pool → Matchday */}    // keep — `cascadeSteps` hides the chain
<CascadeSelects steps={cascadeSteps} />

{/* Free-throw semi-circle */}        // keep — nothing else says what this path draws
<path d={arc()({ startAngle: -Math.PI / 2, … })} />
```

A comment that documents the *child's* internals belongs in the child, not at the call site. `{/* Player Shot Chart Hotspots */}` over `<PlayerShotChart />` names a `ChartType` the page never passes and cannot see; it goes stale the moment the child changes, and the page has no say in it.

### What always earns a comment

A comment stating a **constraint** rather than an identity, because a constraint is invisible in the code that satisfies it:

- **an ordering that must hold** — SVG paints in document order, so overlays precede court lines or the lines are buried under them
- **why a value is that value** — `revalidate = 60` because every fetch in the route is `ServerRevalidate.LIVE` and the lowest in a route wins
- **a trap** — a hook that still exists but has no call sites and must not be reintroduced
- **a decision that looks like a mistake** — answering 200 with an error card rather than 500

### Comments say what is true now

Never write how the code got here; `git log` holds that, and a comment describing a former state reads as current the moment its context is gone.

```
// 60s, not the hour this once declared — so 60 has always been what was in force   ← no
// 60s because every fetch here is `ServerRevalidate.LIVE`, and the lowest wins      ← yes
```

The same applies to explanatory prose in `docs/`: state the rule, not the history of the rule.

### A comment can be a symptom

Two cases where the fix is code rather than prose. Both are rules stated elsewhere; this is where they surface:

- **The comment is a better name than the name** — rename it. See `naming.md`: *a name that needs a comment to explain it is the wrong name*.
- **The comment marks where one section ends and the next begins** — extract a component. `component-decomposition.md` lists exactly that as a split trigger. `{/* Features Grid */}` above a raw `<div className="grid …">` is naming the component that should exist.

Section labels therefore never survive on their own terms: if the section deserves a name it becomes a component, and if it does not, the label was noise. The exception is a comment that groups *several* siblings under a constraint they share — that is an ordering or layout fact, not a label.

### Docstrings

The **prose** of a doc comment is held to everything above — it must say what the declaration does not. The **tags** are not: they are structure, and structure repeats by design. `@param items - the collection to bucket` is worth writing beside `items: T[]`, because the type gives a shape and the tag gives a role, and an editor renders them in separate places. Do not strip a `@param` for "restating" the signature; strip one that restates the *type*.

Rules specific to the form:

- **Types belong to TypeScript.** Never `@param {string} name`. The signature already carries the shape, and a copy of it in prose drifts independently. Document meaning, units and constraints; leave the type to the compiler.
- **The description is the free text at the top, never a tag.** TSDoc — which TypeScript's tooling follows — standardises 24 tags and `@description` is not among them: *"any content appearing prior to the first block tag is interpreted as the special summary section."* `@description`/`@desc` are JSDoc aliases for a case that does not arise here, and using one leaves the summary section empty while the prose renders as a trailing footnote. Note that `shared/types/api.generated.ts` contains 613 of them — that is `openapi-typescript` mapping the OpenAPI `description` field mechanically, not a convention to copy.
- **`@example` must show what the signature does not.** `getByChampionshipId(5)` above `getByChampionshipId(championshipId: number): Promise<Pool[]>` restates it. An example earns its place for usage that is genuinely non-obvious — an options object with interacting fields, a factory whose result is passed somewhere particular, a required call order.
- **Nothing verifies an example.** TypeScript does not typecheck code inside comments and no test runs one, so an example is prose shaped like code and rots in silence. Write real import paths, and prefer pointing at an existing call site over inventing a snippet.
- **`@param` and `@returns` are mandatory on non-component declarations**, each with a description. `jsdoc/require-param`, `require-returns` and their `-description` variants enforce this over `.ts`/`.mts`; `.tsx` is exempt because a component's single destructured props object and its JSX return are both meaningless as tags. A `@returns` earns its place by naming what the value *means* at the edges — the sentinel, the empty case, the `null` — not by repeating the return type.
- **`@param` for functions; interface members for props.** A component takes one parameter — a props object — so `@param props` says nothing and `@param name` names a destructured member TSDoc does not model. Document a prop on its own member instead, which is what an editor surfaces when you hover the attribute at a JSX call site; `TableColumn<T>` in `shared/components/table/DataTable.tsx` is the pattern. Reserve `@param` for ordinary functions, where it documents a real parameter.

**Every exported declaration carries one.** That is settled — the judgement is not whether to write a docstring but what it says, and the failure mode is a *restating* one: `/** Card showing a club. */` above `ClubCard` is a label in a different syntax and costs a reader the same as any other noise.

So write the **contract** rather than the summary. What does it really accept? What does it do with input it does not recognise? What must a caller handle? Lead with a constraint that cannot be seen from the outside whenever there is one:

- **a closed variant API** — the component takes no `className`, so "make it look different" means adding a variant, and nothing in the signature says so
- **props that interact** — `getRowHref` cannot combine with `wrap={false}`; one prop changing another's meaning is invisible per-prop
- **a constraint the name does not carry** — a sheet whose open state is its mounted state, an icon slot that must stay non-interactive
- **a boundary** — why this is `'use client'`, what must not cross into it, what is lazily loaded
- **an edge** — the value returned for an unrecognised input, a hard limit, an index base, a silent fallback

A declaration with no interesting edges still has a contract; a fifteen-line switch has one in its `default` arm. If nothing survives that question, the reading was too shallow, not the declaration too simple.

And a constraint documented in `docs/` but not on the component is documented where nobody will meet it: the docstring is what an editor shows at the import.

## Tests

Tests are **Vitest**, run by `npm run test` and by the `frontend-test` CI job. Each is a `*.spec.ts` colocated with the module it tests, mirroring the backend, and runs in the `node` environment (`vitest.config.ts`): there is no DOM and no JSX transform, so what gets tested is **pure TypeScript** — the data derivations, geometry and rules that components call (`matchWinner`, `shotSummary`, the shot-zone predicates). That is one more reason to split along [When to split](#when-to-split): logic moved out of a component into a `.ts` module becomes testable.

`styles/contrast.spec.ts` is the one test over the stylesheet rather than code: it reads every colour token in the three themes and fails CI on any promised text/background pair below its WCAG floor. See the design system section of [`frontend.md`](./frontend.md#design-system).

Spec files are excluded from barrel generation and from Sonar coverage sources.

---

## Enforcement

Custom ESLint rules in `src/frontend/eslint-rules/`, wired in `eslint.config.mjs` at **error** severity:

| Rule | Enforces |
| --- | --- |
| `enforce-component-folder-structure` | `index.tsx` composite roots, no `_` prefixes, kebab-case folders, depth ≤ 3, no `utils/`/`types/`/`hooks/` dirs under `components/`, colocated files only inside composite folders |
| `enforce-file-naming` | camelCase `useX` hook filenames (including `api/`), camelCase constants/utils filenames |
| `no-cross-composite-import` | Composite folders are only imported via their folder path (`index.tsx`) |
| `no-mixed-type-file` | `types/` files are purely generated-alias or purely hand-written |
| `enforce-barrel-import` | Imports go through barrels; directory list derived from `barrelsby.json` |
| `enforce-file-path-comment` | Every file starts with its own path comment (autofixable) |
| `no-translator-prop` | The next-intl translator is never typed as a value or passed as a prop |
| `enforce-named-props` | Component props are a named interface, not an inline object type |
| `enforce-component-file-layout` | A `.tsx` module's top-level statements follow the [file layout](#file-layout); each `XProps` sits directly above `X` |
| `enforce-feature-layers` | A feature imports only from lower [feature layers](#feature-layers); `shared/` imports no feature |

Three upstream rules carry conventions of their own: `no-restricted-syntax` (no `export default` outside `app/`, see [Naming](#naming)), `@typescript-eslint/consistent-type-definitions` (`interface` over `type`, see [Props](#props)) and the `jsdoc/*` set described under [Docstrings](#docstrings) — `require-jsdoc`, `require-param`, `require-returns`, their `-description` variants, `check-param-names`, `check-tag-names` and `no-types`, all at **error**.

**[Comments](#comments) is review-enforced**, and so is the ban on `@param` tags sitting on a props interface. No rule covers either. Review it by reading each comment against the line beneath it — a review that reads comments as a *list* will pass restatements, because a label only looks redundant next to the thing it labels.

**Migration ratchet**: features that predate these conventions are listed in the `LEGACY_FEATURES` allowlist in `eslint.config.mjs`, which disables the structure rules for them. Each migration PR restructures one feature and removes it from the list; an empty list means the migration is complete. Do not add new entries.

### New-component checklist

1. Single file or composite? Split by responsibility (see [When to split](#when-to-split)); only create a folder if the component has private sub-parts; root is `index.tsx`.
2. Does it draw a club, team, match, side or event? Use the shared domain component (see [The basketball vocabulary](#the-basketball-vocabulary)).
3. Place hooks/types/helpers by consumer count: one composite → colocate inside it; two+ consumers (or pages/api) → feature-level directory.
4. Respect the depth cap (≤ 3 below `components/`) — flatten with name prefixes instead of nesting deeper.
5. New barrel-worthy directory? Add it to `barrelsby.json` (the ESLint barrel rule follows automatically); composite internals get an exclusion pattern.
6. Strings: resolve the component's own vocabulary inside it (`useTranslations` / `await getTranslations`), and take the caller's content as plain `string` props. Never accept the translator itself as a prop — `no-translator-prop` enforces that half; which side a given string falls on is a judgement call, described under [Internationalisation](./frontend.md#internationalisation) in `frontend.md`.
7. Props: a local `interface <Component>Props`, members `readonly` and documented where they carry a unit, a coordinate space or a sentinel. See [Props](#props).
8. Layout: directive, imports, types, constants, helpers, then each component under its props, then trailing exports. See [File layout](#file-layout).
9. Comments: read each one against the line below it, not on its own. Delete restatements; keep constraints. If a comment names a section, extract the section instead. See [Comments](#comments).
10. Run `npm run lint` — the rules above catch the rest.
