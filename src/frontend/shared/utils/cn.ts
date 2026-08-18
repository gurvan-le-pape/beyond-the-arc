// src/frontend/shared/utils/cn.ts
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge knows Tailwind's own scales and nothing else, so every custom
 * key in `tailwind.config.js` was invisible to it: `rounded-card`,
 * `shadow-card`, `animate-fade-in`, `w-panel` and their siblings were treated
 * as unrelated classes and never deduplicated. Measured on the installed
 * 3.6.0, **16 of 22** conflict cases came out with both classes still in the
 * string, which leaves CSS source order to decide the winner — an ordering
 * nobody chose and that flips as the generated stylesheet changes.
 *
 * These are the *theme scales*, not individual class groups, which is what
 * makes the fix cover everything derived from them: extending `spacing` fixes
 * `w-`, `h-`, `p-`, `gap-`, `max-w-` and the rest in one line, and extending
 * `radius` fixes `rounded-t-card` as well as `rounded-card`.
 *
 * Colours needed nothing — tailwind-merge's colour groups accept any trailing
 * segment, which is why this stayed invisible for so long.
 *
 * **Adding a scale key to `tailwind.config.js` means adding it here.** The
 * four lists below mirror `theme.extend.borderRadius`, `.boxShadow`,
 * `.animation` and `.spacing` exactly; `fontSize` and `fontWeight` need no
 * entry because they override Tailwind's own keys rather than adding new ones.
 */
/**
 * **tailwind-merge is a major ahead of Tailwind here, deliberately.** The
 * installed 3.6.0 targets Tailwind v4 — its default config carries v4-only
 * class groups (`text-shadow`, `inset-shadow`, `drop-shadow-color`) — while
 * this project is on `tailwindcss@3.4.19`. The 2.x line is the one that
 * targets v3.
 *
 * That mismatch matters because its failure mode is silent: a class whose
 * grouping changed between the majors would leave *both* classes in the string
 * and let CSS source order decide, exactly as the custom-key bug above did.
 *
 * So it was measured rather than assumed. Every class-like token in the
 * codebase (1,180 after filtering) was bucketed by utility prefix and every
 * same-prefix pair (2,026) merged under both 3.6.0 and 2.6.1: **zero
 * disagreements**. The harness is not vacuous — it detects a real one,
 * `outline-none` + `outline-hidden`, which 3.x collapses (v4 renamed the
 * utility) and 2.x keeps. The project uses `outline-none` in 41 places and
 * `outline-hidden` in none, so the pair cannot arise.
 *
 * Conclusion: stay on 3.x. Re-run that differential before adopting a class
 * from a v3/v4 rename pair (`bg-gradient-*`/`bg-linear-*`, `shadow-sm`/
 * `shadow-xs`, `blur-sm`/`blur-xs`, `outline-none`/`outline-hidden`), and
 * revisit the whole question when the project moves to Tailwind v4.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["card", "button", "input"],
      shadow: ["card", "card-hover"],
      animate: ["fade-in", "slide-up", "slide-down"],
      spacing: ["sidebar", "panel", "panel-lg", "panel-xl"],
    },
  },
});

/**
 * Combines class names with clsx and merges Tailwind classes with tailwind-merge
 *
 * Benefits:
 * - Handles conditional classes
 * - Resolves Tailwind class conflicts (last one wins)
 * - Type-safe with TypeScript
 *
 * @example
 * cn('px-4', 'py-2', condition && 'bg-blue-500')
 * cn('px-4', 'px-6')                 // px-6 wins
 * cn('rounded-button', 'rounded-full') // rounded-full wins — see above
 *
 * @param inputs - class values in cascade order — a later conflicting utility wins
 * @returns one merged class string, deduplicated by Tailwind group
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
