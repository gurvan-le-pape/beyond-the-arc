// src/frontend/locales.ts

/**
 * The locale set, defined once.
 *
 * `navigation.ts`'s routing config, `i18n.ts`, the `[locale]` layout and
 * `sitemap.ts` all derive from here rather than restating the set. Adding a
 * locale to some copies and not others fails loudly in some and silently in
 * others, which is the worst combination: the sitemap simply omits the new
 * locale and nothing reports it.
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
