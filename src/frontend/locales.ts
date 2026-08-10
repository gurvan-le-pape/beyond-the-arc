// src/frontend/locales.ts

/**
 * The locale set, defined once.
 *
 * It used to live in five places — `navigation.ts`'s routing config, a `Set` in
 * `i18n.ts`, an array in the `[locale]` layout, another in `sitemap.ts`, and a
 * regex alternation in the middleware matcher. Adding a locale to some of them
 * fails loudly and to others silently, which is the worst combination: the
 * sitemap simply omits the new locale and nothing reports it.
 *
 * This file has no imports on purpose. It is read by the Next.js runtime, by
 * the middleware, and by `scripts/check-message-parity.mts`, which Node runs
 * directly with type stripping and no `tsconfig` — so it must stay free of
 * path aliases and of anything that is not erasable.
 *
 * The one copy that cannot import this is the middleware `matcher`: Next
 * requires it to be statically analysable, so a computed value is ignored.
 * `check-message-parity.mts` asserts that the literal there lists exactly these
 * locales, which is what keeps the last copy honest.
 */
export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
