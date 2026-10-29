// src/frontend/shared/hooks/useUrlState.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { decodeUrlState, encodeUrlState, type UrlCodecs } from "@/shared/utils";

/**
 * Page state kept in the query string, so a filtered view survives a reload,
 * the back button and a shared link.
 *
 * `update` takes a partial state and writes it through the History API, which
 * Next keeps `useSearchParams` in sync with. A router navigation would fetch
 * the page from the server on every change, for a query string only the client
 * reads — so a page using this must not read `searchParams` on the server.
 * Each update starts from the live URL, so several in one event build on each
 * other. The URL is replaced, not pushed: refining a filter is not a new page
 * in the history.
 *
 * Needs a Suspense boundary above it, like any `useSearchParams` caller.
 *
 * @param codecs - One codec per state key; the key is the parameter name
 * @returns The decoded state and the update function
 */
export function useUrlState<T>(codecs: UrlCodecs<T>) {
  const searchParams = useSearchParams();

  const state = useMemo(
    () => decodeUrlState(new URLSearchParams(searchParams.toString()), codecs),
    [searchParams, codecs],
  );

  const update = useCallback(
    (patch: Partial<{ [K in keyof T]: T[K] | undefined }>) => {
      const query = encodeUrlState(
        new URLSearchParams(globalThis.location.search),
        codecs,
        patch,
      ).toString();
      globalThis.history.replaceState(
        null,
        "",
        query ? `?${query}` : globalThis.location.pathname,
      );
    },
    [codecs],
  );

  return { state, update };
}
