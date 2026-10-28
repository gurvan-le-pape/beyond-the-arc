// src/frontend/shared/components/feedback/ServerErrorState.tsx
"use client";

import { useTranslations } from "next-intl";

import { PageLayout } from "@/shared/components/layout";

import { ErrorCard } from "./ErrorCard";

/**
 * What a server render falls back to when a data fetch fails with anything
 * other than a 404 — the server-side counterpart of `RouteErrorBoundary`,
 * rendered by `withServerErrorState`.
 *
 * **Why this exists rather than an `error.tsx`.** Next's `error.tsx` boundary is
 * a React class component, and Fizz never calls `getDerivedStateFromError`, so
 * no `error.tsx` can catch a throw that happens while the server is rendering
 * the shell. The document that reaches the wire in that case is empty. Clients
 * with JavaScript recover on hydration and do render the boundary — the error
 * copy travels in the flight payload — but a no-JS client or a crawler gets the
 * blank page, and everyone sees it flash first.
 *
 * **A client component on purpose**, for the same reason `RouteNotFound` is one:
 * `useTranslations` reads from the provider, while an async server component
 * calling `getTranslations()` reaches for `headers()` and takes static rendering
 * down with it. `"use client"` marks the hydration boundary; the HTML is still
 * produced on the server, which is the entire point here.
 *
 * The retry reloads rather than calling the boundary's `reset`: the failure
 * happened during the server render, so re-running it is a fresh request. It is
 * the one part of this that needs JavaScript, and it degrades to a card with no
 * button rather than to a blank page.
 */
export function ServerErrorState() {
  const tCommon = useTranslations("common");

  return (
    <>
      {/*
       * React 19 hoists this into <head> from wherever it is rendered, which is
       * what lets one component cover both failure shapes: `generateMetadata`
       * throwing (its wrapper returns no metadata at all) and the page body
       * throwing after metadata already resolved successfully. A page that is
       * only an error should never be what a crawler has on file for the URL.
       */}
      <meta name="robots" content="noindex" />

      <PageLayout centered>
        <ErrorCard
          title={tCommon("errors.unexpected")}
          description={tCommon("errors.unexpectedDescription")}
          action={{
            label: tCommon("retry"),
            onClick: () => window.location.reload(),
          }}
        />
      </PageLayout>
    </>
  );
}

export default ServerErrorState;
