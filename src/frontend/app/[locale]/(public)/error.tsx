// src/frontend/app/[locale]/(public)/error.tsx
"use client";

import { useTranslations } from "next-intl";

import { PageLayout } from "@/shared/components/layouts/PageLayout";

export default function GlobalError({
  unstable_retry,
}: Readonly<{
  unstable_retry: () => void;
}>) {
  const tCommon = useTranslations("common");

  return (
    <PageLayout centered>
      <div className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card dark:shadow-card-dark p-10 max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-light/20 dark:bg-error-dark/20 mx-auto">
          <svg
            className="w-8 h-8 text-error-DEFAULT"
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
          <h1 className="text-subtitle font-bold text-gray-900 dark:text-gray-100">
            {tCommon("errors.unexpected")}
          </h1>
          <p className="text-body-sm text-gray-600 dark:text-gray-400">
            {tCommon("errors.unexpectedDescription")}
          </p>
        </div>

        <button
          onClick={() => unstable_retry()}
          className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-button shadow-card hover:shadow-card-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {tCommon("retry")}
        </button>
      </div>
    </PageLayout>
  );
}
