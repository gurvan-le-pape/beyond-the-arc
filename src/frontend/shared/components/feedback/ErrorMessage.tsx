// src/frontend/shared/components/feedback/ErrorMessage.tsx
"use client";

import { useTranslations } from "next-intl";
import { type HTMLAttributes, useState } from "react";

import { cn, logger } from "@/shared/utils";

import { Button } from "../primitives";
import { Text } from "../typography";

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  /**
   * What "Retry" does. Pass the failed query's `refetch` — every error state
   * this component renders is terminal without one: the query client refuses
   * to retry a 4xx at all, gives up after three attempts on anything else
   * (`failureCount < 2`, measured), and `refetchOnWindowFocus` is off — so
   * nothing re-runs the request on its own once the query has settled.
   *
   * A returned promise is awaited to drive the button's pending state, which
   * is the only feedback the user gets: TanStack keeps `status: "error"` while
   * a failed query refetches, so this message stays on screen throughout.
   */
  onRetry?: () => unknown;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * The terminal failure state for a data-backed view: a message and, given
 * `onRetry`, the only way out of it.
 *
 * **Nothing retries on its own once a query has settled** — the reasons are on
 * `onRetry` below. Rendering this without one leaves the user with a dead end,
 * so treat the prop as optional in the types and required in practice.
 *
 * `message` is chosen by the caller from the message catalogue. This never
 * derives copy from an error object, which carries backend prose no user should
 * read.
 */
export const ErrorMessage = ({
  message,
  onRetry,
  className,
  ref,
  ...props
}: ErrorMessageProps) => {
  const tCommon = useTranslations("common");
  const [isRetrying, setIsRetrying] = useState(false);

  // Not an `async` handler: `onClick` expects a void return, and the lint
  // config forbids both a promise-returning attribute and a `void` operator.
  // `.catch` last is what makes the chain non-floating — a TanStack `refetch`
  // resolves with the error rather than rejecting, so it is only ever reached
  // by an `onRetry` that is not one.
  const handleRetry = () => {
    setIsRetrying(true);
    Promise.resolve(onRetry?.())
      .finally(() => setIsRetrying(false))
      .catch((error: unknown) => logger.error(error, "ErrorMessage: retry"));
  };

  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      <Text
        variant="body"
        as="p"
        role="alert"
        className="text-ink-error font-semibold"
      >
        {message}
      </Text>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          isLoading={isRetrying}
          onClick={handleRetry}
        >
          {tCommon("retry")}
        </Button>
      ) : null}
    </div>
  );
};
