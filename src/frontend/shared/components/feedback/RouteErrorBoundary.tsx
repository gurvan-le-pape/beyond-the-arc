// src/frontend/shared/components/feedback/RouteErrorBoundary.tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { PageLayout } from "@/shared/components/layout";

import { ErrorCard } from "./ErrorCard";

interface RouteErrorBoundaryProps {
  readonly error: Error & { digest?: string };
  readonly retry: () => void;
}

/**
 * Body shared by every `error.tsx` in the app: reports the error to Sentry and
 * renders a retry card inside the surrounding layout.
 *
 * Each route segment still needs its own `error.tsx` — Next only applies the
 * nearest one, and a segment without it falls through to `app/global-error.tsx`,
 * which replaces the whole document instead of rendering inside the layout.
 */
export function RouteErrorBoundary({ error, retry }: RouteErrorBoundaryProps) {
  const tCommon = useTranslations("common");

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <PageLayout centered>
      <ErrorCard
        title={tCommon("errors.unexpected")}
        description={tCommon("errors.unexpectedDescription")}
        action={{ label: tCommon("retry"), onClick: retry }}
      />
    </PageLayout>
  );
}
