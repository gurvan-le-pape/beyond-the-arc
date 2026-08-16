// src/frontend/shared/types/css.d.ts

/**
 * Declares stylesheets as valid side-effect imports.
 *
 * TypeScript 6.0 turns `noUncheckedSideEffectImports` on by default: a bare
 * `import "…"` whose target has no type declarations is an error (TS2882),
 * because the usual cause is a typo'd module specifier that silently does
 * nothing. A stylesheet is the legitimate exception — it is imported purely so
 * the bundler emits it, and it has no types to find.
 *
 * Without this the option had to be switched off for the whole project, which
 * bought five CSS lines at the cost of the check on every other side-effect
 * import in the app. This buys the same five lines and keeps the check.
 *
 * The wildcard covers both shapes in use: path-aliased project styles
 * (`@/styles/globals.css`) and stylesheets shipped inside a package
 * (`maplibre-gl/dist/maplibre-gl.css`).
 *
 * **What the wildcard cannot see, and why that is fine.** `*.css` matches any
 * specifier ending in `.css`, existing or not, so a typo'd stylesheet path
 * type-checks clean. Measured rather than assumed: with a planted
 * `@/styles/typo-does-not-exist.css`, `tsc` reports nothing and `next build`
 * fails with `Module not found: Can't resolve …` and exit 1. The bundler — and
 * therefore CI's `Frontend – Build` job — is the check for that class, one step
 * later and just as loud. Declaring each stylesheet individually would close
 * the hole in `tsc` at the price of a file nobody remembers to update.
 *
 * Deliberately no exported shape. CSS Modules would need
 * `const classes: Record<string, string>; export default classes;` — this
 * project imports stylesheets only for their side effect, and declaring an
 * export that nothing provides would invite `import styles from "./x.css"` to
 * type-check and then be `undefined` at runtime.
 */
declare module "*.css";
