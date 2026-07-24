// src/frontend/app/[locale]/error.tsx
"use client";

import { RouteErrorBoundary } from "@/shared/components/feedback";

/**
 * Covers the routes that sit directly under `[locale]` — home, about, contact,
 * features, architecture and docs — which until now had no boundary of their
 * own and fell through to `app/global-error.tsx`.
 *
 * Scope worth knowing: this catches client-side navigations into these routes
 * and errors thrown while rendering their client components. A server render
 * that throws before any HTML is flushed still produces the whole-document
 * `global-error` page — no `error.tsx` can intercept that, and the existing
 * `(public)` boundary behaves the same way. Flushing a shell first (a
 * `<Suspense>` boundary above the data fetch) is what would change that.
 */
export default function LocaleError({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  return <RouteErrorBoundary error={error} retry={unstable_retry} />;
}
