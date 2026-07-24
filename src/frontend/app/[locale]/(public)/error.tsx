// src/frontend/app/[locale]/(public)/error.tsx
"use client";

import { RouteErrorBoundary } from "@/shared/components/feedback";

export default function PublicError({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  return <RouteErrorBoundary error={error} retry={unstable_retry} />;
}
