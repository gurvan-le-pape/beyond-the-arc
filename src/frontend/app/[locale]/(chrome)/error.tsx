// src/frontend/app/[locale]/(chrome)/error.tsx
"use client";

import { RouteErrorBoundary } from "@/shared/components/feedback";

/**
 * Catch-all boundary for the chrome routes — home, about, contact, features,
 * architecture, docs, and anything under `(public)` that has no closer
 * boundary of its own. It renders inside `(chrome)/layout.tsx`, so the header,
 * footer and page background survive the error.
 *
 * Scope worth knowing: this catches client-side navigations into these routes
 * and errors thrown while rendering their client components. A server render
 * that throws before any HTML is flushed still produces the whole-document
 * `global-error` page — no `error.tsx` can intercept that, and the nested
 * `(public)` boundary behaves the same way. Flushing a shell first (a
 * `<Suspense>` boundary above the data fetch) is what would change that.
 */
export default function ChromeError({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  return <RouteErrorBoundary error={error} retry={unstable_retry} />;
}
