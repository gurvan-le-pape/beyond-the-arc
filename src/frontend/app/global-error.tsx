// src/frontend/app/global-error.tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
}

/**
 * The last-resort boundary, for a failure in the root layout itself.
 *
 * Because the root layout is what broke, this **renders its own `<html>` and
 * `<body>`** — nothing above it is available to supply them. That also means no
 * providers, no theme and no translations here, so the copy is deliberately
 * plain and English.
 *
 * Sentry is captured on mount because a failure this high never reaches the
 * server-side handler.
 */
export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
