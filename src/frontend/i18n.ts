// src/frontend/i18n.ts
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = new Set(["en", "fr"]);

// List of all your namespaces
const namespaces = [
  "common",
  "navigation",
  "competitions",
  "teams",
  "players",
  "matches",
  "clubs",
  "filters",
  "landing",
  "pool",
  "organizations",
  "search",
  "home",
];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.has(locale)) {
    notFound(); // This will trigger Next.js 404 page
  }

  // Dynamically load all namespaces
  const messages: Record<string, any> = {};

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
