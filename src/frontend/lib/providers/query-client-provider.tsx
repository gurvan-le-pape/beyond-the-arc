// src/frontend/lib/providers/query-client-provider.tsx
"use client";

import {
  type DefaultedQueryObserverOptions,
  type DefaultError,
  isServer,
  QueryClient,
  type QueryClientConfig,
  QueryClientProvider,
  type QueryKey,
  type QueryObserverOptions,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { ApiError } from "@/shared/types";
import { logger } from "@/shared/utils";

interface Props {
  readonly children: React.ReactNode;
}

/**
 * The client a server render uses: every query's `gcTime` is pinned to
 * `Infinity`, whatever its options factory says.
 *
 * @remarks
 * A finite `gcTime` arms a `setTimeout` when the query is created, and on the
 * server no observer ever subscribes to clear it early. On Node 24 a timer
 * captures the async context it was created in, so each pending timer keeps
 * its entire render (request store, RSC flight data, every query) reachable
 * until it fires, up to 30 minutes later. Measured on a production build:
 * about 0.5 MB retained per page view, and a 384 MB heap aborted after about
 * 1,000 player pages. `Infinity` is TanStack's own server default and arms no
 * timer, so the per-request client is collected with the render.
 *
 * The override goes here and not in `defaultOptions`, because a query's own
 * options are spread last and every `*Queries.ts` factory sets a `gcTime`.
 * All query construction goes through `defaultQueryOptions`.
 */
class ServerQueryClient extends QueryClient {
  override defaultQueryOptions<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = never,
  >(
    options:
      | QueryObserverOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryData,
          TQueryKey,
          TPageParam
        >
      | DefaultedQueryObserverOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryData,
          TQueryKey
        >,
  ): DefaultedQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  > {
    return { ...super.defaultQueryOptions(options), gcTime: Infinity };
  }
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
 */
export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(() => {
    const config: QueryClientConfig = {
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
    };
    const client = isServer
      ? new ServerQueryClient(config)
      : new QueryClient(config);

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
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
