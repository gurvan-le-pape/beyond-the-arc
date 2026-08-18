// src/frontend/app/[locale]/(chrome)/(public)/error.tsx
"use client";

import { RouteErrorBoundary } from "@/shared/components/feedback";

/**
 * The error boundary for every public data page.
 *
 * Next renders this **instead of** the page, so the chrome around it comes from
 * the layout rather than from here. `unstable_retry` re-runs the failed segment
 * render; it is Next's own prop name, not ours.
 *
 * Only a throw during the *client* render reaches this. A server-render failure
 * is caught earlier by `withServerErrorState`, which is why both exist.
 */
export default function PublicError({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  return <RouteErrorBoundary error={error} retry={unstable_retry} />;
}
