// src/frontend/lib/providers/query-client-provider.tsx
"use client";

import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { ApiError } from "@/shared/types";
import { logger } from "@/shared/utils";

interface Props {
  readonly children: React.ReactNode;
  readonly dehydratedState?: DehydratedState | null;
}

/**
 * Supplies the TanStack Query client to the whole app, plus the hydration
 * boundary and the development devtools.
 *
 * **The client is created inside `useState`, and that is load-bearing.** A
 * client built at module scope would be shared across requests on the server
 * and leak one visitor's cached data into another's render. The factory form
 * gives every render tree its own.
 *
 * Two defaults are worth knowing before writing a query. **4xx responses are
 * never retried** — only network failures and 5xx get up to two attempts —
 * because a 400 or 404 will fail identically however often it is repeated. And
 * refetch-on-window-focus is off, so a tab left open does not re-query on
 * return; features that need freshness set their own `staleTime` rather than
 * relying on focus.
 *
 * Every query error is logged **once, here**, through a cache subscription.
 * Hooks and components must not log failures again; they choose UI from
 * `isError` instead.
 *
 * `dehydratedState` exists for server prefetching but no route currently passes
 * one — server-owned data reaches components as props.
 */
export function QueryProvider({ children, dehydratedState }: Props) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          gcTime: 5 * 60 * 1000,
          retry: (failureCount, error) => {
            if (
              error instanceof ApiError &&
              error.statusCode >= 400 &&
              error.statusCode < 500
            )
              return false;
            return failureCount < 2;
          },
          refetchOnWindowFocus: false,
          refetchOnMount: true,
        },
        mutations: {
          retry: 0,
        },
      },
    });

    // Single place where all query errors get logged — no manual logging in hooks
    client.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        logger.error(event.action.error, "QueryCache: query error");
      }
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
