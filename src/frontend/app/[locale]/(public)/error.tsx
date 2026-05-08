// src/frontend/app/[locale]/(public)/error.tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { PageLayout } from "@/shared/components/layout";
import { Button } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

export default function GlobalError({
  error,
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  const tCommon = useTranslations("common");

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <PageLayout centered>
      {/* Card sits on surface-base (page), so it uses surface-subtle */}
      <div className="bg-surface-subtle rounded-card border border-divide shadow-card p-10 max-w-md w-full text-center space-y-6 mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-subtle mx-auto">
          <svg
            className="w-8 h-8 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <Text variant="h1" className="text-xl">
            {tCommon("errors.unexpected")}
          </Text>
          <Text variant="caption">
            {tCommon("errors.unexpectedDescription")}
          </Text>
        </div>

        <Button onClick={unstable_retry}>{tCommon("retry")}</Button>
      </div>
    </PageLayout>
  );
}
