// src/frontend/testing/renderWithIntl.tsx
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { render, type RenderResult } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";

import type { Locale } from "@/locales";

const MESSAGES_DIR = path.resolve(__dirname, "../messages");

/**
 * Every namespace of one locale, read from `messages/<locale>/*.json` — the
 * same files the app loads, so a test asserts on the copy a user sees.
 *
 * @param locale - the catalogue to read
 * @returns the namespaces keyed by file name
 */
function loadMessages(locale: Locale): Record<string, unknown> {
  const dir = path.join(MESSAGES_DIR, locale);
  return Object.fromEntries(
    readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => [
        path.basename(file, ".json"),
        JSON.parse(readFileSync(path.join(dir, file), "utf8")) as unknown,
      ]),
  );
}

/**
 * Renders `ui` inside a `NextIntlClientProvider` with the real catalogue.
 *
 * A missing or malformed message throws instead of rendering its key, so a
 * renamed key fails the test. The time zone is pinned so a date assertion
 * does not depend on the machine running it.
 *
 * @param ui - the element under test
 * @param locale - `en` unless the test is about the French copy
 * @returns Testing Library's render result
 */
export function renderWithIntl(
  ui: ReactElement,
  locale: Locale = "en",
): RenderResult {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={loadMessages(locale)}
      timeZone="Europe/Paris"
      onError={(error) => {
        throw error;
      }}
    >
      {ui}
    </NextIntlClientProvider>,
  );
}
