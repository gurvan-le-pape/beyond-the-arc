// src/frontend/shared/components/feedback/RouteNotFound.tsx
"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import { PageLayout } from "@/shared/components/layout";
import { navItems } from "@/shared/constants";

import { Text } from "../typography";
import { ErrorCard } from "./ErrorCard";

const SUGGESTIONS_HEADING_ID = "not-found-suggestions";

/**
 * Body shared by every `not-found.tsx` in the app: the translated 404 card, the
 * way home, and the main sections to try instead — a dead end is the one place
 * a reader most needs somewhere to go. The destinations are `navItems`, the
 * same list the header renders, so the 404 cannot drift out of step with the
 * navigation.
 *
 * **A client component on purpose.** Next renders a not-found boundary while
 * generating a route's static shell, so it runs in a static context, where
 * `getTranslations()` falls back to `headers()` and throws. The first version
 * of this UI was an async server component and took every route carrying
 * `revalidate` down with it — a 500 on each detail page, whether or not the id
 * existed. `useTranslations` reads from the provider and needs no request.
 *
 * Each route group still needs its own `not-found.tsx` pointing here: Next only
 * applies the nearest one, and sibling groups do not share boundaries.
 */
export function RouteNotFound() {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("navigation");

  return (
    <PageLayout centered>
      <ErrorCard
        tone="neutral"
        title={tCommon("errors.notFound")}
        description={tCommon("errors.notFoundDescription")}
        link={{ label: tCommon("backToHome"), href: "/" }}
      />

      <nav
        aria-labelledby={SUGGESTIONS_HEADING_ID}
        className="max-w-md w-full mx-auto text-center"
      >
        <Text id={SUGGESTIONS_HEADING_ID} variant="overline" as="h2">
          {tCommon("errors.notFoundSuggestions")}
        </Text>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-text-secondary underline underline-offset-4 transition-colors hover:text-text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-surface rounded-button"
              >
                {tNav(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageLayout>
  );
}

export default RouteNotFound;
