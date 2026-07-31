---
description: Tailwind v3 (not v4), clsx / tailwind-merge / cva, and theming.
paths:
  - "src/frontend/**/*.tsx"
  - "src/frontend/styles/**"
  - "src/frontend/tailwind.config.js"
  - "src/frontend/postcss.config.js"
---

# Frontend — styling

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/frontend`. **Locked:** `tailwindcss@3.4.19`, `postcss@8.5.14`, `autoprefixer@10.5.0`, `clsx@2.1.1`, `tailwind-merge@3.6.0`, `class-variance-authority@0.7.1`, `next-themes@0.4.6`, `lucide-react@0.563.0`. `[manifest]`

## This is Tailwind v3, not v4

The manifest is unambiguous: `tailwindcss@3.4.19`, with `postcss` and `autoprefixer` as separate plugins. Most Tailwind material you will encounter now describes v4, and v4 syntax silently does nothing in v3. `[manifest]`+`[upstream]`

**The v3 way — correct here:** `[upstream]`

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```js
// postcss.config.js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

Theme customisation lives in `tailwind.config.js` under `theme.extend`. `[upstream]`

**v4-only — do not use here:** `[upstream]`

- `@import "tailwindcss"` in place of the `@tailwind` directives `[upstream]`
- the `@theme { --color-… }` CSS-first config block `[upstream]`
- the `@tailwindcss/postcss` package `[upstream]`
- `@config "./tailwind.config.js"` `[upstream]`

**Utility names also differ between the majors.** In v3, `shadow-sm`/`shadow`, `rounded-sm`/`rounded`, `blur-sm`, `ring`, `outline-none`, `bg-opacity-*`, `flex-shrink-*`, `flex-grow-*`, and `overflow-ellipsis` are all valid. v4 renames or removes every one of them. Writing v4 names here produces a class that simply does not exist — no error, no style. `[upstream]`

- The `!important` modifier is a **prefix** in v3 (`!flex`), a suffix in v4 (`flex!`). `[upstream]`
- If a class you expect has no visual effect, check whether you wrote the v4 name before debugging anything else. `[upstream]`+`[principle]`

## Composing classes

Three libraries, three distinct jobs — do not substitute one for another: `[manifest]`+`[principle]`

- **`clsx`** — conditional class inclusion. `[manifest]`
- **`tailwind-merge`** — resolves conflicting Tailwind utilities so the *last* one wins (`px-2 px-4` → `px-4`). Plain string concatenation does not; both classes land in the DOM and CSS source order decides, unpredictably. `[manifest]`+`[principle]`
- **`class-variance-authority`** — declares a component's variant API. `[manifest]`

The standard composition, defined **once** and imported everywhere: `[principle]`

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- Any component accepting a `className` prop must merge it with `cn`, or callers cannot override its styling. `[principle]`
- Use `cva` for components with more than one or two style axes; put the variants in one place rather than scattering ternaries through JSX. `[manifest]`+`[principle]`

```ts
const widget = cva('rounded border', {
  variants: {
    tone: { neutral: 'bg-white', accent: 'bg-blue-600 text-white' },
    size: { sm: 'px-2 py-1 text-sm', md: 'px-4 py-2' },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
});
```

- If `tailwind-merge` fails to deduplicate a custom utility you added to `tailwind.config.js`, it needs configuring via `extendTailwindMerge` — do not work around it with `!important`. `[principle]`

## Class names must be statically visible

- Tailwind v3 scans source files for **complete, literal** class strings. `` `text-${tone}-500` `` will not be generated. Map to whole class names instead: `[upstream]`+`[principle]`

  ```ts
  const toneClass = { neutral: 'text-slate-500', accent: 'text-blue-500' }[tone];
  ```
- The same constraint governs `tailwind.config.js`'s `content` globs: a directory that is not listed produces no classes. Adding a new source directory means updating `content`. `[upstream]`

## Theming

- `next-themes` owns light/dark. Read the theme through its hook; do not read or write the theme class or `localStorage` directly. `[manifest]`+`[principle]`
- Style dark mode with Tailwind's `dark:` variant, which requires `darkMode: 'class'` in the v3 config to work with `next-themes`. `[upstream]`+`[principle]`
- Reading the theme on first client render causes hydration mismatch — gate theme-dependent markup on a mounted flag, or render both and let CSS choose. `[principle]`

## General

- Prefer utilities in the markup over a parallel stylesheet. One place to look beats two that can disagree. `[principle]`
- Reach for `@apply` rarely; it recreates the CSS-abstraction problems Tailwind exists to avoid. A repeated pattern is a component, not a class. `[principle]`
- Icons come from `lucide-react` — import the specific icon, never the whole package. `[manifest]`+`[principle]`
- Interactive elements need visible focus states. Do not use `outline-none` without supplying a replacement focus ring. `[principle]`

The `cn` helper already exists at `shared/utils/cn.ts` — import it, never re-create it. `tailwind.config.js` defines semantic token groups (`surface`, `divide`, `text`, `primary`, `secondary`, `success`, `error`, `warning`, `info`) alongside domain-specific colour scales. **Use the semantic tokens; do not write raw palette values or hex codes in components** — raw values don't flip with the theme and are invisible to a future token change. Read the config for the current set before reaching for one. `[project]`
