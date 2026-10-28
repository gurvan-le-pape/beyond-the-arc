// src/frontend/i18n.ts
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { LOCALES } from "./locales";
import clubs from "./messages/en/clubs.json";
import common from "./messages/en/common.json";
import competitions from "./messages/en/competitions.json";
import filters from "./messages/en/filters.json";
import home from "./messages/en/home.json";
import landing from "./messages/en/landing.json";
import matches from "./messages/en/matches.json";
import navigation from "./messages/en/navigation.json";
import organizations from "./messages/en/organizations.json";
import players from "./messages/en/players.json";
import search from "./messages/en/search.json";
import teams from "./messages/en/teams.json";

/**
 * The `en` files are the reference shape for every locale.
 *
 * This object exists to give `Messages` a type — it is what `global.ts` hands
 * to next-intl's `AppConfig`, which turns the key argument of `t()` from
 * `string` into a union of the real message paths.
 *
 * Only `en` is typed. That every other locale defines the same keys is a
 * runtime property, enforced by `scripts/check-message-parity.mts` in CI,
 * because types generated from one locale cannot see cross-locale drift.
 */
const referenceMessages = {
  clubs,
  common,
  competitions,
  filters,
  home,
  landing,
  matches,
  navigation,
  organizations,
  players,
  search,
  teams,
};

export type Messages = typeof referenceMessages;

/**
 * Namespace names, derived from the reference messages rather than listed
 * separately, so that adding a `messages/en/*.json` file cannot leave the
 * loader and the types disagreeing.
 */
const namespaces = Object.keys(referenceMessages) as (keyof Messages)[];

// Read from the shared list rather than `routing`: importing routing here
// narrows the request config's `locale` to the routing union, which pulls in
// ~35 call sites. Widening to `string` keeps that boundary where it was while
// still having one definition of which locales exist.
const locales = new Set<string>(LOCALES);

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.has(locale)) {
    notFound(); // This will trigger Next.js 404 page
  }

  // Dynamically load all namespaces
  const messages = {} as Messages;

  await Promise.all(
    namespaces.map(async (namespace) => {
      const mod = await import(`./messages/${locale}/${namespace}.json`);
      messages[namespace] = mod.default;
    }),
  );

  return {
    locale,
    messages,
  };
});
