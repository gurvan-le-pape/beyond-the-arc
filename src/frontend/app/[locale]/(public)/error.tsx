// src/frontend/app/[locale]/(public)/error.tsx
"use client";

import { useTranslations } from "next-intl";

import { PageLayout } from "@/shared/components/layout";
import { Button } from "@/shared/components/primitives";

export default function GlobalError({
  unstable_retry,
}: Readonly<{
  unstable_retry: () => void;
}>) {
  const tCommon = useTranslations("common");

  return (
    <PageLayout centered>
      {/* Card sits on surface-base (page), so it uses surface-subtle */}
      <div className="bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card dark:shadow-card-dark p-10 max-w-md w-full text-center space-y-6 mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-light/20 dark:bg-error-dark/20 mx-auto">
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
          <h1 className="text-xl font-bold text-text-heading dark:text-text-heading-dark">
            {tCommon("errors.unexpected")}
          </h1>
          <p className="text-sm text-text-body dark:text-text-body-dark">
            {tCommon("errors.unexpectedDescription")}
          </p>
        </div>

        <Button onClick={unstable_retry}>{tCommon("retry")}</Button>
      </div>
    </PageLayout>
  );
}
