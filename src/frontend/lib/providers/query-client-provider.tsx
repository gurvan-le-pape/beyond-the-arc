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
