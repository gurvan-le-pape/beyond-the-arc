// src/frontend/global.ts
import type { Messages } from "./i18n";

/**
 * Tells next-intl the shape of this app's messages.
 *
 * With this in place the key argument of `useTranslations`/`getTranslations`
 * stops being `string` and becomes a union of the real dot-paths, so a
 * misspelled or missing key fails `npm run typecheck` instead of raising
 * MISSING_MESSAGE in the browser — which is how the `category.Seniors` bug
 * reached production in #320.
 *
 * Cross-locale drift is a separate problem this cannot see, since `Messages`
 * is generated from `en` alone: `scripts/check-message-parity.mts` covers it.
 *
 * `AppConfig.Locale` is deliberately left unset for now — typing it narrows
 * `locale` from `string` to the routing union everywhere it is read from route
 * params, which is a further ~35 call sites and its own change.
 */
declare module "next-intl" {
  interface AppConfig {
    Messages: Messages;
  }
}
