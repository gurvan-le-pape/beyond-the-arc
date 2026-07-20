// src/frontend/app/[locale]/(public)/error.tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { ErrorCard } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";

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
      <ErrorCard
        title={tCommon("errors.unexpected")}
        description={tCommon("errors.unexpectedDescription")}
        action={{ label: tCommon("retry"), onClick: unstable_retry }}
      />
    </PageLayout>
  );
}
