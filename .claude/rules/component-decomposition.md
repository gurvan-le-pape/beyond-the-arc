---
description: Two component layers — hand-rolled shared primitives and feature components — and when to promote between them.
paths:
  - "src/frontend/**/*.tsx"
---

# Component decomposition

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice · `[project]` = a project convention stated directly by the maintainer.

**Applies to:** `src/frontend`.

## Two layers, one rule each

| layer | owns | must not |
|---|---|---|
| **shared primitives** (hand-rolled, not shadcn/ui) `[project]` | look, feel, focus behaviour, ARIA plumbing | know any feature, fetch data, hold message keys |
| **feature components** (`features/<feature>/components/`) `[project]` | data, copy, behaviour, composition | reimplement a primitive |

- A primitive is describable without naming a feature. If its doc sentence needs a domain noun, it is a feature component in the wrong directory. `[principle]`
- A primitive accepts `className` and merges it with `cn`, or callers cannot adapt it and will fork it instead. See `frontend-styling.md`. `[project]`+`[principle]`
- **Exception: a component whose presentation is a *closed* set of typed variants takes no `className` at all** — not on itself, not on its parts. A look the variant API cannot express is a request for a new named variant, reviewed once, rather than a class string written at a call site. The escape hatch is precisely what fails here: given one, callers use it, and a family of components that should look identical accumulates several framings nobody chose. Closing the API is the load-bearing decision; the absent `className` is its consequence, not an oversight — so do not "fix" a primitive by adding one back. `[project]`+`[principle]`
- Primitives take no message keys and call no translation hook. Copy is passed in, so the same primitive serves every locale and every caller. See `frontend-i18n.md`. `[project]`+`[principle]`
- Feature components compose primitives; they do not restyle them from the outside with deep selectors or `!important`. If a primitive cannot express what a feature needs, add a variant to the primitive. `[principle]`

## Promotion

- **Promote to the primitives layer on the third real use**, not the first anticipated one. Two call sites is a coincidence; three is a pattern. `[principle]`
- Promote only what survives the naming test above. A "WidgetCard" that gets renamed "Card" and loses half its props during promotion was worth promoting; one that keeps its feature-shaped props was not. `[principle]`
- **The primitives here are hand-rolled, so they are yours to change — which also means every change is a breaking change to every consumer**, with no upstream to absorb it. Keep the prop API narrow: fewer, more orthogonal props age far better than a wide one you can never remove from. `[project]`+`[principle]`
- Adding a variant is cheap; adding a boolean prop that interacts with three other boolean props is not. Use `cva` variants rather than boolean explosion. See `frontend-styling.md`. `[manifest]`+`[principle]`

```tsx
// primitive — generic, no data, no copy, merges className
export function Callout({ tone, className, children }: CalloutProps) {
  return <div className={cn(callout({ tone }), className)}>{children}</div>;
}

// feature component — owns the copy and the data
export function WidgetLimitNotice({ remaining }: { remaining: number }) {
  const t = useTranslations('widgets.limits');
  return <Callout tone="accent">{t('remaining', { count: remaining })}</Callout>;
}
```

## Server and client

- Server Components by default; `'use client'` only for state, effects, browser APIs, or event handlers, and pushed to the leaves. See `frontend-nextjs.md`. `[upstream]`
- **A `'use client'` primitive drags every consumer's subtree into the client bundle.** Keep primitives server-compatible unless they genuinely need interactivity, and split the interactive part out rather than marking the whole thing. `[upstream]`+`[principle]`
- Props crossing the server→client boundary must be serialisable — plain objects and primitives, not class instances or functions. `[upstream]`
- Heavy client-only components — the map, charts, anything pulling `maplibre-gl` or `d3` — are isolated behind their own boundary and lazily loaded, so pages that do not show them do not pay for them. See `frontend-maps-and-dataviz.md`. `[manifest]`+`[principle]`

## When to split

Split on **responsibility**, not on line count. A 200-line component doing one thing is fine; a 60-line one doing three is not. `[principle]`

Concrete triggers: `[principle]`

- The component both fetches/derives data **and** renders non-trivial UI — separate the hook from the view. `[principle]`
- A chunk of JSX is reused, or is about to be. `[principle]`
- Conditional rendering nests more than two levels deep — extract the branches. `[principle]`
- You need a comment to mark where one section ends and the next begins. `[principle]`
- Two parts of the component re-render for unrelated reasons. `[principle]`

Do **not** split when: `[principle]`

- The extracted piece is used exactly once and only shortens the parent. That is indirection, not decomposition. `[principle]`
- The split forces you to thread five props through a component that does nothing with four of them. `[principle]`
- The only motivation is a line-count threshold. `[principle]`

## Props and state

- Prefer explicit props over passing a whole domain object into a presentational component. `{ name, count }` is testable and reusable; `{ widget }` couples the component to a shape it does not control. `[principle]`
- State lives at the lowest common ancestor that needs it. Lifting state "just in case" makes every sibling re-render. `[principle]`
- Server state belongs to TanStack Query, not to `useState` mirrors of it. Copying query data into local state creates two sources of truth that drift. See `frontend-data-fetching.md`. `[manifest]`+`[principle]`
- Derive during render rather than syncing with an effect. An effect that sets state from props is nearly always a computed value in disguise. `[principle]`
- Key list items by a stable id, never by array index. `[principle]`

## Accessibility

- **Primitives own focus management and ARIA wiring** — that is a large part of why the layer exists. A feature component should not be re-deriving keyboard behaviour for a dialog. `[project]`+`[principle]`
- `eslint-plugin-jsx-a11y` is installed and will catch a share of this. It is a floor, not a ceiling — it cannot tell you a focus order is nonsense. `[manifest]`+`[principle]`
- Accessible names are user-facing text: `aria-label`, `alt`, and `title` come from the message catalogue, passed in by the feature component. See `frontend-i18n.md`. `[principle]`
- Every interactive element has a visible focus state. `[principle]`

> Before adding a primitive, find the ones that already exist and match their prop-API conventions. The third use of a pattern is often already the fourth.
