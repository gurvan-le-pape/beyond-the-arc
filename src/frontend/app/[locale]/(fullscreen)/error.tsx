// src/frontend/app/[locale]/(fullscreen)/error.tsx
"use client";

import { RouteErrorBoundary } from "@/shared/components/feedback";

/**
 * Boundary for the full-viewport routes. Without one of their own, this group
 * falls through to `app/global-error.tsx`, which replaces the whole document.
 *
 * Same scope caveat as the `(chrome)` boundary: a server render that throws
 * before any HTML is flushed still produces the `global-error` page.
 */
export default function FullscreenError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return <RouteErrorBoundary error={error} retry={reset} />;
}
