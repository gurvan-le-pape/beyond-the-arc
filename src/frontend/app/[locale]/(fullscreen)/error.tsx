// src/frontend/app/[locale]/(fullscreen)/error.tsx
"use client";

import { RouteErrorBoundary } from "@/shared/components/feedback";

/**
 * Boundary for the full-viewport routes. The map used to be covered by the
 * `(public)` boundary; moving it into its own group meant it would otherwise
 * fall through to `app/global-error.tsx`, which replaces the whole document.
 *
 * Same scope caveat as the `(chrome)` boundary: a server render that throws
 * before any HTML is flushed still produces the `global-error` page.
 */
export default function FullscreenError({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  return <RouteErrorBoundary error={error} retry={unstable_retry} />;
}
